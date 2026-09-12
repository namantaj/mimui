import React, { useState, useEffect } from 'react';

import Dashboard from './components/Dashboard';
import MyBusiness from './components/MyBusiness';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import KnowledgeCenter from './components/KnowledgeCenter';
import Support from './components/Support';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import CompanyPolicy from './components/CompanyPolicy';

import { AuthProvider, useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { supabase } from './lib/supabase';


function AppContent() {

  const {
    isAuthenticated,
    hasAcceptedPolicy,
    hasCompletedProfile,
    user,
    logout,
    loading
  } = useAuth();

  const {
    t,
    locale,
    switchLanguage
  } = useLanguage();


  const [activeTab, setActiveTab] = useState('personal');


  /*
   * ---------------------------------------------------------
   * ROUTING
   * ---------------------------------------------------------
   */

  const [activeMenu, setActiveMenu] = useState(() => {
    const hash = window.location.hash.replace('#/', '');

    return hash || 'landing';
  });


  const setRoute = (route) => {
    window.location.hash = `#/${route}`;
  };


  useEffect(() => {

    const handleHashChange = () => {

      const hash =
        window.location.hash.replace('#/', '');

      setActiveMenu(
        hash || 'landing'
      );
    };


    window.addEventListener(
      'hashchange',
      handleHashChange
    );


    return () => {

      window.removeEventListener(
        'hashchange',
        handleHashChange
      );

    };

  }, []);


  /*
   * ---------------------------------------------------------
   * UI STATE
   * ---------------------------------------------------------
   */

  const [darkMode, setDarkMode] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [language, setLanguage] =
    useState('English');


  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });


  const triggerToast = (
    message,
    type = 'success'
  ) => {

    setToast({
      show: true,
      message,
      type
    });


    setTimeout(() => {

      setToast({
        show: false,
        message: '',
        type: 'success'
      });

    }, 3000);
  };


  /*
   * ---------------------------------------------------------
   * PUBLIC ROUTES
   * ---------------------------------------------------------
   */

  const isPublicRoute =
    activeMenu === 'landing' ||
    activeMenu === 'login' ||
    activeMenu === 'signup';


  /*
   * ---------------------------------------------------------
   * PROTECTED ROUTES
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * We MUST wait until AuthContext finishes checking:
   *
   * 1. Supabase session
   * 2. Company Policy acceptance
   * 3. Profile completion
   *
   * Otherwise the app can temporarily see:
   *
   * hasAcceptedPolicy = false
   *
   * and incorrectly redirect an already-approved customer
   * to Company Policy.
   * ---------------------------------------------------------
   */

  useEffect(() => {

    // -------------------------------------------------------
    // WAIT FOR AUTH CONTEXT
    // -------------------------------------------------------

    if (loading) {
      return;
    }


    // -------------------------------------------------------
    // USER IS NOT AUTHENTICATED
    // -------------------------------------------------------

    if (
      !isPublicRoute &&
      !isAuthenticated
    ) {

      setRoute('login');

      return;
    }


    // -------------------------------------------------------
    // USER IS LOGGED IN BUT HAS NOT ACCEPTED POLICY
    // -------------------------------------------------------

    if (
      isAuthenticated &&
      !hasAcceptedPolicy
    ) {

      if (activeMenu !== 'policy') {
        setRoute('policy');
      }

      return;
    }


    // -------------------------------------------------------
    // USER HAS ALREADY ACCEPTED POLICY
    // BUT BROWSER IS STILL ON POLICY PAGE
    // -------------------------------------------------------

    if (
      isAuthenticated &&
      hasAcceptedPolicy &&
      activeMenu === 'policy'
    ) {

      if (hasCompletedProfile) {

        setRoute('dashboard');

      } else {

        setRoute('profile');

      }

      return;
    }


    // -------------------------------------------------------
    // POLICY ACCEPTED
    // PROFILE NOT COMPLETED
    // -------------------------------------------------------

    if (
      isAuthenticated &&
      hasAcceptedPolicy &&
      !hasCompletedProfile
    ) {

      if (activeMenu !== 'profile') {
        setRoute('profile');
      }

      return;
    }

  }, [
    loading,
    activeMenu,
    isAuthenticated,
    hasAcceptedPolicy,
    hasCompletedProfile,
    isPublicRoute
  ]);


  /*
   * ---------------------------------------------------------
   * PAGE TITLE
   * ---------------------------------------------------------
   */

  useEffect(() => {

    const titles = {

      landing:
        'Bhagwn Solutions - Preserving Wealth, Empowering Growth',

      policy:
        'Bhagwn Solutions - Company Policy',

      dashboard:
        'Bhagwn Solutions - Executive Dashboard',

      business:
        'Bhagwn Solutions - My Business',

      wallet:
        'Bhagwn Solutions - Financial Wallet',

      profile:
        'Bhagwn Solutions - Profile Settings',

      knowledge:
        'Bhagwn Solutions - Knowledge Center',

      support:
        'Bhagwn Solutions - Help Desk',

      settings:
        'Bhagwn Solutions - Portal Settings',

      login:
        'Bhagwn Solutions - Sign In',

      signup:
        'Bhagwn Solutions - Sign Up'
    };


    document.title =
      titles[activeMenu] ||
      'Bhagwn Solutions';

  }, [activeMenu]);


  /*
   * ---------------------------------------------------------
   * PROFILE DATA
   * ---------------------------------------------------------
   */

  const [profileForm, setProfileForm] =
    useState({

      fullName: '',
      fatherOrHusbandName: '',
      motherName: '',
      email: '',
      phone: '',
      dob: '',
      gender: 'Male',
      nationality: 'Indian',
      aadhaarNumber: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      nomineeName: '',
      nomineeRelation: ''

    });


  const [bankForm, setBankForm] =
    useState({

      bankName: '',
      accountNumber: '',
      holderName: '',
      ifscCode: '',
      branchName: '',
      accountType: 'Savings Account',
      paytmPhonePe: '',
      paymentMobile: ''

    });


  const [planForm, setPlanForm] =
    useState({

      planName: '',
      schemeAmount: '',
      referenceId: '',
      referenceName: '',
      referralCode: '',
      sourceOfIncome: '',
      businessDetail: '',
      serviceDetail: '',
      regDate: '',
      regPlace: ''

    });


  const [documentsForm, setDocumentsForm] =
    useState({

      aadhaarUrl: '',
      passbookUrl: ''

    });


  const [loadingProfile, setLoadingProfile] =
    useState(false);


  /*
   * ---------------------------------------------------------
   * LOAD MEMBER FROM SUPABASE
   * ---------------------------------------------------------
   */

  useEffect(() => {

    const loadMemberProfile = async () => {

      if (!user?.id) {
        return;
      }


      try {

        setLoadingProfile(true);


        const {
          data,
          error
        } = await supabase
          .from('members')
          .select('*')
          .eq('id', user.id)
          .single();


        if (error) {

          console.error(
            'Error loading member profile:',
            error
          );


          triggerToast(
            'Unable to load your profile.',
            'error'
          );


          return;
        }


        if (!data) {
          return;
        }


        /*
         * PERSONAL INFORMATION
         */

        setProfileForm({

          fullName:
            data.full_name || '',

          fatherOrHusbandName:
            data.father_or_husband_name || '',

          motherName:
            data.mother_name || '',

          email:
            data.email ||
            user.email ||
            '',

          phone:
            data.phone || '',

          dob:
            data.date_of_birth ||
            data.dob ||
            '',

          gender:
            data.gender ||
            'Male',

          nationality:
            data.nationality ||
            'Indian',

          aadhaarNumber:
            data.aadhaar_number ||
            '',

          street:
            data.address ||
            '',

          city:
            data.city ||
            '',

          state:
            data.state ||
            '',

          zip:
            data.pincode ||
            '',

          country:
            data.country ||
            'India',

          nomineeName:
            data.nominee_name ||
            '',

          nomineeRelation:
            data.nominee_relation ||
            ''

        });


        /*
         * BANK INFORMATION
         */

        setBankForm({

          bankName:
            data.bank_name ||
            '',

          accountNumber:
            data.account_number ||
            '',

          holderName:
            data.account_holder_name ||
            data.full_name ||
            '',

          ifscCode:
            data.ifsc_code ||
            '',

          branchName:
            data.branch_name ||
            '',

          accountType:
            data.account_type ||
            '',

          paytmPhonePe:
            data.paytm_phone_pe ||
            '',

          paymentMobile:
            data.payment_mobile ||
            ''

        });


        /*
         * PLAN / REFERRAL / PAYMENT
         */

        setPlanForm({

          planName:
            data.membership_plan ||
            '',

          schemeAmount:
            data.plan_amount ||
            '',

          referenceId:
            data.reference_id ||
            '',

          referenceName:
            data.reference_name ||
            '',

          referralCode:
            data.member_id ||
            '',

          sourceOfIncome:
            data.source_of_income ||
            '',

          businessDetail:
            data.business_detail ||
            '',

          serviceDetail:
            data.service_detail ||
            '',

          regDate:
            data.reg_date ||
            '',

          regPlace:
            data.reg_place ||
            '',

          paymentStatus:
            data.payment_status ||
            'unpaid',

          paymentReference:
            data.payment_reference ||
            ''

        });


        /*
         * DOCUMENTS
         */

        setDocumentsForm({

          aadhaarUrl:
            data.aadhaar_document_url ||
            '',

          passbookUrl:
            data.passbook_document_url ||
            ''

        });


      } catch (error) {

        console.error(
          'Unexpected profile loading error:',
          error
        );


        triggerToast(
          'Something went wrong while loading your profile.',
          'error'
        );


      } finally {

        setLoadingProfile(false);

      }

    };


    loadMemberProfile();

  }, [user?.id]);


  /*
   * ---------------------------------------------------------
   * FORM HANDLERS
   * ---------------------------------------------------------
   */

  const handleProfileChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setProfileForm((prev) => ({

      ...prev,

      [name]: value

    }));

  };


  const handleBankChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setBankForm((prev) => ({

      ...prev,

      [name]: value

    }));

  };


  const handlePlanChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setPlanForm((prev) => ({

      ...prev,

      [name]: value

    }));

  };


  /*
   * ---------------------------------------------------------
   * SAVE PERSONAL PROFILE
   * ---------------------------------------------------------
   */

  const handleProfileSubmit = async (e) => {

    e.preventDefault();


    if (!user?.id) {

      triggerToast(
        'You must be logged in to update your profile.',
        'error'
      );

      return;
    }


    try {

      const {
        error
      } = await supabase
        .from('members')
        .update({

          full_name:
            profileForm.fullName.trim(),

          email:
            profileForm.email
              .trim()
              .toLowerCase(),

          phone:
            profileForm.phone ||
            null,

          father_or_husband_name:
            profileForm.fatherOrHusbandName ||
            null,

          mother_name:
            profileForm.motherName ||
            null,

          date_of_birth:
            profileForm.dob ||
            null,

          gender:
            profileForm.gender ||
            null,

          nationality:
            profileForm.nationality ||
            null,

          aadhaar_number:
            profileForm.aadhaarNumber ||
            null,

          address:
            profileForm.street ||
            null,

          city:
            profileForm.city ||
            null,

          state:
            profileForm.state ||
            null,

          pincode:
            profileForm.zip ||
            null,

          country:
            profileForm.country ||
            null,

          nominee_name:
            profileForm.nomineeName ||
            null,

          nominee_relation:
            profileForm.nomineeRelation ||
            null,

          updated_at:
            new Date().toISOString()

        })
        .eq('id', user.id);


      if (error) {

        console.error(
          'Profile update error:',
          error
        );


        throw new Error(
          error.message ||
          'Unable to update profile.'
        );

      }


      triggerToast(
        'Profile information updated successfully!'
      );


    } catch (error) {

      triggerToast(
        error.message ||
        'Failed to update profile.',
        'error'
      );

    }

  };


  /*
   * ---------------------------------------------------------
   * SAVE BANK DETAILS
   * ---------------------------------------------------------
   */

  const handleBankSubmit = async (e) => {

    e.preventDefault();


    if (!user?.id) {

      triggerToast(
        'You must be logged in.',
        'error'
      );

      return;
    }


    try {

      const {
        error
      } = await supabase
        .from('members')
        .update({

          bank_name:
            bankForm.bankName ||
            null,

          account_number:
            bankForm.accountNumber ||
            null,

          account_holder_name:
            bankForm.holderName ||
            null,

          ifsc_code:
            bankForm.ifscCode ||
            null,

          branch_name:
            bankForm.branchName ||
            null,

          updated_at:
            new Date().toISOString()

        })
        .eq('id', user.id);


      if (error) {

        console.error(
          'Bank update error:',
          error
        );


        throw new Error(
          error.message ||
          'Unable to update bank details.'
        );

      }


      triggerToast(
        'Bank details updated successfully!'
      );


    } catch (error) {

      triggerToast(
        error.message ||
        'Failed to update bank details.',
        'error'
      );

    }

  };


  /*
   * ---------------------------------------------------------
   * SAVE PLAN / REFERRAL DETAILS
   * ---------------------------------------------------------
   */

  const handlePlanSubmit = async (e) => {

    if (e) {
      e.preventDefault();
    }


    if (!user?.id) {

      triggerToast(
        'You must be logged in.',
        'error'
      );

      return;
    }


    try {

      const {
        error
      } = await supabase
        .from('members')
        .update({

          membership_plan:
            planForm.planName ||
            null,

          plan_amount:
            planForm.schemeAmount ||
            null,

          payment_reference:
            planForm.paymentReference ||
            null,

          payment_status:
            'pending',

          updated_at:
            new Date().toISOString()

        })
        .eq('id', user.id);


      if (error) {

        console.error(
          'Plan update error:',
          error
        );


        throw new Error(
          error.message ||
          'Unable to update plan information.'
        );

      }


      triggerToast(
        'Plan & referral information updated successfully!'
      );


    } catch (error) {

      triggerToast(
        error.message ||
        'Failed to update plan information.',
        'error'
      );

    }

  };


  /*
   * ---------------------------------------------------------
   * COMPLETE PROFILE
   * ---------------------------------------------------------
   */

  const completeProfile = async () => {

    if (!user?.id) {
      return;
    }


    try {

      const {
        error
      } = await supabase
        .from('members')
        .update({

          profile_completed:
            true,

          updated_at:
            new Date().toISOString()

        })
        .eq('id', user.id);


      if (error) {

        console.error(
          'Profile completion error:',
          error
        );

        throw error;

      }


      triggerToast(
        'Profile completed successfully!'
      );


      setTimeout(() => {

        window.location.reload();

      }, 800);


    } catch (error) {

      triggerToast(
        error.message ||
        'Unable to complete profile.',
        'error'
      );

    }

  };


  /*
   * ---------------------------------------------------------
   * DARK MODE
   * ---------------------------------------------------------
   */

  const toggleDarkMode = () => {

    setDarkMode((prev) => {

      const next = !prev;


      if (next) {

        document.documentElement.classList.add(
          'dark'
        );


        triggerToast(
          'Dark Mode Enabled',
          'info'
        );

      } else {

        document.documentElement.classList.remove(
          'dark'
        );


        triggerToast(
          'Light Mode Enabled',
          'info'
        );

      }


      return next;

    });

  };


  /*
   * ---------------------------------------------------------
   * NOTIFICATIONS
   * ---------------------------------------------------------
   */

  const notificationsList = [

    {
      id: 1,
      text: 'New referral joined your downline',
      time: '5m ago',
      unread: true
    },

    {
      id: 2,
      text: 'Dividend payout processed successfully',
      time: '2h ago',
      unread: false
    },

    {
      id: 3,
      text: 'System maintenance scheduled',
      time: '1d ago',
      unread: false
    }

  ];


  /*
   * ---------------------------------------------------------
   * PROFILE LOADING
   * ---------------------------------------------------------
   */

  if (
    isAuthenticated &&
    activeMenu === 'profile' &&
    loadingProfile
  ) {

    return (

      <div className="min-h-screen bg-background text-on-background flex items-center justify-center">

        <div className="flex flex-col items-center gap-3">

          <span className="material-symbols-outlined text-[36px] animate-spin">
            progress_activity
          </span>

          <p className="text-sm text-warm-gray">
            Loading your profile...
          </p>

        </div>

      </div>

    );

  }


  /*
   * ---------------------------------------------------------
   * LANDING
   * ---------------------------------------------------------
   */

  if (activeMenu === 'landing') {

    return (

      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200">

        {toast.show && (

          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce">

            <span
              className={`material-symbols-outlined ${toast.type === 'success'
                  ? 'text-tertiary'
                  : 'text-primary'
                }`}
            >

              {toast.type === 'success'
                ? 'check_circle'
                : 'info'}

            </span>

            <span className="font-semibold text-body-sm">
              {toast.message}
            </span>

          </div>

        )}


        <LandingPage

          onGetStarted={() => {

            setRoute(

              isAuthenticated

                ? hasAcceptedPolicy
                  ? 'dashboard'
                  : 'policy'

                : 'login'

            );

          }}

          setRoute={setRoute}
          triggerToast={triggerToast}

          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}

        />

      </div>

    );

  }


  /*
   * ---------------------------------------------------------
   * LOGIN
   * ---------------------------------------------------------
   */

  if (activeMenu === 'login') {

    return (

      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200">

        {toast.show && (

          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce">

            <span
              className={`material-symbols-outlined ${toast.type === 'success'
                  ? 'text-tertiary'
                  : 'text-primary'
                }`}
            >

              {toast.type === 'success'
                ? 'check_circle'
                : 'info'}

            </span>

            <span className="font-semibold text-body-sm">
              {toast.message}
            </span>

          </div>

        )}


        <Login
          setRoute={setRoute}
          triggerToast={triggerToast}
        />

      </div>

    );

  }


  /*
   * ---------------------------------------------------------
   * SIGNUP
   * ---------------------------------------------------------
   */

  if (activeMenu === 'signup') {

    return (

      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200">

        {toast.show && (

          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce">

            <span
              className={`material-symbols-outlined ${toast.type === 'success'
                  ? 'text-tertiary'
                  : 'text-primary'
                }`}
            >

              {toast.type === 'success'
                ? 'check_circle'
                : 'info'}

            </span>

            <span className="font-semibold text-body-sm">
              {toast.message}
            </span>

          </div>

        )}


        <Signup
          setRoute={setRoute}
          triggerToast={triggerToast}
        />

      </div>

    );

  }


  /*
   * ---------------------------------------------------------
   * COMPANY POLICY
   * ---------------------------------------------------------
   */

  if (activeMenu === 'policy') {

    return (

      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200">

        {toast.show && (

          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce">

            <span
              className={`material-symbols-outlined ${toast.type === 'success'
                  ? 'text-tertiary'
                  : 'text-primary'
                }`}
            >

              {toast.type === 'success'
                ? 'check_circle'
                : 'info'}

            </span>

            <span className="font-semibold text-body-sm">
              {toast.message}
            </span>

          </div>

        )}


        <CompanyPolicy
          setRoute={setRoute}
          triggerToast={triggerToast}
        />

      </div>

    );

  }


  /*
   * ---------------------------------------------------------
   * MAIN APPLICATION
   * ---------------------------------------------------------
   */

  return (

    <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased flex transition-colors duration-200">


      {/* =====================================================
          TOAST
          ===================================================== */}

      {toast.show && (

        <div className="fixed bottom-5 right-5 z-[999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl bg-cream border border-sand animate-fade-in">

          <span
            className={`material-symbols-outlined ${toast.type === 'success'
                ? 'text-forest'
                : 'text-primary'
              }`}
          >

            {toast.type === 'success'
              ? 'check_circle'
              : 'info'}

          </span>

          <span className="text-[13px] font-semibold text-espresso">
            {toast.message}
          </span>

        </div>

      )}


      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-sidebar-width bg-bone border-r border-sand z-50">


        {/* Logo */}

        <div className="flex flex-col items-center pt-8 pb-5 px-6">

          <img
            src="/logo.png"
            alt="Bhagwn Solutions"
            className="w-[170px] h-auto object-contain"
          />


          <div className="flex items-center gap-3 mt-5 w-full">

            <div className="flex-1 h-px bg-gold/30" />

            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold select-none">
              {t('common.executivePortal')}
            </span>

            <div className="flex-1 h-px bg-gold/30" />

          </div>

        </div>


        {/* Navigation */}

        <nav className="flex-1 px-4 mt-2 overflow-y-auto hide-scrollbar">

          <ul className="space-y-1">

            {[

              {
                id: 'dashboard',
                icon: 'dashboard',
                label: t('nav.dashboard')
              },

              {
                id: 'business',
                icon: 'account_tree',
                label: t('nav.referralCenter')
              },

              {
                id: 'wallet',
                icon: 'account_balance_wallet',
                label: t('nav.financialWallet')
              },

              {
                id: 'profile',
                icon: 'person',
                label: t('nav.profileSettings')
              },

              {
                id: 'knowledge',
                icon: 'library_books',
                label: t('nav.knowledgeHub')
              },

              {
                id: 'support',
                icon: 'help_center',
                label: t('nav.helpDesk')
              },

              {
                id: 'settings',
                icon: 'settings',
                label: t('nav.systemSettings')
              }

            ].map((item) => {

              const isActive =
                activeMenu === item.id;


              const isLocked =
                !hasCompletedProfile &&
                item.id !== 'profile';


              return (

                <li key={item.id}>

                  <button
                    type="button"
                    onClick={() => {

                      if (isLocked) {

                        triggerToast(
                          t(
                            'profile.lockedNavNotice'
                          ),
                          'info'
                        );

                        return;
                      }


                      setRoute(item.id);

                    }}
                    className={`w-full flex items-center justify-between px-4 py-[10px] rounded-lg text-[14px] transition-all duration-200 ${isLocked
                        ? 'text-warm-gray/60 bg-bone/40 cursor-not-allowed opacity-70'
                        : isActive
                          ? 'bg-primary text-on-primary font-semibold shadow-sm cursor-pointer'
                          : 'text-warm-gray hover:text-espresso hover:bg-ivory/60 font-medium cursor-pointer'
                      }`}
                    title={
                      isLocked
                        ? t(
                          'profile.lockedTooltip'
                        )
                        : item.label
                    }
                  >

                    <div className="flex items-center gap-3">

                      <span
                        className={`material-symbols-outlined text-[20px] ${isActive
                            ? 'filled-icon'
                            : ''
                          }`}
                      >
                        {item.icon}
                      </span>


                      <span>
                        {item.label}
                      </span>

                    </div>


                    {isLocked ? (

                      <span className="material-symbols-outlined text-[16px] text-warm-gray/60">
                        lock
                      </span>

                    ) : item.id === 'profile' &&
                      !hasCompletedProfile ? (

                      <span className="text-[10px] font-bold bg-gold text-white px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                        Required
                      </span>

                    ) : null}

                  </button>

                </li>

              );

            })}

          </ul>

        </nav>


        {/* Sidebar Bottom */}

        <div className="px-5 pb-6 pt-4 space-y-2 border-t border-sand mt-auto">


          {/* Invite */}

          <button
            onClick={() =>
              triggerToast(
                'Invitation link copied to clipboard!'
              )
            }
            className="w-full bg-primary text-on-primary h-10 rounded-lg text-[13px] font-semibold hover:bg-[#641722] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >

            <span className="material-symbols-outlined text-[18px]">
              person_add
            </span>

            {t('nav.invitePartner')}

          </button>


          {/* Logout */}

          <button
            onClick={async () => {

              try {

                await logout();

                setRoute('landing');

                triggerToast(
                  'Logged out successfully'
                );

              } catch (error) {

                triggerToast(
                  error.message ||
                  'Logout failed.',
                  'error'
                );

              }

            }}
            className="w-full border border-primary/30 text-primary h-10 rounded-lg text-[13px] font-semibold hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >

            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>

            {t('common.signOut')}

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="flex-1 md:ml-sidebar-width min-h-screen flex flex-col">


        {/* ===================================================
            TOP NAVIGATION
            =================================================== */}

        <header className="flex justify-between items-center px-8 z-40 fixed top-0 right-0 md:left-sidebar-width h-[60px] bg-cream/80 backdrop-blur-md border-b border-sand">


          {/* Search */}

          <div className="flex-1 flex items-center">

            <div className="relative w-56">

              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray text-[20px]">
                search
              </span>


              <input
                className="w-full pl-10 pr-4 h-9 bg-bone border border-sand rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30 placeholder:text-warm-gray/60"
                placeholder={t('common.search')}
                type="text"
                onKeyDown={(e) => {

                  if (e.key === 'Enter') {

                    triggerToast(
                      `Searching for "${e.target.value}"`
                    );

                  }

                }}
              />

            </div>

          </div>


          {/* Right Side */}

          <div className="flex items-center gap-5 relative">


            {/* Notifications */}

            <div className="relative">

              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                className="w-9 h-9 rounded-lg flex items-center justify-center text-warm-gray hover:text-espresso hover:bg-ivory transition-all cursor-pointer relative"
              >

                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>

                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-cream" />

              </button>


              {showNotifications && (

                <div className="absolute right-0 mt-2 w-80 bg-cream border border-sand rounded-xl shadow-xl py-1 z-50">

                  <div className="px-4 py-3 border-b border-sand font-semibold text-[13px] text-espresso">
                    {t('common.notifications')}
                  </div>


                  <ul className="divide-y divide-sand/50">

                    {notificationsList.map(
                      (notif) => (

                        <li
                          key={notif.id}
                          className="px-4 py-3 hover:bg-bone cursor-pointer transition-colors"
                          onClick={() =>
                            triggerToast(
                              `Clicked: ${notif.text}`
                            )
                          }
                        >

                          <p
                            className={`text-[13px] text-espresso ${notif.unread
                                ? 'font-semibold'
                                : ''
                              }`}
                          >
                            {notif.text}
                          </p>


                          <span className="text-[11px] text-warm-gray mt-1 block">
                            {notif.time}
                          </span>

                        </li>

                      )
                    )}

                  </ul>

                </div>

              )}

            </div>


            {/* Dark Mode */}

            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-warm-gray hover:text-espresso hover:bg-ivory transition-all cursor-pointer"
            >

              <span className="material-symbols-outlined text-[20px]">

                {darkMode
                  ? 'light_mode'
                  : 'dark_mode'}

              </span>

            </button>


            {/* Language */}

            <div className="relative">

              <button
                onClick={() => {

                  const targetLang =
                    locale === 'en'
                      ? 'hi'
                      : 'en';


                  switchLanguage(
                    targetLang
                  );


                  triggerToast(
                    `Language switched to ${targetLang === 'en'
                      ? 'English'
                      : 'हिंदी'
                    }`
                  );

                }}
                className="h-8 px-3 rounded-lg bg-bone border border-sand hover:bg-ivory text-[12px] font-semibold text-espresso transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >

                <span className="material-symbols-outlined text-[16px] text-gold">
                  translate
                </span>


                <span>

                  {locale === 'en'
                    ? 'EN | हिंदी'
                    : 'हिंदी | EN'}

                </span>

              </button>

            </div>


            <div className="w-px h-7 bg-sand" />


            {/* User */}

            <div
              onClick={() => {

                setRoute('profile');

                triggerToast(
                  'Viewing Account Settings'
                );

              }}
              className="flex items-center gap-2.5 cursor-pointer group pl-1"
            >

              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-sand group-hover:ring-primary/40 transition-all">

                <div className="w-full h-full bg-primary text-white flex items-center justify-center font-bold">

                  {user?.fullName
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    'U'}

                </div>

              </div>


              <div className="hidden lg:block">

                <p className="text-[13px] font-semibold text-espresso leading-tight">

                  {user?.fullName ||
                    'Executive Partner'}

                </p>


                <p className="text-[11px] text-warm-gray leading-tight">

                  {user?.membershipPlan ||
                    'Executive Partner'}

                </p>

              </div>


              <span className="material-symbols-outlined text-warm-gray text-[16px] hidden lg:block">
                expand_more
              </span>

            </div>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
            =================================================== */}

        <div className="mt-[60px] p-6 md:p-8 max-w-[1440px] mx-auto w-full flex-1 animate-fade-in">


          {/* =================================================
              BREADCRUMB
              ================================================= */}

          <nav
            aria-label="Breadcrumb"
            className="flex text-warm-gray text-[13px] mb-6"
          >

            <ol className="inline-flex items-center gap-1.5">

              <li className="inline-flex items-center">

                <a
                  className="hover:text-primary transition-colors"
                  href="#"
                  onClick={(e) => {

                    e.preventDefault();

                    setRoute('dashboard');

                  }}
                >

                  {t('nav.dashboard')}

                </a>

              </li>


              {activeMenu !== 'dashboard' && (

                <li>

                  <div className="flex items-center gap-1.5">

                    <span className="material-symbols-outlined text-[14px]">
                      chevron_right
                    </span>


                    <span className="text-espresso font-semibold">

                      {activeMenu === 'business' &&
                        t('nav.referralCenter')}

                      {activeMenu === 'wallet' &&
                        t('nav.financialWallet')}

                      {activeMenu === 'profile' &&
                        t('nav.profileSettings')}

                      {activeMenu === 'knowledge' &&
                        t('nav.knowledgeHub')}

                      {activeMenu === 'support' &&
                        t('nav.helpDesk')}

                      {activeMenu === 'settings' &&
                        t('nav.systemSettings')}

                    </span>

                  </div>

                </li>

              )}

            </ol>

          </nav>


          {/* =================================================
              PAGES
              ================================================= */}

          {activeMenu === 'dashboard' && (

            <Dashboard
              triggerToast={triggerToast}
            />

          )}


          {activeMenu === 'business' && (

            <MyBusiness
              triggerToast={triggerToast}
            />

          )}


          {activeMenu === 'wallet' && (

            <Wallet
              triggerToast={triggerToast}
            />

          )}


          {activeMenu === 'profile' && (

            <Profile

              setRoute={setRoute}

              activeTab={activeTab}
              setActiveTab={setActiveTab}

              profileForm={profileForm}

              handleProfileChange={
                handleProfileChange
              }

              handleProfileSubmit={
                handleProfileSubmit
              }


              bankForm={bankForm}

              handleBankChange={
                handleBankChange
              }

              handleBankSubmit={
                handleBankSubmit
              }


              planForm={planForm}

              handlePlanChange={
                handlePlanChange
              }

              handlePlanSubmit={
                handlePlanSubmit
              }


              documentsForm={documentsForm}

              setDocumentsForm={
                setDocumentsForm
              }


              triggerToast={
                triggerToast
              }


              completeProfile={
                completeProfile
              }

            />

          )}


          {activeMenu === 'knowledge' && (

            <KnowledgeCenter
              triggerToast={triggerToast}
            />

          )}


          {activeMenu === 'support' && (

            <Support
              triggerToast={triggerToast}
            />

          )}


          {activeMenu === 'settings' && (

            <Settings

              darkMode={darkMode}

              toggleDarkMode={
                toggleDarkMode
              }

              language={language}

              setLanguage={setLanguage}

              triggerToast={
                triggerToast
              }

            />

          )}

        </div>

      </main>

    </div>

  );
}


/*
 * ---------------------------------------------------------
 * ROOT APP
 * ---------------------------------------------------------
 */

function App() {

  return (

    <AuthProvider>

      <AppContent />

    </AuthProvider>

  );

}


export default App;