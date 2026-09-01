import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

function Settings({
  darkMode,
  toggleDarkMode,
  language,
  setLanguage,
  triggerToast
}) {
  const { t, locale, switchLanguage } = useLanguage();

  // =========================
  // Password State
  // =========================
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // =========================
  // Other Settings State
  // =========================
  const [twoFactor, setTwoFactor] = useState(false);

  const [notifs, setNotifs] = useState({
    email: true,
    sms: false,
    system: true
  });

  // =========================
  // Change Password
  // =========================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (passwordLoading) {
      return;
    }

    // Basic validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      triggerToast(
        'Please fill out all password fields',
        'error'
      );
      return;
    }

    // Confirm new password
    if (newPassword !== confirmPassword) {
      triggerToast(
        'New password and confirmation do not match',
        'error'
      );
      return;
    }

    // Minimum password length
    if (newPassword.length < 6) {
      triggerToast(
        'New password must be at least 6 characters',
        'error'
      );
      return;
    }

    // New password must be different
    if (oldPassword === newPassword) {
      triggerToast(
        'New password must be different from current password',
        'error'
      );
      return;
    }

    try {
      setPasswordLoading(true);

      // ==========================================
      // 1. Get currently authenticated Supabase user
      // ==========================================
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          'Error getting current Supabase user:',
          userError
        );

        triggerToast(
          'Unable to identify the current account',
          'error'
        );

        return;
      }

      if (!user || !user.email) {
        console.error(
          'No authenticated Supabase user found.'
        );

        triggerToast(
          'You are not properly authenticated. Please log in again.',
          'error'
        );

        return;
      }

      console.log(
        'Authenticated user:',
        user.email
      );

      // ==========================================
      // 2. Verify CURRENT password
      // ==========================================
      const {
        error: verifyError
      } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword
      });

      if (verifyError) {
        console.error(
          'Current password verification failed:',
          verifyError
        );

        triggerToast(
          'Current password is incorrect',
          'error'
        );

        return;
      }

      console.log(
        'Current password verified successfully.'
      );

      // ==========================================
      // 3. Update password in Supabase Auth
      // ==========================================
      const {
        error: updateError
      } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error(
          'Supabase password update failed:',
          updateError
        );

        triggerToast(
          updateError.message ||
          'Failed to update password',
          'error'
        );

        return;
      }

      // ==========================================
      // 4. Success
      // ==========================================
      console.log(
        'Password successfully updated in Supabase Auth.'
      );

      triggerToast(
        'Password changed successfully!',
        'success'
      );

      // Clear password fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error(
        'Unexpected password change error:',
        error
      );

      triggerToast(
        error?.message ||
        'Something went wrong while changing the password',
        'error'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================
  // Notification Toggle
  // =========================
  const handleNotifToggle = (type) => {
    setNotifs(prev => ({
      ...prev,
      [type]: !prev[type]
    }));

    triggerToast(
      'Notification settings updated!',
      'info'
    );
  };

  // =========================
  // Two Factor Authentication
  // =========================
  const handle2FAToggle = () => {
    setTwoFactor(!twoFactor);

    triggerToast(
      `Two-factor Authentication ${!twoFactor ? 'enabled' : 'disabled'
      }!`,
      'info'
    );
  };

  // =========================
  // Language Change
  // =========================
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;

    const targetLocale =
      selectedLang === 'Hindi' ||
        selectedLang === 'हिंदी'
        ? 'hi'
        : 'en';

    switchLanguage(targetLocale);
    setLanguage(selectedLang);

    triggerToast(
      `Language switched to ${selectedLang}`
    );
  };

  return (
    <div className="space-y-lg animate-fade-in">

      {/* =========================
          Title Header
      ========================== */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">
          {t('settings.title')}
        </h2>

        <p className="font-body-md text-body-md text-on-surface-variant">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

        {/* =========================
            Security / Password
        ========================== */}
        <div className="lg:col-span-2 space-y-lg">

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">

            <h3 className="font-title-sm text-title-sm text-on-surface mb-md">
              {t('settings.securityHeader')}
            </h3>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-md max-w-[480px]"
            >

              {/* Current Password */}
              <div className="space-y-xs">

                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  {t('settings.currentPassword')}
                </label>

                <input
                  value={oldPassword}
                  onChange={(e) =>
                    setOldPassword(e.target.value)
                  }
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  disabled={passwordLoading}
                />

              </div>

              {/* New Password */}
              <div className="space-y-xs">

                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  {t('settings.newPassword')}
                </label>

                <input
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  disabled={passwordLoading}
                />

              </div>

              {/* Confirm New Password */}
              <div className="space-y-xs">

                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  {t('settings.confirmNewPassword')}
                </label>

                <input
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  disabled={passwordLoading}
                />

              </div>

              {/* Update Button */}
              <div className="pt-sm">

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={`px-xl py-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold transition-all shadow-md ${passwordLoading
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:opacity-95 cursor-pointer'
                    }`}
                >
                  {passwordLoading
                    ? 'Updating...'
                    : t('settings.updatePasswordBtn')}
                </button>

              </div>

            </form>
          </div>

          {/* =========================
              Regional / Language
          ========================== */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">

            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">
              {t('settings.regionalHeader')}
            </h3>

            <p className="text-body-sm text-on-surface-variant mb-md">
              {t('settings.regionalSubtitle')}
            </p>

            <div className="space-y-xs max-w-[480px]">

              <label className="font-label-caps text-label-caps text-on-surface-variant">
                {t('settings.systemLanguage')}
              </label>

              <select
                value={locale === 'hi' ? 'Hindi' : 'English'}
                onChange={handleLanguageChange}
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
              >
                <option value="English">
                  English
                </option>

                <option value="Hindi">
                  हिंदी (Hindi)
                </option>
              </select>

            </div>
          </div>

        </div>

        {/* =========================
            Right Configuration Column
        ========================== */}
        <div className="space-y-lg">

          {/* =========================
              Theme Mode
          ========================== */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">

            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">
              {t('settings.displayThemeHeader')}
            </h3>

            <p className="text-body-sm text-on-surface-variant mb-md">
              {t('settings.displayThemeSubtitle')}
            </p>

            <div className="flex items-center justify-between py-sm">

              <span className="font-bold text-body-sm text-on-surface">
                {t('settings.darkModeLabel')}
              </span>

              <button
                type="button"
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode
                    ? 'bg-primary'
                    : 'bg-outline-variant'
                  }`}
              >

                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkMode
                      ? 'translate-x-5'
                      : 'translate-x-0'
                    }`}
                />

              </button>

            </div>
          </div>

          {/* =========================
              2FA
          ========================== */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">

            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">
              {t('settings.mfaHeader')}
            </h3>

            <p className="text-body-sm text-on-surface-variant mb-md">
              {t('settings.mfaSubtitle')}
            </p>

            <div className="flex items-center justify-between py-sm">

              <span className="font-bold text-body-sm text-on-surface">
                {t('settings.enable2fa')}
              </span>

              <button
                type="button"
                onClick={handle2FAToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactor
                    ? 'bg-primary'
                    : 'bg-outline-variant'
                  }`}
              >

                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoFactor
                      ? 'translate-x-5'
                      : 'translate-x-0'
                    }`}
                />

              </button>

            </div>
          </div>

          {/* =========================
              Notifications
          ========================== */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">

            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">
              {t('settings.notifHeader')}
            </h3>

            <p className="text-body-sm text-on-surface-variant mb-md">
              {t('settings.notifSubtitle')}
            </p>

            <div className="space-y-sm">

              {/* Email */}
              <div className="flex items-center justify-between py-sm border-b border-outline-variant/30">

                <div>
                  <h4 className="font-bold text-body-sm text-on-surface">
                    {t('settings.emailNotifs')}
                  </h4>

                  <p className="text-xs text-on-surface-variant">
                    {t('settings.emailNotifsDesc')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleNotifToggle('email')
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.email
                      ? 'bg-primary'
                      : 'bg-outline-variant'
                    }`}
                >

                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.email
                        ? 'translate-x-5'
                        : 'translate-x-0'
                      }`}
                  />

                </button>

              </div>

              {/* SMS */}
              <div className="flex items-center justify-between py-sm border-b border-outline-variant/30">

                <div>
                  <h4 className="font-bold text-body-sm text-on-surface">
                    {t('settings.smsAlerts')}
                  </h4>

                  <p className="text-xs text-on-surface-variant">
                    {t('settings.smsAlertsDesc')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleNotifToggle('sms')
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.sms
                      ? 'bg-primary'
                      : 'bg-outline-variant'
                    }`}
                >

                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.sms
                        ? 'translate-x-5'
                        : 'translate-x-0'
                      }`}
                  />

                </button>

              </div>

              {/* System */}
              <div className="flex items-center justify-between py-sm">

                <div>
                  <h4 className="font-bold text-body-sm text-on-surface">
                    System Bulletins
                  </h4>

                  <p className="text-xs text-on-surface-variant">
                    Platform features release alerts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleNotifToggle('system')
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifs.system
                      ? 'bg-primary'
                      : 'bg-outline-variant'
                    }`}
                >

                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifs.system
                        ? 'translate-x-5'
                        : 'translate-x-0'
                      }`}
                  />

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