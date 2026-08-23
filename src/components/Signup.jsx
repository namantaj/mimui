import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateReferralCode } from '../services/authService';
import { useLanguage } from '../context/LanguageContext';

function Signup({ setRoute, triggerToast }) {
  const { signup } = useAuth();
  const { t, locale, switchLanguage } = useLanguage();
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  
  // Validation States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Success Screen State
  const [createdUser, setCreatedUser] = useState(null);

  const validate = async () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = t('auth.errors.fullNameRequired');
    }

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = t('auth.errors.emailOrPhoneRequired');
    } else if (emailOrPhone.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrPhone.trim())) {
        newErrors.emailOrPhone = t('auth.errors.invalidEmail');
      }
    }

    if (!password) {
      newErrors.password = t('auth.errors.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('auth.errors.passwordMin');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordMismatch');
    }

    if (!referralCode.trim()) {
      newErrors.referralCode = t('auth.errors.sponsorCodeRequired');
    } else {
      // Validate referral code asynchronously
      const isValid = await validateReferralCode(referralCode.trim());
      if (!isValid) {
        newErrors.referralCode = t('auth.errors.invalidSponsorCode');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const isValid = await validate();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const responseUser = await signup({
        fullName: fullName.trim(),
        emailOrPhone: emailOrPhone.trim(),
        password,
        referralCode: referralCode.trim()
      });

      triggerToast(t('auth.successToast'));
      setCreatedUser(responseUser);
    } catch (err) {
      setSubmitError(err.message || t('auth.errors.failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceed = () => {
    setRoute('policy');
  };

  // If successfully registered, show referral code info card
  if (createdUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fade-in transition-colors duration-200">
        <div className="w-full max-w-[460px] bg-cream border border-sand rounded-2xl shadow-lg p-8 space-y-6 text-center">
          
          <div className="h-16 w-16 bg-forest/10 rounded-full flex items-center justify-center text-forest mx-auto">
            <span className="material-symbols-outlined text-[36px] filled-icon">check_circle</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-[20px] font-bold text-espresso">{t('auth.welcome')}</h2>
            <p className="text-[13px] text-warm-gray">{t('auth.accountActive')}</p>
          </div>

          {/* Generated Referral Code Card */}
          <div className="bg-bone border border-sand rounded-xl p-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-warm-gray">{t('auth.assignedCodeTitle')}</p>
            <p className="text-[24px] font-bold text-primary tracking-wider font-mono">
              {createdUser.referralCode}
            </p>
            <p className="text-[12px] text-warm-gray leading-relaxed pt-1">
              {t('auth.assignedCodeDesc')}
            </p>
          </div>

          <button
            onClick={handleProceed}
            className="w-full h-11 bg-primary text-on-primary text-[14px] font-semibold rounded-xl hover:bg-[#641722] transition-colors shadow-sm flex items-center justify-center cursor-pointer"
          >
            {t('auth.goToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fade-in transition-colors duration-200">
      <div className="w-full max-w-[460px] bg-cream border border-sand rounded-2xl shadow-lg p-8 space-y-6">
        
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

        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <img src="/logo.png" alt="Bhagwn Solutions" className="h-14 w-auto object-contain mb-2" />
          <p className="text-[13px] font-medium text-warm-gray tracking-wide">Create Executive Partner Account</p>
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
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-warm-gray">Full Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray text-[18px]">badge</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alexander Wright"
                className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-bone text-espresso text-[14px] transition-all focus:outline-none focus:ring-1 ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-sand focus:border-primary focus:ring-primary/20 placeholder:text-warm-gray/50'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-[12px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email / Phone */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-warm-gray">Email or Phone Number</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray text-[18px]">mail</span>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="alexander@mlmenterprise.com"
                className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-bone text-espresso text-[14px] transition-all focus:outline-none focus:ring-1 ${
                  errors.emailOrPhone
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-sand focus:border-primary focus:ring-primary/20 placeholder:text-warm-gray/50'
                }`}
              />
            </div>
            {errors.emailOrPhone && (
              <p className="text-[12px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                {errors.emailOrPhone}
              </p>
            )}
          </div>

          {/* Sponsor Referral Code */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-warm-gray">Sponsor / Referral Code</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray text-[18px]">link</span>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="REF1001"
                className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-bone text-espresso text-[14px] transition-all focus:outline-none focus:ring-1 ${
                  errors.referralCode
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-sand focus:border-primary focus:ring-primary/20 placeholder:text-warm-gray/50'
                }`}
              />
            </div>
            {errors.referralCode && (
              <p className="text-[12px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                {errors.referralCode}
              </p>
            )}
          </div>

          {/* Passwords grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-warm-gray">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray text-[18px]">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-bone text-espresso text-[14px] transition-all focus:outline-none focus:ring-1 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-sand focus:border-primary focus:ring-primary/20 placeholder:text-warm-gray/50'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[12px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-warm-gray">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray text-[18px]">lock_reset</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-bone text-espresso text-[14px] transition-all focus:outline-none focus:ring-1 ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-sand focus:border-primary focus:ring-primary/20 placeholder:text-warm-gray/50'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[12px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary text-on-primary text-[14px] font-semibold rounded-xl hover:bg-[#641722] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Creating account...</span>
              </>
            ) : (
              'Register as Partner'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-3 border-t border-sand/60">
          <p className="text-[13px] text-warm-gray">
            Already have an account?{' '}
            <button
              onClick={() => setRoute('login')}
              className="font-bold text-primary hover:underline cursor-pointer"
            >
              Log in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Signup;
