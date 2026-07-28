import React, { useState } from 'react';

function Settings({ 
  darkMode, 
  toggleDarkMode, 
  language, 
  setLanguage, 
  triggerToast 
}) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifs, setNotifs] = useState({
    email: true,
    sms: false,
    system: true
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      triggerToast('Please fill out all password fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('New password and confirmation do not match', 'error');
      return;
    }
    triggerToast('Password changed successfully!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotifToggle = (type) => {
    setNotifs(prev => ({ ...prev, [type]: !prev[type] }));
    triggerToast(`Notification settings updated!`, 'info');
  };

  const handle2FAToggle = () => {
    setTwoFactor(!twoFactor);
    triggerToast(`Two-factor Authentication ${!twoFactor ? 'enabled' : 'disabled'}!`, 'info');
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    triggerToast(`Language switched to ${selectedLang}`);
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Title Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs dark:text-slate-100">Portal Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Configure security permissions, alert channels, and personalized details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Security / Password form */}
        <div className="lg:col-span-2 space-y-lg">
          
          {/* Security Form Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-md dark:text-slate-100">Security & Credentials</h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-md max-w-[480px]">
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">Current Password</label>
                <input 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  type="password"
                />
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">New Password</label>
                <input 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  type="password"
                />
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">Confirm New Password</label>
                <input 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  type="password"
                />
              </div>

              <div className="pt-sm">
                <button 
                  type="submit"
                  className="px-xl py-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-colors shadow-md dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Regional and Language Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs dark:text-slate-100">Regional Settings</h3>
            <p className="text-body-sm text-on-surface-variant dark:text-slate-400 mb-md">Select your preferred default language interface for commission sheets.</p>
            
            <div className="space-y-xs max-w-[480px]">
              <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">System Language</label>
              <select 
                value={language}
                onChange={handleLanguageChange}
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>

        </div>

        {/* Configurations column */}
        <div className="space-y-lg">
          
          {/* Theme Mode Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs dark:text-slate-100">Display Theme</h3>
            <p className="text-body-sm text-on-surface-variant dark:text-slate-400 mb-md">Choose between light and dark display modes for optimization.</p>
            
            <div className="flex items-center justify-between py-sm">
              <span className="font-bold text-body-sm text-on-surface dark:text-slate-200">Dark Mode Interface</span>
              <button 
                type="button"
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-primary dark:bg-blue-600' : 'bg-outline-variant dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* 2FA Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs dark:text-slate-100">Multi-Factor Authentication</h3>
            <p className="text-body-sm text-on-surface-variant dark:text-slate-400 mb-md">Add an extra layer of protection to your commission wallet withdrawals.</p>
            
            <div className="flex items-center justify-between py-sm">
              <span className="font-bold text-body-sm text-on-surface dark:text-slate-200">Enable 2FA (Authenticator App)</span>
              <button 
                type="button"
                onClick={handle2FAToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactor ? 'bg-primary dark:bg-blue-600' : 'bg-outline-variant dark:bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoFactor ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs dark:text-slate-100">Notification Channels</h3>
            <p className="text-body-sm text-on-surface-variant dark:text-slate-400 mb-md">Select your preferred alert channels for transaction receipts and team growth.</p>
            
            <div className="space-y-sm">
              <div className="flex items-center justify-between py-sm border-b border-outline-variant/30 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-body-sm text-on-surface dark:text-slate-200">Email Notifications</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">Weekly business digest, payout receipts</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleNotifToggle('email')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.email ? 'bg-primary dark:bg-blue-600' : 'bg-outline-variant dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.email ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-sm border-b border-outline-variant/30 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-body-sm text-on-surface dark:text-slate-200">SMS Alerts</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">Instant messages on downline recruitment</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleNotifToggle('sms')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.sms ? 'bg-primary dark:bg-blue-600' : 'bg-outline-variant dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.sms ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-sm">
                <div>
                  <h4 className="font-bold text-body-sm text-on-surface dark:text-slate-200">System Bulletins</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">Platform features release alerts</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleNotifToggle('system')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.system ? 'bg-primary dark:bg-blue-600' : 'bg-outline-variant dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.system ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Settings;
