import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function Settings({ 
  darkMode, 
  toggleDarkMode, 
  language, 
  setLanguage, 
  triggerToast 
}) {
  const { t, locale, switchLanguage } = useLanguage();
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
    const targetLocale = selectedLang === 'Hindi' || selectedLang === 'हिंदी' ? 'hi' : 'en';
    switchLanguage(targetLocale);
    setLanguage(selectedLang);
    triggerToast(`Language switched to ${selectedLang}`);
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Title Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">{t('settings.title')}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Security / Password form */}
        <div className="lg:col-span-2 space-y-lg">
          
          {/* Security Form Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-md">{t('settings.securityHeader')}</h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-md max-w-[480px]">
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">{t('settings.currentPassword')}</label>
                <input 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                  type="password"
                />
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">{t('settings.newPassword')}</label>
                <input 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                  type="password"
                />
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">{t('settings.confirmNewPassword')}</label>
                <input 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                  type="password"
                />
              </div>

              <div className="pt-sm">
                <button 
                  type="submit"
                  className="px-xl py-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer"
                >
                  {t('settings.updatePasswordBtn')}
                </button>
              </div>
            </form>
          </div>

          {/* Regional and Language Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">{t('settings.regionalHeader')}</h3>
            <p className="text-body-sm text-on-surface-variant mb-md">{t('settings.regionalSubtitle')}</p>
            
            <div className="space-y-xs max-w-[480px]">
              <label className="font-label-caps text-label-caps text-on-surface-variant">{t('settings.systemLanguage')}</label>
              <select 
                value={locale === 'hi' ? 'Hindi' : 'English'}
                onChange={handleLanguageChange}
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Configurations column */}
        <div className="space-y-lg">
          
          {/* Theme Mode Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">{t('settings.displayThemeHeader')}</h3>
            <p className="text-body-sm text-on-surface-variant mb-md">{t('settings.displayThemeSubtitle')}</p>
            
            <div className="flex items-center justify-between py-sm">
              <span className="font-bold text-body-sm text-on-surface">{t('settings.darkModeLabel')}</span>
              <button 
                type="button"
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* 2FA Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">{t('settings.mfaHeader')}</h3>
            <p className="text-body-sm text-on-surface-variant mb-md">{t('settings.mfaSubtitle')}</p>
            
            <div className="flex items-center justify-between py-sm">
              <span className="font-bold text-body-sm text-on-surface">{t('settings.enable2fa')}</span>
              <button 
                type="button"
                onClick={handle2FAToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactor ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoFactor ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">{t('settings.notifHeader')}</h3>
            <p className="text-body-sm text-on-surface-variant mb-md">{t('settings.notifSubtitle')}</p>
            
            <div className="space-y-sm">
              <div className="flex items-center justify-between py-sm border-b border-outline-variant/30">
                <div>
                  <h4 className="font-bold text-body-sm text-on-surface">{t('settings.emailNotifs')}</h4>
                  <p className="text-xs text-on-surface-variant">{t('settings.emailNotifsDesc')}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleNotifToggle('email')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.email ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.email ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-sm border-b border-outline-variant/30">
                <div>
                  <h4 className="font-bold text-body-sm text-on-surface">{t('settings.smsAlerts')}</h4>
                  <p className="text-xs text-on-surface-variant">{t('settings.smsAlertsDesc')}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleNotifToggle('sms')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.sms ? 'bg-primary' : 'bg-outline-variant'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.sms ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-sm">
                <div>
                  <h4 className="font-bold text-body-sm text-on-surface">System Bulletins</h4>
                  <p className="text-xs text-on-surface-variant">Platform features release alerts</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleNotifToggle('system')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.system ? 'bg-primary' : 'bg-outline-variant'}`}
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
