
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    
    const XERO_CLIENT_ID = Deno.env.get('XERO_CLIENT_ID')
    const XERO_CLIENT_SECRET = Deno.env.get('XERO_CLIENT_SECRET')
    
    if (!XERO_CLIENT_ID || !XERO_CLIENT_SECRET) {
      console.error('Missing Xero credentials')
      return new Response(
        JSON.stringify({ error: 'Xero credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'auth') {
      // Generate OAuth URL
      const redirectUri = `${req.headers.get('origin')}/my-esg`
      const state = crypto.randomUUID()
      const scope = 'accounting.transactions accounting.contacts accounting.settings'
      
      // Store state in session or database for verification
      const authUrl = `https://login.xero.com/identity/connect/authorize?` +
        `response_type=code&` +
        `client_id=${XERO_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${state}`

      console.log('Generated auth URL:', authUrl)

      return new Response(
        JSON.stringify({ authUrl, state }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'callback') {
      // Handle OAuth callback
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      
      if (!code) {
        return new Response(
          JSON.stringify({ error: 'No authorization code received' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Processing OAuth callback with code:', code)

      // Exchange code for tokens
      const tokenResponse = await fetch('https://identity.xero.com/connect/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${XERO_CLIENT_ID}:${XERO_CLIENT_SECRET}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `${req.headers.get('origin')}/my-esg`,
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error('Token exchange failed:', errorText)
        return new Response(
          JSON.stringify({ error: 'Token exchange failed', details: errorText }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const tokenData = await tokenResponse.json()
      console.log('Token exchange successful')

      // Get tenant information
      const connectionsResponse = await fetch('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })

      if (!connectionsResponse.ok) {
        console.error('Failed to get connections')
        return new Response(
          JSON.stringify({ error: 'Failed to get tenant information' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const connections = await connectionsResponse.json()
      console.log('Got connections:', connections.length)

      // Store connection in database
      for (const connection of connections) {
        const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        
        const { error: connectionError } = await supabase
          .from('xero_connections')
          .upsert({
            user_id: user.id,
            tenant_id: connection.tenantId,
            tenant_name: connection.tenantName,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: expiresAt,
            scopes: tokenData.scope?.split(' ') || [],
            connection_status: 'active',
            last_sync_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,tenant_id'
          })

        if (connectionError) {
          console.error('Database error:', connectionError)
          return new Response(
            JSON.stringify({ error: 'Failed to store connection', details: connectionError }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get organization details
        try {
          const orgResponse = await fetch('https://api.xero.com/api.xro/2.0/Organisation', {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'Xero-tenant-id': connection.tenantId,
            },
          })

          if (orgResponse.ok) {
            const orgData = await orgResponse.json()
            const organisation = orgData.Organisations?.[0]

            if (organisation) {
              await supabase
                .from('xero_companies')
                .upsert({
                  connection_id: (await supabase
                    .from('xero_connections')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('tenant_id', connection.tenantId)
                    .single()).data?.id,
                  xero_organisation_id: organisation.OrganisationID,
                  name: organisation.Name,
                  legal_name: organisation.LegalName,
                  tax_number: organisation.TaxNumber,
                  country_code: organisation.CountryCode,
                  currency_code: organisation.DefaultCurrency,
                  financial_year_end_day: organisation.FinancialYearEndDay,
                  financial_year_end_month: organisation.FinancialYearEndMonth,
                })
            }
          }
        } catch (error) {
          console.error('Failed to fetch organization details:', error)
        }
      }

      console.log('Xero integration completed successfully')

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Xero connected successfully',
          connections: connections.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Xero OAuth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
