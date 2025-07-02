
import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { fetchUserProfile } from '../../services/profileService';

const Profile = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    company_name: '',
    operations_description: '',
    reporting_year_end_date: '',
    software_used: '',
    first_year_reporting: false,
    applicable_framework: '',
    has_multiple_locations: false,
    has_subsidiaries: false,
    number_of_subsidiaries: '',
    gathering_data_via_app: false,
    full_name: '',
    business_registration_number: '',
    job_title: '',
    phone: '',
    service_needed: '',
    preferred_contact: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await fetchUserProfile(user?.id);

      if (profileData) {
        setProfile({
          company_name: profileData.company_name || '',
          operations_description: profileData.operations_description || '',
          reporting_year_end_date: profileData.reporting_year_end_date || '',
          software_used: profileData.software_used || '',
          first_year_reporting: profileData.first_year_reporting || false,
          applicable_framework: profileData.applicable_framework || '',
          has_multiple_locations: profileData.has_multiple_locations || false,
          has_subsidiaries: profileData.has_subsidiaries || false,
          number_of_subsidiaries: profileData.number_of_subsidiaries?.toString() || '',
          gathering_data_via_app: profileData.gathering_data_via_app || false,
          full_name: profileData.full_name || '',
          business_registration_number: profileData.business_registration_number || '',
          job_title: profileData.job_title || '',
          phone: profileData.phone || '',
          service_needed: profileData.service_needed || '',
          preferred_contact: profileData.preferred_contact || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to save your profile');
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        company_name: profile.company_name,
        operations_description: profile.operations_description,
        reporting_year_end_date: profile.reporting_year_end_date || null,
        software_used: profile.software_used,
        first_year_reporting: profile.first_year_reporting,
        applicable_framework: profile.applicable_framework,
        has_multiple_locations: profile.has_multiple_locations,
        has_subsidiaries: profile.has_subsidiaries,
        number_of_subsidiaries: profile.number_of_subsidiaries ? parseInt(profile.number_of_subsidiaries) : null,
        gathering_data_via_app: profile.gathering_data_via_app,
        full_name: profile.full_name,
        business_registration_number: profile.business_registration_number,
        job_title: profile.job_title,
        phone: profile.phone,
        service_needed: profile.service_needed,
        preferred_contact: profile.preferred_contact,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Company Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <Input 
                value={profile.full_name} 
                onChange={e => handleChange('full_name', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Job Title</label>
              <Input 
                value={profile.job_title} 
                onChange={e => handleChange('job_title', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <Input 
                value={profile.phone} 
                onChange={e => handleChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Preferred Contact Method</label>
              <select 
                className="w-full border rounded px-3 py-2"
                value={profile.preferred_contact}
                onChange={e => handleChange('preferred_contact', e.target.value)}
              >
                <option value="">Select contact method</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Company Information Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Company Name</label>
              <Input 
                value={profile.company_name} 
                onChange={e => handleChange('company_name', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Business Registration Number</label>
              <Input 
                value={profile.business_registration_number} 
                onChange={e => handleChange('business_registration_number', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Operations Description</label>
              <textarea 
                className="w-full border rounded px-3 py-2 h-24" 
                value={profile.operations_description}
                onChange={e => handleChange('operations_description', e.target.value)}
                placeholder="Describe your company's operations and activities"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Service Needed</label>
              <select 
                className="w-full border rounded px-3 py-2"
                value={profile.service_needed}
                onChange={e => handleChange('service_needed', e.target.value)}
              >
                <option value="">Select service</option>
                <option value="esg_reporting">ESG Reporting</option>
                <option value="carbon_footprint">Carbon Footprint Assessment</option>
                <option value="sustainability_consulting">Sustainability Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* ESG Reporting Information Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">ESG Reporting Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Reporting Year End Date</label>
              <Input 
                type="date"
                value={profile.reporting_year_end_date} 
                onChange={e => handleChange('reporting_year_end_date', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Software Currently Used</label>
              <Input 
                value={profile.software_used} 
                onChange={e => handleChange('software_used', e.target.value)}
                placeholder="e.g., Excel, SAP, custom software"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Applicable Framework</label>
              <Input 
                value={profile.applicable_framework} 
                onChange={e => handleChange('applicable_framework', e.target.value)}
                placeholder="e.g., GRI, SASB, TCFD"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Number of Subsidiaries</label>
              <Input 
                type="number"
                min="0"
                value={profile.number_of_subsidiaries} 
                onChange={e => handleChange('number_of_subsidiaries', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="first_year_reporting"
                checked={profile.first_year_reporting}
                onChange={e => handleChange('first_year_reporting', e.target.checked)}
              />
              <label htmlFor="first_year_reporting" className="font-medium">First Year Reporting</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="has_multiple_locations"
                checked={profile.has_multiple_locations}
                onChange={e => handleChange('has_multiple_locations', e.target.checked)}
              />
              <label htmlFor="has_multiple_locations" className="font-medium">Has Multiple Locations</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="has_subsidiaries"
                checked={profile.has_subsidiaries}
                onChange={e => handleChange('has_subsidiaries', e.target.checked)}
              />
              <label htmlFor="has_subsidiaries" className="font-medium">Has Subsidiaries</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="gathering_data_via_app"
                checked={profile.gathering_data_via_app}
                onChange={e => handleChange('gathering_data_via_app', e.target.checked)}
              />
              <label htmlFor="gathering_data_via_app" className="font-medium">Gathering Data via App</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-green-500 hover:bg-green-600 text-white px-8"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
