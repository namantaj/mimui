import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Profile({
  setRoute,
  activeTab,
  setActiveTab,
  profileForm,
  handleProfileChange,
  handleProfileSubmit,
  bankForm,
  handleBankChange,
  handleBankSubmit,
  planForm,
  handlePlanChange,
  handlePlanSubmit,
  kycForm,
  handleKycChange,
  handleKycSubmit,
  triggerToast
}) {
  const { hasCompletedProfile, completeProfile } = useAuth();
  const { t } = useLanguage();
  
  // Visibility Toggles for Sensitive Fields (Aadhaar & Bank Account Number)
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showAccountNum, setShowAccountNum] = useState(false);

  // Helper to format/mask Aadhaar
  const getMaskedAadhaar = (val) => {
    if (!val) return 'XXXX XXXX 1234';
    if (showAadhaar) return val;
    const clean = val.replace(/\s+/g, '');
    if (clean.length >= 4) {
      return `XXXX XXXX ${clean.slice(-4)}`;
    }
    return 'XXXX XXXX 1234';
  };

  // Helper to format/mask Bank Account
  const getMaskedAccount = (val) => {
    if (!val) return '•••• •••• •••• 5678';
    if (showAccountNum) return val;
    const clean = val.replace(/\s+/g, '');
    if (clean.length >= 4) {
      return `•••• •••• •••• ${clean.slice(-4)}`;
    }
    return '•••• •••• •••• 5678';
  };

  // Calculate Required Field Progress during Onboarding
  const requiredFieldValues = [
    profileForm.fullName,
    profileForm.fatherOrHusbandName,
    profileForm.motherName,
    profileForm.email,
    profileForm.phone,
    profileForm.dob,
    profileForm.gender,
    profileForm.nationality,
    profileForm.aadhaarNumber,
    profileForm.street,
    profileForm.city,
    profileForm.state,
    profileForm.zip,
    profileForm.country,
    profileForm.nomineeName,
    profileForm.nomineeRelation,
    bankForm.bankName,
    bankForm.accountNumber,
    bankForm.holderName,
    bankForm.ifscCode,
    bankForm.accountType,
    planForm.planName,
    planForm.schemeAmount
  ];

  const filledCount = requiredFieldValues.filter(val => val && String(val).trim() !== '').length;
  const totalRequired = requiredFieldValues.length;
  const progressPercentage = Math.round((filledCount / totalRequired) * 100);
  const isProfileCompleteValid = filledCount === totalRequired;

  const handleFinalCompletion = (e) => {
    if (e) e.preventDefault();
    if (!isProfileCompleteValid) {
      triggerToast('Please complete all required fields (* Required) before unlocking the portal!', 'info');
      return;
    }
    completeProfile();
    triggerToast(
      t('profile.profileCompletedTitle') || 'Profile Setup Completed ✓ Executive Dashboard Unlocked!'
    );
    if (setRoute) {
      setRoute('dashboard');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ONBOARDING MANDATORY WIZARD HEADER (Shown when profile is incomplete) */}
      {!hasCompletedProfile && (
        <div className="bg-gradient-to-r from-[#7D1F2B] via-primary to-[#641722] text-on-primary rounded-2xl px-6 sm:px-8 py-5 sm:py-6 shadow-lg border border-gold/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
            
            {/* LEFT — Main Information (60-65% width) */}
            <div className="flex-1 md:max-w-[65%] space-y-1.5">
              {/* Badges Row */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold bg-black/35 px-2.5 py-0.5 rounded border border-gold/30">
                  {t('profile.stepBadge') || 'STEP 2 OF 2 — REQUIRED ONBOARDING'}
                </span>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase bg-red-600/90 text-white px-2.5 py-0.5 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  PORTAL LOCKED
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-cream tracking-tight leading-snug">
                {t('profile.onboardingTitle') || 'Complete Your Profile'}
              </h1>
              
              {/* Subtitle / Description (Normal horizontal paragraph width) */}
              <p className="text-sm sm:text-base text-cream/90 font-medium leading-relaxed">
                {t('profile.onboardingSubtitle') || 'Please complete your profile details before accessing the Executive Portal.'}
              </p>
            </div>

            {/* RIGHT — Compact Completion Status Panel */}
            <div className="w-full md:w-[32%] shrink-0">
              <div className="bg-black/25 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/15 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-cream">
                  <span className="uppercase text-[11px] tracking-wider">PROFILE COMPLETION</span>
                  <span className="text-gold font-mono text-base font-extrabold">{progressPercentage}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-cream/80 font-medium text-right">
                  {filledCount} of {totalRequired} required fields completed
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Status Message Line with Visible Divider */}
          <div className="mt-3.5 pt-3.5 border-t border-white/20 flex items-center gap-2 text-xs text-cream/90 font-medium">
            <span className="material-symbols-outlined text-[16px] text-gold shrink-0">lock</span>
            <span>
              <strong className="text-gold font-semibold">Executive Portal is currently locked.</strong> Complete all required profile fields below to enable portal features.
            </span>
          </div>
        </div>
      )}

      {/* 1. Executive Summary Header Card (Shown after onboarding is completed) */}
      {hasCompletedProfile && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            
            {/* Avatar Picture */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-surface shadow-sm relative shrink-0">
              <img 
                alt="Profile Picture" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe8oLmHDjQpBARIImVqHvbh-ono3iANmz82cN0HNIuMXp_uoyQ4ZIMNgWKt7U_gmgBcHnpsD9jOWfUuIIImIe_pzvTcDRcnmD2mUVk1twt8IvTMuNcV5CFoI61OZD5GEex2j1ycgdYeilCQ4ijjf1zAaULdttqOMrA3GCWb530NxxxkuKOMLU7dQf06irnQ0yH_Me8dAKADm-VLwOcU91AquzmvS_DdBPe3QK_9BC7ctdtEU_Xxje9"
              />
              <button 
                type="button"
                onClick={() => triggerToast("Upload avatar dialog coming soon!")}
                className="absolute bottom-0 right-0 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-colors shadow-md cursor-pointer"
                title="Change Profile Photo"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>

            {/* User Basic Info & Badges */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-0.5">{profileForm.fullName}</h2>
                  <p className="text-body-sm text-on-surface-variant font-medium">
                    {profileForm.email} • <span className="font-mono text-espresso font-semibold">ID: MLM-847291</span>
                  </p>
                </div>
                <div className="flex gap-2 justify-center md:justify-end">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold border border-tertiary/20">
                    <span className="material-symbols-outlined text-xs mr-1">check_circle</span> {t('profile.verified')}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/20">
                    Gold Executive Partner
                  </span>
                </div>
              </div>
              
              {/* Executive Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-outline-variant pt-4">
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">{t('profile.joinDate')}</p>
                  <p className="text-base font-bold text-on-surface">Oct 12, 2021</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">{t('profile.directReferrals')}</p>
                  <p className="text-base font-bold text-on-surface">42</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">{t('profile.teamSize')}</p>
                  <p className="text-base font-bold text-on-surface">1,284</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">{t('profile.totalEarnings')}</p>
                  <p className="text-base font-bold text-primary">$45,250.00</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Main Reorganized Tabbed Interface */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant overflow-x-auto hide-scrollbar bg-surface-container-lowest">
          {[
            { id: 'personal', label: t('profile.personalTab'), icon: 'person' },
            { id: 'bank', label: t('profile.bankTab'), icon: 'account_balance' },
            { id: 'plan', label: t('profile.planTab') || 'Plan & Referral', icon: 'verified' },
            { id: 'kyc', label: t('profile.kycTab'), icon: 'badge' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'text-primary border-primary bg-surface-container-low' 
                    : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-lowest'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isActive ? 'filled-icon' : ''}`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 md:p-8">
          
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'personal' && (
            <form onSubmit={hasCompletedProfile ? handleProfileSubmit : handleFinalCompletion} className="space-y-8 max-w-[840px]">
              
              {/* Personal Information Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">person_outline</span>
                    <span>Personal Details</span>
                  </h3>
                  <span className="text-xs text-on-surface-variant italic">Registration Form Profile</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.fullName')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="fullName"
                      required
                      value={profileForm.fullName || ''}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow font-medium" 
                      type="text" 
                    />
                  </div>

                  {/* Father's / Husband's Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.fatherOrHusbandName') || "Father's / Husband's Name"}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="fatherOrHusbandName"
                      required
                      value={profileForm.fatherOrHusbandName || ''}
                      onChange={handleProfileChange}
                      placeholder="e.g. Robert Wright"
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="text" 
                    />
                  </div>

                  {/* Mother's Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.motherName') || "Mother's Name"}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="motherName"
                      required
                      value={profileForm.motherName || ''}
                      onChange={handleProfileChange}
                      placeholder="e.g. Eleanor Wright"
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="text" 
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.email')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="email"
                      required
                      value={profileForm.email || ''}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="email" 
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.phone')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="phone"
                      required
                      value={profileForm.phone || ''}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="tel" 
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.dob')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="dob"
                      required
                      value={profileForm.dob || ''}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="date" 
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.gender')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <select 
                      name="gender"
                      required
                      value={profileForm.gender || 'Male'}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow cursor-pointer"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Nationality */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.nationality') || 'Nationality'}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="nationality"
                      required
                      value={profileForm.nationality || 'Indian'}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="text" 
                    />
                  </div>

                  {/* Aadhaar Card Number (Secure / Masked) */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.aadhaarNumber') || 'Aadhaar Card Number'}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <div className="relative">
                      <input 
                        name="aadhaarNumber"
                        required
                        value={showAadhaar ? (profileForm.aadhaarNumber || '') : getMaskedAadhaar(profileForm.aadhaarNumber)}
                        onChange={handleProfileChange}
                        className="w-full h-11 pl-4 pr-12 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono tracking-wider transition-shadow" 
                        type="text" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowAadhaar(!showAadhaar)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
                        title={showAadhaar ? "Mask Aadhaar Number" : "Reveal Aadhaar Number"}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showAadhaar ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Residential Address Section */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  <span>Residential Address</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.street')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="street"
                      required
                      value={profileForm.street || ''}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="text" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                        <span>{t('profile.city')}</span>
                        <span className="text-red-600 font-bold">* Required</span>
                      </label>
                      <input 
                        name="city"
                        required
                        value={profileForm.city || ''}
                        onChange={handleProfileChange}
                        className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                        <span>{t('profile.state')}</span>
                        <span className="text-red-600 font-bold">* Required</span>
                      </label>
                      <input 
                        name="state"
                        required
                        value={profileForm.state || ''}
                        onChange={handleProfileChange}
                        className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                        <span>{t('profile.zip')}</span>
                        <span className="text-red-600 font-bold">* Required</span>
                      </label>
                      <input 
                        name="zip"
                        required
                        value={profileForm.zip || ''}
                        onChange={handleProfileChange}
                        className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                        type="text" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:w-1/2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.country')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <select 
                      name="country"
                      required
                      value={profileForm.country || 'India'}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow cursor-pointer"
                    >
                      <option>India</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Nominee Details Section */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">family_restroom</span>
                  <h3 className="text-base font-bold text-on-surface">
                    {t('profile.nomineeHeader') || 'Nominee Details'}
                  </h3>
                </div>

                <div className="p-4 bg-bone/60 border border-outline-variant/70 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.nomineeName') || 'Nominee Name'}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="nomineeName"
                      required
                      value={profileForm.nomineeName || ''}
                      onChange={handleProfileChange}
                      placeholder="e.g. Catherine Wright"
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="text" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.nomineeRelation') || 'Relationship with Nominee'}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="nomineeRelation"
                      required
                      value={profileForm.nomineeRelation || ''}
                      onChange={handleProfileChange}
                      placeholder="e.g. Spouse / Son / Daughter"
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="text" 
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/60">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('bank')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-bone border border-sand text-espresso text-sm font-semibold hover:bg-ivory transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next: Bank Details</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {!hasCompletedProfile && (
                  <button 
                    type="button"
                    onClick={handleFinalCompletion}
                    disabled={!isProfileCompleteValid}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      isProfileCompleteValid
                        ? 'bg-primary text-on-primary hover:bg-[#641722] cursor-pointer shadow-lg active:scale-[0.99]'
                        : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
                    }`}
                  >
                    <span>{t('profile.completeProfileBtn') || 'Complete Profile & Unlock Dashboard →'}</span>
                  </button>
                )}

                {hasCompletedProfile && (
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-[#641722] transition-all shadow-md cursor-pointer"
                  >
                    {t('profile.saveChanges')}
                  </button>
                )}
              </div>

            </form>
          )}

          {/* TAB 2: BANK DETAILS */}
          {activeTab === 'bank' && (
            <form onSubmit={hasCompletedProfile ? handleBankSubmit : handleFinalCompletion} className="space-y-8 max-w-[840px]">
              
              {/* Bank Account Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                    <span>{t('profile.bankHeader') || 'Bank Account Details'}</span>
                  </h3>
                  <span className="text-xs text-on-surface-variant italic">Official Payout Settlement</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Bank Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.bankName')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="bankName"
                      required
                      value={bankForm.bankName || ''}
                      onChange={handleBankChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow font-medium" 
                      type="text" 
                    />
                  </div>

                  {/* Account Holder Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.holderName')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="holderName"
                      required
                      value={bankForm.holderName || ''}
                      onChange={handleBankChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow font-medium" 
                      type="text" 
                    />
                  </div>

                  {/* Bank Account Number (Masked / Secure) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.accountNumber')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <div className="relative">
                      <input 
                        name="accountNumber"
                        required
                        value={showAccountNum ? (bankForm.accountNumber || '') : getMaskedAccount(bankForm.accountNumber)}
                        onChange={handleBankChange}
                        className="w-full h-11 pl-4 pr-12 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono tracking-wider transition-shadow" 
                        type="text" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccountNum(!showAccountNum)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
                        title={showAccountNum ? "Mask Account Number" : "Reveal Account Number"}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showAccountNum ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* IFSC / SWIFT Code */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.ifscCode')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="ifscCode"
                      required
                      value={bankForm.ifscCode || ''}
                      onChange={handleBankChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono transition-shadow uppercase" 
                      type="text" 
                    />
                  </div>

                  {/* Account Type */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.accountType')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <select 
                      name="accountType"
                      required
                      value={bankForm.accountType || 'Savings Account'}
                      onChange={handleBankChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow cursor-pointer"
                    >
                      <option>Savings Account</option>
                      <option>Current Account</option>
                      <option>Salary Account</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Digital Payment & Contact Details */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">qr_code_2</span>
                  <h3 className="text-base font-bold text-on-surface">
                    {t('profile.digitalPaymentHeader') || 'Digital Payment & Contact Details'}
                  </h3>
                </div>

                <div className="p-4 bg-bone/60 border border-outline-variant/70 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Paytm / PhonePe Details */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.paytmPhonePe') || 'Paytm / PhonePe Detail'}
                    </label>
                    <input 
                      name="paytmPhonePe"
                      value={bankForm.paytmPhonePe || ''}
                      onChange={handleBankChange}
                      placeholder="e.g. 9876543210@paytm / ybl"
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow font-mono" 
                      type="text" 
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.paymentMobile') || 'Registered Payment Mobile No.'}
                    </label>
                    <input 
                      name="paymentMobile"
                      value={bankForm.paymentMobile || ''}
                      onChange={handleBankChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow" 
                      type="tel" 
                    />
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/60">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('plan')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-bone border border-sand text-espresso text-sm font-semibold hover:bg-ivory transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next: Plan & Referral</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {!hasCompletedProfile && (
                  <button 
                    type="button"
                    onClick={handleFinalCompletion}
                    disabled={!isProfileCompleteValid}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      isProfileCompleteValid
                        ? 'bg-primary text-on-primary hover:bg-[#641722] cursor-pointer shadow-lg active:scale-[0.99]'
                        : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
                    }`}
                  >
                    <span>{t('profile.completeProfileBtn') || 'Complete Profile & Unlock Dashboard →'}</span>
                  </button>
                )}

                {hasCompletedProfile && (
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-[#641722] transition-all shadow-md cursor-pointer"
                  >
                    Save Bank Details
                  </button>
                )}
              </div>

            </form>
          )}

          {/* TAB 3: PLAN & REFERRAL */}
          {activeTab === 'plan' && (
            <form onSubmit={hasCompletedProfile ? handlePlanSubmit : handleFinalCompletion} className="space-y-8 max-w-[840px]">
              
              {/* Registered Plan & Scheme Details Banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
                    <span>{t('profile.planHeader') || 'Registered Investment Plan'}</span>
                  </h3>
                  <span className="text-xs text-on-surface-variant italic">Official Registration Record</span>
                </div>

                {/* Plan Summary Highlight Box */}
                <div className="p-5 bg-gradient-to-r from-bone via-cream to-bone border border-gold/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold block mb-1">
                      ACTIVE CONTRACT PLAN
                    </span>
                    <h4 className="text-xl font-extrabold text-primary">
                      {planForm.planName || 'Daily Return Plan'}
                    </h4>
                  </div>
                  <div className="sm:text-right bg-surface px-5 py-2.5 rounded-lg border border-sand">
                    <span className="text-xs text-warm-gray font-semibold block">SCHEME AMOUNT</span>
                    <span className="text-2xl font-black text-forest">
                      ₹ {planForm.schemeAmount || '1,00,000'}
                    </span>
                  </div>
                </div>

                {/* Editable Plan Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.planName') || 'Plan Name'}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="planName"
                      required
                      value={planForm.planName || ''}
                      onChange={handlePlanChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-semibold" 
                      type="text" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.schemeAmount') || 'Scheme Plan (in ₹)'}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input 
                      name="schemeAmount"
                      required
                      value={planForm.schemeAmount || ''}
                      onChange={handlePlanChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-semibold" 
                      type="text" 
                    />
                  </div>
                </div>
              </div>

              {/* Reference & Referral Information */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">share</span>
                    <span>{t('profile.referenceHeader') || 'Reference & Referral Details'}</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Reference ID Detail */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.referenceId') || 'Reference ID Detail'}
                    </label>
                    <input 
                      name="referenceId"
                      value={planForm.referenceId || ''}
                      onChange={handlePlanChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono" 
                      type="text" 
                    />
                  </div>

                  {/* Reference Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.referenceName') || 'Reference Name'}
                    </label>
                    <input 
                      name="referenceName"
                      value={planForm.referenceName || ''}
                      onChange={handlePlanChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-medium" 
                      type="text" 
                    />
                  </div>

                  {/* Referral Code (with copy button) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.referralCode') || 'Referral Code'}
                    </label>
                    <div className="flex">
                      <input 
                        name="referralCode"
                        value={planForm.referralCode || ''}
                        onChange={handlePlanChange}
                        className="flex-1 h-11 px-4 rounded-l-lg border border-r-0 border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono font-bold uppercase" 
                        type="text" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(planForm.referralCode || '');
                          triggerToast('Referral Code copied to clipboard!');
                        }}
                        className="px-3 rounded-r-lg bg-primary text-on-primary hover:bg-[#641722] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy Referral Code"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Income & Professional Details */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">work</span>
                  <span>{t('profile.incomeHeader') || 'Income & Professional Details'}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.sourceOfIncome') || 'Source of Income'}
                    </label>
                    <input 
                      name="sourceOfIncome"
                      value={planForm.sourceOfIncome || ''}
                      onChange={handlePlanChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm" 
                      type="text" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.businessDetail') || 'Business Detail'}
                    </label>
                    <input 
                      name="businessDetail"
                      value={planForm.businessDetail || ''}
                      onChange={handlePlanChange}
                      placeholder={planForm.businessDetail ? '' : 'Not provided'}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm" 
                      type="text" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.serviceDetail') || 'Service Detail'}
                    </label>
                    <input 
                      name="serviceDetail"
                      value={planForm.serviceDetail || ''}
                      onChange={handlePlanChange}
                      placeholder={planForm.serviceDetail ? '' : 'Not provided'}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm" 
                      type="text" 
                    />
                  </div>
                </div>
              </div>

              {/* Registration Details */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">edit_calendar</span>
                  <span>{t('profile.registrationHeader') || 'Registration Details'}</span>
                </h3>

                <div className="p-4 bg-bone/60 border border-outline-variant/70 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.regDate') || 'Registration Date'}
                    </label>
                    <input 
                      name="regDate"
                      value={planForm.regDate || ''}
                      onChange={handlePlanChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm" 
                      type="date" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      {t('profile.regPlace') || 'Registration Place'}
                    </label>
                    <input 
                      name="regPlace"
                      value={planForm.regPlace || ''}
                      onChange={handlePlanChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm" 
                      type="text" 
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/60">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('kyc')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-bone border border-sand text-espresso text-sm font-semibold hover:bg-ivory transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next: KYC Verification</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {!hasCompletedProfile && (
                  <button 
                    type="button"
                    onClick={handleFinalCompletion}
                    disabled={!isProfileCompleteValid}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      isProfileCompleteValid
                        ? 'bg-primary text-on-primary hover:bg-[#641722] cursor-pointer shadow-lg active:scale-[0.99]'
                        : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
                    }`}
                  >
                    <span>{t('profile.completeProfileBtn') || 'Complete Profile & Unlock Dashboard →'}</span>
                  </button>
                )}

                {hasCompletedProfile && (
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-[#641722] transition-all shadow-md cursor-pointer"
                  >
                    Save Plan & Referral Info
                  </button>
                )}
              </div>

            </form>
          )}

          {/* TAB 4: KYC VERIFICATION */}
          {activeTab === 'kyc' && (
            <form onSubmit={hasCompletedProfile ? handleKycSubmit : handleFinalCompletion} className="space-y-8 max-w-[840px]">
              
              <div className="p-5 bg-tertiary/10 border border-tertiary/20 rounded-xl flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary text-[36px] filled-icon">verified_user</span>
                <div>
                  <h4 className="text-base font-bold text-on-surface">KYC Status: {kycForm.status}</h4>
                  <p className="text-sm text-on-surface-variant">Your KYC identity documents have been verified and approved. Your withdrawal permissions are active.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t('profile.docType')}</label>
                  <select 
                    name="docType"
                    value={kycForm.docType || 'Passport'}
                    onChange={handleKycChange}
                    className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow cursor-pointer"
                  >
                    <option>Aadhaar Card</option>
                    <option>Passport</option>
                    <option>PAN Card</option>
                    <option>Driver's License</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t('profile.docNumber')}</label>
                  <input 
                    name="docNumber"
                    value={kycForm.docNumber || ''}
                    onChange={handleKycChange}
                    className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono" 
                    type="text" 
                  />
                </div>
              </div>

              {/* Document Uploader */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Uploaded Document Attachment</label>
                <div 
                  onClick={() => triggerToast("Upload document dialog coming soon!")}
                  className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-2">cloud_upload</span>
                  <p className="font-bold text-sm text-espresso mb-1">aadhaar_alexander_wright.pdf</p>
                  <p className="text-xs text-on-surface-variant">PDF, PNG or JPG up to 10MB (Click to browse and replace file)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/60">
                {!hasCompletedProfile ? (
                  <button 
                    type="button"
                    onClick={handleFinalCompletion}
                    disabled={!isProfileCompleteValid}
                    className={`w-full px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      isProfileCompleteValid
                        ? 'bg-primary text-on-primary hover:bg-[#641722] cursor-pointer shadow-lg active:scale-[0.99]'
                        : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
                    }`}
                  >
                    <span>{t('profile.completeProfileBtn') || 'Complete Profile & Unlock Dashboard →'}</span>
                  </button>
                ) : (
                  <div className="flex justify-end gap-3 w-full">
                    <button 
                      type="button" 
                      onClick={() => triggerToast("Changes reset", "info")}
                      className="px-6 py-2.5 rounded-lg bg-surface border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-lowest transition-colors shadow-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-[#641722] transition-all shadow-md cursor-pointer"
                    >
                      Re-submit KYC
                    </button>
                  </div>
                )}
              </div>

            </form>
          )}

        </div>
      </div>

    </div>
  );
}

export default Profile;
