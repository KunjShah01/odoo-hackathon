import { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell, Palette, Globe, Shield, Save, Eye, EyeOff } from 'lucide-react';

const NOTIFICATION_OPTIONS = [
  { id: 'email', label: 'Email Notifications' },
  { id: 'push', label: 'Push Notifications' },
  { id: 'approval', label: 'Approval Reminders' },
  { id: 'reports', label: 'Weekly Reports' },
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
];

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'GMT/BST' },
  { value: 'Europe/Paris', label: 'CET' },
];

export function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [saved, setSaved] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    department: '',
    jobTitle: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    approval: true,
    reports: false,
  });

  const [preferences, setPreferences] = useState({
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    theme: 'system',
    compactMode: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardBody className="p-2">
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardBody>
          </Card>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <User className="text-slate-400" size={32} />
                    )}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                    <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={profileForm.firstName}
                    onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={profileForm.lastName}
                    onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                  <Input
                    label="Department"
                    value={profileForm.department}
                    onChange={e => setProfileForm({ ...profileForm, department: e.target.value })}
                  />
                  <Input
                    label="Job Title"
                    value={profileForm.jobTitle}
                    onChange={e => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save size={18} />
                    {saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security options</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Change Password</h4>
                  <div className="space-y-4 max-w-md">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={profileForm.phone}
                        onChange={() => {}}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={profileForm.phone}
                        onChange={() => {}}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={profileForm.phone}
                      onChange={() => {}}
                    />
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="text-slate-600" size={20} />
                      <div>
                        <p className="font-medium text-slate-900">Authenticator App</p>
                        <p className="text-sm text-slate-600">Use an authenticator app to generate codes</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Enable</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Chrome on Windows</p>
                        <p className="text-sm text-slate-600">Current session</p>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Active now</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Safari on iPhone</p>
                        <p className="text-sm text-slate-600">Last active 2 hours ago</p>
                      </div>
                      <Button variant="secondary" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="space-y-4">
                  {NOTIFICATION_OPTIONS.map(option => (
                    <div key={option.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="text-slate-600" size={20} />
                        <span className="font-medium text-slate-900">{option.label}</span>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [option.id]: !notifications[option.id as keyof typeof notifications] })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications[option.id as keyof typeof notifications] ? 'bg-cyan-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          notifications[option.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save size={18} />
                    {saved ? 'Saved!' : 'Save Preferences'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>Customize your display settings</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Currency"
                    value={preferences.currency}
                    onChange={e => setPreferences({ ...preferences, currency: e.target.value })}
                    options={CURRENCY_OPTIONS}
                  />
                  <Select
                    label="Timezone"
                    value={preferences.timezone}
                    onChange={e => setPreferences({ ...preferences, timezone: e.target.value })}
                    options={TIMEZONE_OPTIONS}
                  />
                  <Select
                    label="Language"
                    value={preferences.language}
                    onChange={e => setPreferences({ ...preferences, language: e.target.value })}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                      { value: 'de', label: 'German' },
                    ]}
                  />
                  <Select
                    label="Theme"
                    value={preferences.theme}
                    onChange={e => setPreferences({ ...preferences, theme: e.target.value })}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'system', label: 'System' },
                    ]}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="text-slate-600" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">Compact Mode</p>
                      <p className="text-sm text-slate-600">Show more items on screen</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, compactMode: !preferences.compactMode })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.compactMode ? 'bg-cyan-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      preferences.compactMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save size={18} />
                    {saved ? 'Saved!' : 'Save Preferences'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}