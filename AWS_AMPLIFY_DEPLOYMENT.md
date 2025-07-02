
# AWS Amplify Deployment Guide

This guide will help you deploy your React/Vite/Supabase application to AWS Amplify.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, Bitbucket, or AWS CodeCommit)
3. **Supabase Project**: Ensure your Supabase project is properly configured

## Deployment Steps

### 1. Connect Your Repository to AWS Amplify

1. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your Git repository (GitHub, GitLab, Bitbucket, or CodeCommit)
4. Select your repository and branch
5. AWS Amplify will automatically detect the `amplify.yml` build settings

### 2. Configure Build Settings

The `amplify.yml` file is already configured for your project. AWS Amplify will:
- Install dependencies with `npm ci`
- Build the project with `npm run build`
- Deploy from the `dist` directory

### 3. Environment Variables (Optional)

If you want to make your Supabase configuration environment-specific:

1. In the Amplify Console, go to "App settings" → "Environment variables"
2. Add these variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 4. Domain Configuration

#### Default Domain
Your app will be available at: `https://[branch-name].[app-id].amplifyapp.com`

#### Custom Domain (Optional)
1. In the Amplify Console, go to "App settings" → "Domain management"
2. Click "Add domain"
3. Enter your custom domain
4. Follow the DNS configuration steps

### 5. Important Supabase Configuration

Make sure your Supabase project allows your Amplify domain:

1. Go to your Supabase Dashboard
2. Navigate to "Authentication" → "URL Configuration"
3. Add your Amplify URL to:
   - **Site URL**: `https://[your-amplify-domain]`
   - **Redirect URLs**: `https://[your-amplify-domain]/**`

## Build Configuration Details

### amplify.yml
- Uses `npm ci` for faster, reliable installs
- Builds with `npm run build`
- Serves from `dist` directory
- Caches `node_modules` for faster builds

### _redirects
- Handles client-side routing for React Router
- All routes redirect to `index.html` with 200 status

### Build Optimizations
- Code splitting for better performance
- Separate chunks for vendor libraries
- Optimized asset bundling

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility
- Check build logs in Amplify Console

### Routing Issues
- Verify `_redirects` file is in the `public` directory
- Check that React Router is properly configured

### Supabase Connection Issues
- Verify Supabase URL and keys are correct
- Check CORS settings in Supabase
- Ensure authentication redirect URLs are configured

## Deployment Commands

```bash
# Local build test
npm run build

# Preview build locally
npm run preview
```

## Next Steps

1. Push your code to your Git repository
2. Connect to AWS Amplify
3. Configure environment variables (if needed)
4. Update Supabase CORS settings
5. Test your deployed application

Your app will automatically redeploy when you push changes to your connected branch.
