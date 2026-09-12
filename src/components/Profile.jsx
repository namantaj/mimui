import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const INVESTMENT_PLANS = [
  {
    id: 'p1',
    title: 'ONE-TIME INVESTMENT',
    tag: 'ONE-TIME CONTRIBUTION',
    badge: 'Starting ₹25,000',
    amount: 25000,
    formattedAmount: '25,000',
    desc: 'Structured lump-sum contribution for investors who prefer one-time deposits across growth sectors.'
  },
  {
    id: 'p2',
    title: 'DAILY INVESTMENT PLAN',
    tag: 'DAILY CONTRIBUTION',
    badge: 'From ₹10/day',
    amount: 3600,
    formattedAmount: '3,600',
    desc: 'Disciplined savings model with micro daily contributions (₹10/day x 360 days).'
  },
  {
    id: 'p3',
    title: 'DAILY RETURN PLAN',
    tag: 'DAILY RETURN',
    badge: 'Daily Return Option',
    amount: 100000,
    formattedAmount: '1,00,000',
    desc: 'Capital investment option offering regular daily return payouts and promotional tiers.'
  },
  {
    id: 'p4',
    title: 'FLEXI SAVING PLAN',
    tag: 'FLEXIBLE SAVING',
    badge: 'From ₹50/day',
    amount: 10500,
    formattedAmount: '10,500',
    desc: 'Flexible daily saving scheme for 210 days (7 months) with 9-month maturity cycle.'
  },
  {
    id: 'p5',
    title: 'TERM DEPOSIT PLAN',
    tag: 'TERM DEPOSIT',
    badge: '1 • 2 • 3 YEARS',
    amount: 60000,
    formattedAmount: '60,000',
    desc: 'Monthly investment (₹5,000/month for 1 year) across 1, 2, and 3-year tenures.'
  },
  {
    id: 'p6',
    title: 'POCKET-FRIENDLY PLAN',
    tag: 'MICRO SAVING',
    badge: 'From ₹10/day',
    amount: 4500,
    formattedAmount: '4,500',
    desc: 'Affordable micro-saving entry point (450 days deposit) with multi-phase returns.'
  }
];

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
  documentsForm,
  setDocumentsForm,
  triggerToast
}) {
  const { user, hasCompletedProfile, completeProfile } = useAuth();
  const { t } = useLanguage();

  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const [companyQrCodeUrl, setCompanyQrCodeUrl] = useState('');
  const [companyUpiId, setCompanyUpiId] = useState('');
  const [loadingPaymentSettings, setLoadingPaymentSettings] = useState(true);

  // Upload States for Real Supabase Storage
  const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
  const [uploadingPassbook, setUploadingPassbook] = useState(false);

  // Required Personal Info Fields
  const requiredPersonalFields = [
    { key: 'fullName', label: 'Full Name', value: profileForm.fullName || user?.fullName },
    { key: 'fatherOrHusbandName', label: "Father's / Husband's Name", value: profileForm.fatherOrHusbandName },
    { key: 'motherName', label: "Mother's Name", value: profileForm.motherName },
    { key: 'email', label: 'Email Address', value: profileForm.email || user?.email },
    { key: 'phone', label: 'Phone Number', value: profileForm.phone || user?.phone },
    { key: 'dob', label: 'Date of Birth', value: profileForm.dob },
    { key: 'gender', label: 'Gender', value: profileForm.gender || 'Male' },
    { key: 'nationality', label: 'Nationality', value: profileForm.nationality || 'Indian' },
    { key: 'aadhaarNumber', label: 'Aadhaar Card Number', value: profileForm.aadhaarNumber },
    { key: 'street', label: 'Street Address', value: profileForm.street },
    { key: 'city', label: 'City', value: profileForm.city },
    { key: 'state', label: 'State / Province', value: profileForm.state },
    { key: 'zip', label: 'Pincode / Zip', value: profileForm.zip },
    { key: 'country', label: 'Country', value: profileForm.country || 'India' },
    { key: 'nomineeName', label: 'Nominee Name', value: profileForm.nomineeName },
    { key: 'nomineeRelation', label: 'Nominee Relationship', value: profileForm.nomineeRelation }
  ];

  const missingPersonalFields = requiredPersonalFields.filter(
    field => !field.value || String(field.value).trim() === ''
  );

  const isPersonalComplete = missingPersonalFields.length === 0;

  const bankHolderName =
    bankForm.holderName?.trim() ||
    bankForm.accountHolderName?.trim() ||
    profileForm.fullName?.trim() ||
    user?.fullName ||
    '';

  const isBankComplete =
    !!bankForm.bankName?.trim() &&
    !!bankForm.accountNumber?.trim() &&
    !!bankHolderName.trim() &&
    !!bankForm.ifscCode?.trim();

  const aadhaarUrl = documentsForm?.aadhaarUrl || user?.aadhaarDocumentUrl || '';
  const passbookUrl = documentsForm?.passbookUrl || user?.passbookDocumentUrl || '';

  useEffect(() => {
    const loadPaymentSettings = async () => {
      try {
        const { data, error } = await supabase.from('payment_settings').select('qr_code_url, upi_id, updated_at').limit(1).maybeSingle();
        if (error) throw error;
        setCompanyQrCodeUrl(data?.qr_code_url || '');
        setCompanyUpiId(data?.upi_id || '');
      } catch (error) {
        console.error('Customer payment settings load error:', error);
      } finally {
        setLoadingPaymentSettings(false);
      }
    };

    loadPaymentSettings();

    const paymentSettingsChannel = supabase.channel(`customer-payment-settings-${user?.id || 'guest'}-${Date.now()}`).on('postgres_changes', { event: '*', schema: 'public', table: 'payment_settings' }, (payload) => {
      console.log('Payment settings realtime update:', payload);
      if (payload?.new) {
        setCompanyQrCodeUrl(payload.new.qr_code_url || '');
        setCompanyUpiId(payload.new.upi_id || '');
      } else {
        loadPaymentSettings();
      }
    }).subscribe();

    return () => {
      supabase.removeChannel(paymentSettingsChannel);
    };
  }, [user?.id]);

  const isDocumentsComplete = !!aadhaarUrl.trim() && !!passbookUrl.trim();

  const isProfileCompleteValid = isPersonalComplete && isBankComplete && isDocumentsComplete;

  // Debug Console Logging for Onboarding Completion Conditions
  useEffect(() => {
    console.log('[Profile Completion Debug]', {
      isPersonalComplete,
      missingPersonalFields: missingPersonalFields.map(f => f.key),
      isBankComplete,
      bankName: bankForm.bankName,
      accountNumber: bankForm.accountNumber,
      holderName: bankHolderName,
      ifscCode: bankForm.ifscCode,
      aadhaarUrl,
      passbookUrl,
      isDocumentsComplete,
      isProfileCompleteValid
    });
  }, [
    isPersonalComplete,
    isBankComplete,
    aadhaarUrl,
    passbookUrl,
    isDocumentsComplete,
    isProfileCompleteValid
  ]);

  // Onboarding Completion Calculation
  const totalOnboardingSteps = 4;
  let completedOnboardingSteps = 0;
  if (isPersonalComplete) completedOnboardingSteps += 1;
  if (isBankComplete) completedOnboardingSteps += 1;
  if (aadhaarUrl) completedOnboardingSteps += 1;
  if (passbookUrl) completedOnboardingSteps += 1;

  const progressPercentage = Math.round((completedOnboardingSteps / totalOnboardingSteps) * 100);

  // REAL SUPABASE STORAGE UPLOAD HANDLER
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate File Type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      triggerToast('Invalid file format. Please upload PDF, JPG, JPEG, or PNG files.', 'error');
      return;
    }

    // Validate File Size (Max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      triggerToast('File size exceeds 10MB. Please choose a smaller file.', 'error');
      return;
    }

    if (!user?.id) {
      triggerToast('You must be logged in to upload documents.', 'error');
      return;
    }

    const isAadhaar = type === 'aadhaar';
    if (isAadhaar) setUploadingAadhaar(true);
    else setUploadingPassbook(true);

    const bucketName = 'Members-document';
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `members/${user.id}/${type}/${Date.now()}_${sanitizedName}`;

    console.log('Current user:', user?.id);
    console.log(`Selected ${type} file:`, file);
    console.log('Storage bucket:', bucketName);
    console.log('Upload path:', filePath);

    try {
      const { data, error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      console.log('Storage upload result:', data, uploadErr);

      if (uploadErr) {
        console.error('Supabase Storage Upload Error:', uploadErr);
        throw new Error(uploadErr.message || `Failed to upload ${type} document to Supabase storage bucket '${bucketName}'.`);
      }

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      const documentPath = publicUrlData?.publicUrl || filePath;

      console.log('Document URL/path after upload:', documentPath);

      // Update Supabase members database table
      const updateColumn = isAadhaar ? 'aadhaar_document_url' : 'passbook_document_url';
      const { error: dbError } = await supabase
        .from('members')
        .update({
          [updateColumn]: documentPath,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (dbError) {
        console.error('Database record update error:', dbError);
        throw new Error(dbError.message || 'Failed to save document path in member record.');
      }

      // Update local state
      setDocumentsForm(prev => ({
        ...prev,
        [isAadhaar ? 'aadhaarUrl' : 'passbookUrl']: documentPath,
        [updateColumn]: documentPath
      }));

      const updatedAadhaar = isAadhaar ? documentPath : aadhaarUrl;
      const updatedPassbook = !isAadhaar ? documentPath : passbookUrl;

      console.log('Completion state:', {
        isPersonalComplete,
        isBankComplete,
        aadhaarUrl: updatedAadhaar,
        passbookUrl: updatedPassbook,
        isProfileCompleteValid: isPersonalComplete && isBankComplete && !!updatedAadhaar && !!updatedPassbook
      });

      triggerToast(`${isAadhaar ? 'Aadhaar Card' : 'Passbook Photo'} uploaded successfully!`, 'success');
    } catch (err) {
      console.error('Storage upload error:', err);
      triggerToast(err.message || 'Document upload failed. Please try again.', 'error');
    } finally {
      if (isAadhaar) setUploadingAadhaar(false);
      else setUploadingPassbook(false);
      if (e.target) e.target.value = '';
    }
  };

  // FINAL PROFILE COMPLETION HANDLER
  const handleFinalCompletion = async (e) => {
    if (e) e.preventDefault();

    if (!isProfileCompleteValid) {
      const missing = [];
      if (!isPersonalComplete) missing.push('Personal Details');
      if (!isBankComplete) missing.push('Bank Details');
      if (!documentsForm.aadhaarUrl && !user?.aadhaarDocumentUrl) missing.push('Aadhaar Card Upload');
      if (!documentsForm.passbookUrl && !user?.passbookDocumentUrl) missing.push('Passbook Photo Upload');

      triggerToast(`Please complete required section(s): ${missing.join(', ')}`, 'info');
      return;
    }

    if (submittingProfile) return;

    try {
      setSubmittingProfile(true);

      if (user?.id) {
        const { error: updateError } = await supabase
          .from('members')
          .update({
            full_name: profileForm.fullName?.trim() || null,
            father_or_husband_name: profileForm.fatherOrHusbandName?.trim() || null,
            mother_name: profileForm.motherName?.trim() || null,
            email: profileForm.email?.trim()?.toLowerCase() || user.email || null,
            phone: profileForm.phone?.trim() || null,
            date_of_birth: profileForm.dob || null,
            gender: profileForm.gender || null,
            nationality: profileForm.nationality?.trim() || null,
            aadhaar_number: profileForm.aadhaarNumber?.trim() || null,
            address: profileForm.street?.trim() || null,
            city: profileForm.city?.trim() || null,
            state: profileForm.state?.trim() || null,
            pincode: profileForm.zip?.trim() || null,
            country: profileForm.country?.trim() || null,
            nominee_name: profileForm.nomineeName?.trim() || null,
            nominee_relation: profileForm.nomineeRelation?.trim() || null,
            bank_name: bankForm.bankName?.trim() || null,
            account_number: bankForm.accountNumber?.trim() || null,
            account_holder_name: bankForm.holderName?.trim() || null,
            ifsc_code: bankForm.ifscCode?.trim() || null,
            branch_name: bankForm.branchName?.trim() || null,
            profile_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          throw new Error(updateError.message || 'Failed to update database profile.');
        }
      }

      await completeProfile();
      triggerToast('Profile completed successfully! Dashboard unlocked.', 'success');

      if (setRoute) {
        setRoute('dashboard');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      triggerToast(error?.message || 'Unable to complete profile. Please try again.', 'error');
    } finally {
      setSubmittingProfile(false);
    }
  };

  // PAYMENT SUBMISSION HANDLER
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      triggerToast('You must be logged in to submit payment.', 'error');
      return;
    }

    if (!planForm.planName) {
      triggerToast('Please select an investment plan first.', 'error');
      return;
    }

    if (!planForm.paymentReference?.trim()) {
      triggerToast('Please enter your payment reference / transaction ID.', 'error');
      return;
    }

    try {
      setSubmittingPayment(true);

      const { error } = await supabase
        .from('members')
        .update({
          membership_plan: planForm.planName,
          plan_amount: planForm.schemeAmount || null,
          payment_reference: planForm.paymentReference.trim(),
          payment_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message || 'Failed to submit payment details.');
      }

      triggerToast('Payment details submitted successfully! Verification is pending.', 'success');
    } catch (err) {
      console.error('Payment submission error:', err);
      triggerToast(err.message || 'Payment submission failed.', 'error');
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Select Plan Handler
  const handleSelectPlan = (plan) => {
    handlePlanChange({ target: { name: 'planName', value: plan.title } });
    handlePlanChange({ target: { name: 'schemeAmount', value: String(plan.amount) } });
    triggerToast(`Selected Plan: ${plan.title} (₹ ${plan.formattedAmount})`, 'info');
  };

  return (
    <div className="space-y-6">

      {/* ONBOARDING MANDATORY WIZARD HEADER (Shown when profile is incomplete) */}
      {!hasCompletedProfile && (
        <div className="bg-gradient-to-r from-[#7D1F2B] via-primary to-[#641722] text-on-primary rounded-2xl px-6 sm:px-8 py-5 sm:py-6 shadow-lg border border-gold/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">

            <div className="flex-1 md:max-w-[65%] space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold bg-black/35 px-2.5 py-0.5 rounded border border-gold/30">
                  STEP 2 OF 2 — REQUIRED ONBOARDING
                </span>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase bg-red-600/90 text-white px-2.5 py-0.5 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  PORTAL LOCKED
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-cream tracking-tight leading-snug">
                Complete Your Profile & Documents
              </h1>

              <p className="text-sm sm:text-base text-cream/90 font-medium leading-relaxed">
                Please complete your Personal Info, Bank Details, Aadhaar Card, and Passbook Photo to unlock the Executive Portal.
              </p>
            </div>

            <div className="w-full md:w-[32%] shrink-0">
              <div className="bg-black/25 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/15 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-cream">
                  <span className="uppercase text-[11px] tracking-wider">PROFILE COMPLETION</span>
                  <span className="text-gold font-mono text-base font-extrabold">{progressPercentage}%</span>
                </div>

                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-cream/80 font-medium text-right">
                  {completedOnboardingSteps} of {totalOnboardingSteps} required sections completed
                </p>
              </div>
            </div>

          </div>

          <div className="mt-3.5 pt-3.5 border-t border-white/20 flex items-center gap-2 text-xs text-cream/90 font-medium">
            <span className="material-symbols-outlined text-[16px] text-gold shrink-0">lock</span>
            <span>
              <strong className="text-gold font-semibold">Executive Portal is currently locked.</strong> Complete all required sections below to enable full portal access.
            </span>
          </div>
        </div>
      )}

      {/* EXECUTIVE SUMMARY HEADER CARD (Shown after onboarding is completed) */}
      {hasCompletedProfile && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">

            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-surface shadow-sm relative shrink-0 bg-gradient-to-br from-primary to-[#641722] flex items-center justify-center text-white text-3xl font-black">
              {profileForm.fullName ? profileForm.fullName.charAt(0).toUpperCase() : 'E'}
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-0.5">{profileForm.fullName || user?.fullName || 'Executive Partner'}</h2>
                  <p className="text-body-sm text-on-surface-variant font-medium">
                    {profileForm.email || user?.email} • <span className="font-mono text-espresso font-semibold">ID: {user?.referralCode || 'EX-PARTNER'}</span>
                  </p>
                </div>
                <div className="flex gap-2 justify-center md:justify-end">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold border border-tertiary/20">
                    <span className="material-symbols-outlined text-xs mr-1">check_circle</span> Profile Complete
                  </span>
                  {user?.membershipPlan && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/20">
                      {user.membershipPlan}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-outline-variant pt-4">
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">Membership Plan</p>
                  <p className="text-sm font-bold text-on-surface">{user?.membershipPlan || planForm.planName || 'Not Selected'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">Payment Status</p>
                  <p className={`text-sm font-bold capitalize ${user?.paymentStatus === 'approved' ? 'text-forest' : user?.paymentStatus === 'pending' ? 'text-gold' : 'text-amber-700'}`}>
                    {user?.paymentStatus || planForm.paymentStatus || 'unpaid'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">Wallet Balance</p>
                  <p className="text-base font-bold text-on-surface">₹ {user?.walletBalance || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">Total Earnings</p>
                  <p className="text-base font-bold text-primary">₹ {user?.totalEarnings || 0}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MAIN TABBED INTERFACE */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant overflow-x-auto hide-scrollbar bg-surface-container-lowest">
          {[
            { id: 'personal', label: t('profile.personalTab') || 'Personal Info', icon: 'person' },
            { id: 'bank', label: t('profile.bankTab') || 'Bank Details', icon: 'account_balance' },
            { id: 'documents', label: t('profile.documentsTab') || 'Documents', icon: 'upload_file' },
            { id: 'plan_payment', label: t('profile.planPaymentTab') || 'Plan & Payment', icon: 'payments' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${isActive
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

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">person_outline</span>
                    <span>Personal Details</span>
                  </h3>
                  <span className="text-xs text-on-surface-variant italic">Registration Profile</span>
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
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-medium"
                      type="text"
                    />
                  </div>

                  {/* Father's / Husband's Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.fatherOrHusbandName')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input
                      name="fatherOrHusbandName"
                      required
                      value={profileForm.fatherOrHusbandName || ''}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
                      type="text"
                    />
                  </div>

                  {/* Mother's Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.motherName')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input
                      name="motherName"
                      required
                      value={profileForm.motherName || ''}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
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
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
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
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
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
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
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
                      <span>{t('profile.nationality')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input
                      name="nationality"
                      required
                      value={profileForm.nationality || 'Indian'}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
                      type="text"
                    />
                  </div>

                  {/* Aadhaar Card Number */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.aadhaarNumber')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input
                      name="aadhaarNumber"
                      required
                      value={profileForm.aadhaarNumber || ''}
                      onChange={handleProfileChange}
                      placeholder="e.g. 1234 5678 9012"
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono tracking-wider transition-shadow"
                      type="text"
                    />
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
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
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
                        className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
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
                        className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
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
                        className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
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
                    {t('profile.nomineeHeader')}
                  </h3>
                </div>

                <div className="p-4 bg-bone/60 border border-outline-variant/70 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.nomineeName')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input
                      name="nomineeName"
                      required
                      value={profileForm.nomineeName || ''}
                      onChange={handleProfileChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm"
                      type="text"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.nomineeRelation')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input
                      name="nomineeRelation"
                      required
                      value={profileForm.nomineeRelation || ''}
                      onChange={handleProfileChange}
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
                    disabled={!isProfileCompleteValid || submittingProfile}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${isProfileCompleteValid
                      ? 'bg-primary text-on-primary hover:bg-[#641722] cursor-pointer shadow-lg active:scale-[0.99]'
                      : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
                      }`}
                  >
                    <span>{submittingProfile ? 'Completing Profile...' : 'Complete Profile & Unlock Dashboard →'}</span>
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

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                    <span>{t('profile.bankHeader')}</span>
                  </h3>
                  <span className="text-xs text-on-surface-variant italic">Official Settlement Account</span>
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

                  {/* Bank Account Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                      <span>{t('profile.accountNumber')}</span>
                      <span className="text-red-600 font-bold">* Required</span>
                    </label>
                    <input
                      name="accountNumber"
                      required
                      value={bankForm.accountNumber || ''}
                      onChange={handleBankChange}
                      placeholder="e.g. 98765432101234"
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono tracking-wider transition-shadow"
                      type="text"
                    />
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

                  {/* Branch Name */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Branch Name / Location
                    </label>
                    <input
                      name="branchName"
                      value={bankForm.branchName || ''}
                      onChange={handleBankChange}
                      className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm transition-shadow font-medium"
                      type="text"
                    />
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/60">
                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-bone border border-sand text-espresso text-sm font-semibold hover:bg-ivory transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next: Documents Upload</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {!hasCompletedProfile && (
                  <button
                    type="button"
                    onClick={handleFinalCompletion}
                    disabled={!isProfileCompleteValid || submittingProfile}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${isProfileCompleteValid
                      ? 'bg-primary text-on-primary hover:bg-[#641722] cursor-pointer shadow-lg active:scale-[0.99]'
                      : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
                      }`}
                  >
                    <span>{submittingProfile ? 'Completing Profile...' : 'Complete Profile & Unlock Dashboard →'}</span>
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

          {/* TAB 3: DOCUMENTS UPLOAD (REAL SUPABASE STORAGE) */}
          {activeTab === 'documents' && (
            <div className="space-y-8 max-w-[840px]">

              <div className="p-5 bg-tertiary/10 border border-tertiary/20 rounded-xl flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary text-[36px] filled-icon">cloud_upload</span>
                <div>
                  <h4 className="text-base font-bold text-on-surface">Document Verification Attachments</h4>
                  <p className="text-sm text-on-surface-variant">Please upload clear copies of your Aadhaar Card and Bank Passbook/Cheque photo to fulfill profile completion requirements.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. AADHAAR CARD UPLOAD */}
                <div className="bg-surface border border-outline-variant rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                      <h4 className="font-bold text-sm text-on-surface">Aadhaar Card Document</h4>
                    </div>
                    <span className="text-xs font-bold text-red-600">* Required</span>
                  </div>

                  {(documentsForm.aadhaarUrl || user?.aadhaarDocumentUrl) ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                        <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                        <span>Aadhaar Document Uploaded</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-mono truncate">
                        {documentsForm.aadhaarUrl || user?.aadhaarDocumentUrl}
                      </p>
                      <label className="inline-block mt-2 px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer">
                        <span>Replace Document</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'aadhaar')}
                          className="hidden"
                          disabled={uploadingAadhaar}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className={`border-2 border-dashed border-outline-variant rounded-xl p-6 text-center flex flex-col items-center justify-center transition cursor-pointer hover:bg-surface-container-low ${uploadingAadhaar ? 'opacity-50 cursor-wait' : ''}`}>
                        <span className="material-symbols-outlined text-[36px] text-on-surface-variant mb-1">upload_file</span>
                        <span className="font-bold text-xs text-primary">Click to Upload Aadhaar Card</span>
                        <span className="text-[11px] text-on-surface-variant mt-1">PDF, PNG, JPG (Max 10MB)</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'aadhaar')}
                          className="hidden"
                          disabled={uploadingAadhaar}
                        />
                      </label>
                      {uploadingAadhaar && (
                        <p className="text-xs text-primary font-semibold text-center animate-pulse">Uploading Aadhaar to Storage...</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. PASSBOOK PHOTO UPLOAD */}
                <div className="bg-surface border border-outline-variant rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                      <h4 className="font-bold text-sm text-on-surface">Bank Passbook / Cheque Photo</h4>
                    </div>
                    <span className="text-xs font-bold text-red-600">* Required</span>
                  </div>

                  {(documentsForm.passbookUrl || user?.passbookDocumentUrl) ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                        <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                        <span>Passbook Photo Uploaded</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-mono truncate">
                        {documentsForm.passbookUrl || user?.passbookDocumentUrl}
                      </p>
                      <label className="inline-block mt-2 px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer">
                        <span>Replace Passbook Photo</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'passbook')}
                          className="hidden"
                          disabled={uploadingPassbook}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className={`border-2 border-dashed border-outline-variant rounded-xl p-6 text-center flex flex-col items-center justify-center transition cursor-pointer hover:bg-surface-container-low ${uploadingPassbook ? 'opacity-50 cursor-wait' : ''}`}>
                        <span className="material-symbols-outlined text-[36px] text-on-surface-variant mb-1">receipt_long</span>
                        <span className="font-bold text-xs text-primary">Click to Upload Passbook Photo</span>
                        <span className="text-[11px] text-on-surface-variant mt-1">PDF, PNG, JPG (Max 10MB)</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'passbook')}
                          className="hidden"
                          disabled={uploadingPassbook}
                        />
                      </label>
                      {uploadingPassbook && (
                        <p className="text-xs text-primary font-semibold text-center animate-pulse">Uploading Passbook to Storage...</p>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/60">
                <button
                  type="button"
                  onClick={() => setActiveTab('plan_payment')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-bone border border-sand text-espresso text-sm font-semibold hover:bg-ivory transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next: Plan & Payment</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {!hasCompletedProfile && (
                  <button
                    type="button"
                    onClick={handleFinalCompletion}
                    disabled={!isProfileCompleteValid || submittingProfile}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${isProfileCompleteValid
                      ? 'bg-primary text-on-primary hover:bg-[#641722] cursor-pointer shadow-lg active:scale-[0.99]'
                      : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
                      }`}
                  >
                    <span>{submittingProfile ? 'Completing Profile...' : 'Complete Profile & Unlock Dashboard →'}</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: PLAN SELECTION & PAYMENT */}
          {activeTab === 'plan_payment' && (
            <div className="space-y-8 max-w-[840px]">

              {/* 1. PLAN SELECTION CARDS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
                    <span>Select An Investment Plan</span>
                  </h3>
                  <span className="text-xs text-on-surface-variant italic">Choose 1 of 6 official schemes</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INVESTMENT_PLANS.map((plan) => {
                    const isSelected = planForm.planName === plan.title;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => handleSelectPlan(plan)}
                        className={`p-5 rounded-xl border-2 transition-all cursor-pointer space-y-3 relative overflow-hidden ${isSelected
                          ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary'
                          : 'border-outline-variant bg-surface hover:border-primary/50'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[9.5px] font-bold tracking-wider uppercase text-gold bg-black/40 px-2 py-0.5 rounded">
                              {plan.tag}
                            </span>
                            <h4 className="text-base font-extrabold text-on-surface mt-1.5">{plan.title}</h4>
                          </div>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                            {plan.badge}
                          </span>
                        </div>

                        <p className="text-xs text-on-surface-variant leading-relaxed">{plan.desc}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/50">
                          <span className="text-xs text-warm-gray font-semibold">Investment Amount:</span>
                          <span className="text-lg font-black text-forest">₹ {plan.formattedAmount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. PAYMENT & QR CODE SECTION */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/60">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">qr_code_2</span>
                    <span>Payment & Transaction Verification</span>
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Status: {planForm.paymentStatus || user?.paymentStatus || 'Unpaid'}
                  </span>
                </div>

                <div className="bg-cream/60 border border-sand rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                  {/* QR Code Container */}
                  <div className="flex flex-col items-center justify-center p-5 bg-white border border-sand rounded-xl text-center space-y-3 shadow-sm">
                    <div className="w-48 h-48 bg-cream border-2 border-primary/20 rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
                      {loadingPaymentSettings ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-warm-gray">
                          <span className="material-symbols-outlined animate-spin text-[28px]">progress_activity</span>
                          <span className="text-[10px] font-semibold">Loading QR...</span>
                        </div>
                      ) : companyQrCodeUrl ? (
                        <img src={companyQrCodeUrl} alt="Official Company Payment QR" className="w-full h-full object-contain" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center px-3">
                          <span className="material-symbols-outlined text-[42px] text-warm-gray">qr_code_2</span>
                          <span className="text-[10px] font-bold text-warm-gray mt-2">QR CODE NOT AVAILABLE</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">Official Company Payment QR</span>
                      <span className="text-[10px] text-warm-gray block">Scan with PhonePe, Paytm, GPay or BHIM UPI</span>
                      {companyUpiId && (
                        <div className="mt-2 px-3 py-1.5 rounded-lg bg-cream border border-sand">
                          <span className="text-[10px] text-warm-gray font-semibold block">COMPANY UPI ID</span>
                          <span className="text-xs font-bold text-espresso font-mono break-all">{companyUpiId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Instructions & Submission Form */}
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-warm-gray font-semibold block">SELECTED PLAN</span>
                      <p className="text-base font-extrabold text-primary">{planForm.planName || 'Please select a plan above'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-warm-gray font-semibold block">AMOUNT PAYABLE</span>
                      <p className="text-2xl font-black text-forest">₹ {planForm.schemeAmount ? Number(planForm.schemeAmount).toLocaleString('en-IN') : '0'}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-on-surface block">
                        Payment Reference / Transaction ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={planForm.paymentReference || ''}
                        onChange={(e) => handlePlanChange({ target: { name: 'paymentReference', value: e.target.value } })}
                        placeholder="e.g. UPI/123456789012"
                        className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-mono font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingPayment || !planForm.planName}
                      className="w-full py-3 bg-primary hover:bg-[#641722] text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>{submittingPayment ? 'Submitting Details...' : 'Submit Payment Details'}</span>
                    </button>
                  </form>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/60">
                {!hasCompletedProfile && (
                  <button
                    type="button"
                    onClick={handleFinalCompletion}
                    disabled={!isProfileCompleteValid || submittingProfile}
                    className={`w-full px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${isProfileCompleteValid
                      ? 'bg-primary text-on-primary hover:bg-[#641722] cursor-pointer shadow-lg active:scale-[0.99]'
                      : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
                      }`}
                  >
                    <span>{submittingProfile ? 'Completing Profile...' : 'Complete Profile & Unlock Dashboard →'}</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default Profile;
