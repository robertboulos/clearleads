import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Key, Bell, Shield, Copy, RefreshCw } from 'lucide-react';
import { generateApiKey } from '../utils/formatting';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [apiKey, setApiKey] = useState(user?.apiKey || '');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const updatedUser = await authService.updateProfile({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        country: formData.get('country') as string,
      });
      
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  const handleRegenerateApiKey = async () => {
    try {
      const response = await authService.regenerateApiKey();
      setApiKey(response);
      updateUser({ apiKey: response });
      toast.success('API key regenerated successfully');
    } catch (error) {
      toast.error('Failed to regenerate API key');
      console.error('API key regeneration error:', error);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              defaultValue={user?.name}
              placeholder="Enter your full name"
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              defaultValue={user?.email}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              type="text"
              name="company"
              defaultValue={user?.company}
              placeholder="Enter your company name"
            />
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              defaultValue={user?.phone}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <Input
              label="Address"
              type="text"
              name="address"
              defaultValue={user?.address}
              placeholder="Enter your street address"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              label="City"
              type="text"
              name="city"
              defaultValue={user?.city}
              placeholder="Enter your city"
            />
            <Input
              label="State/Province"
              type="text"
              name="state"
              defaultValue={user?.state}
              placeholder="Enter your state"
            />
            <Input
              label="ZIP/Postal Code"
              type="text"
              name="zip"
              defaultValue={user?.zip}
              placeholder="Enter your ZIP code"
            />
          </div>
          
          <div>
            <Input
              label="Country"
              type="text"
              name="country"
              defaultValue={user?.country}
              placeholder="Enter your country"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                )}
              </div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
          </div>
          
          <Button type="submit">
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">API Keys</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
              Your API Key
            </label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyApiKey}
                icon={<Copy className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateApiKey}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">Regenerate</span>
              </Button>
            </div>
          </div>
          <div className="font-mono text-xs sm:text-sm bg-white p-3 rounded border break-all">
            {apiKey}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">API Usage</h4>
          <p className="text-sm text-blue-800">
            Use this API key to integrate ClearLeads validation into your applications.
            Visit our <a href="#" className="underline">API documentation</a> for examples.
          </p>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { id: 'email', label: 'Email notifications', description: 'Receive email updates about your account' },
            { id: 'credits', label: 'Credit alerts', description: 'Get notified when credits are running low' },
            { id: 'validations', label: 'Validation updates', description: 'Updates about batch processing status' },
            { id: 'marketing', label: 'Marketing emails', description: 'Product updates and feature announcements' },
          ].map((setting) => (
            <div key={setting.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100">
              <div className="mb-2 sm:mb-0">
                <p className="font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                defaultChecked={setting.id !== 'marketing'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Change Password</h4>
            <p className="text-sm text-gray-600 mb-4">
              Update your password to keep your account secure
            </p>
            <Button variant="outline">
              Change Password
            </Button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600 mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">
              Enable 2FA
            </Button>
          </div>
          
          <div className="p-4 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
            <p className="text-sm text-red-600 mb-4">
              Permanently delete your account and all associated data
            </p>
            <Button variant="danger">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'api':
        return renderApiSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Mobile Tab Selector */}
          <div className="sm:hidden border-b border-gray-200">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-4 text-sm font-medium bg-white border-none focus:outline-none"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-4 sm:p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};