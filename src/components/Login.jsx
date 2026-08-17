import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Login({ setRoute, triggerToast }) {
  const { login } = useAuth();
  const { t, locale, switchLanguage } = useLanguage();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(emailOrPhone.trim(), password);
      triggerToast('Logged in successfully!');
      setRoute('dashboard'); // Redirect to dashboard
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    triggerToast('Mock password reset email sent to registered account!', 'info');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fade-in transition-colors duration-200">
      <div className="w-full max-w-[440px] bg-cream border border-sand rounded-2xl shadow-lg p-8 space-y-6">
        
        {/* Back to Home & Language Switcher Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-sand/60">
          <button
            onClick={() => setRoute('landing')}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-warm-gray hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            {t('common.backToHome')}
          </button>
          <button 
            onClick={() => switchLanguage(locale === 'en' ? 'hi' : 'en')}
            className="h-7 px-2.5 rounded-lg bg-bone border border-sand hover:bg-ivory text-[11px] font-semibold text-espresso transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px] text-gold">translate</span>
            <span>{locale === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
          </button>
        </div>

        {/* Brand / Logo Title Area */}
        <div className="text-center flex flex-col items-center">
          <img src="/logo.png" alt="Bhagwn Solutions" className="h-14 w-auto object-contain mb-2" />
          <p className="text-[13px] font-medium text-warm-gray tracking-wide">{t('auth.loginTitle')}</p>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{submitError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email / Phone Field */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-warm-gray">{t('auth.emailOrPhoneLabel')}</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray text-[18px]">person</span>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="alexander@mlmenterprise.com"
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-sand bg-bone text-espresso text-[14px] transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-warm-gray/50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-warm-gray">{t('auth.passwordLabel')}</label>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-[12px] font-semibold text-primary hover:underline"
              >
                {t('auth.forgotPassword')}
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray text-[18px]">lock</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-sand bg-bone text-espresso text-[14px] transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-warm-gray/50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary text-on-primary text-[14px] font-semibold rounded-xl hover:bg-[#641722] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Signing in...</span>
              </>
            ) : (
              t('common.signIn')
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center pt-3 border-t border-sand/60">
          <p className="text-[13px] text-warm-gray">
            {t('auth.dontHaveAccount')}{' '}
            <button
              onClick={() => setRoute('signup')}
              className="font-bold text-primary hover:underline cursor-pointer"
            >
              {t('common.signUp')}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
