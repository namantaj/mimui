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

function AppContent() {
  const { isAuthenticated, hasAcceptedPolicy, hasCompletedProfile, user, logout } = useAuth();
  const { t, locale, switchLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'bank', 'kyc'
  
  // Initialize route state based on URL hash
  const [activeMenu, setActiveMenu] = useState(() => {
    const hash = window.location.hash.replace('#/', '');
    return hash || 'landing';
  });
  
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState('English');

  // Helper function to update route/hash
  const setRoute = (route) => {
    window.location.hash = `#/${route}`;
  };

  // Listen to hash change to support browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      setActiveMenu(hash || 'landing');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Enforce Protected Routes & Mandatory Flow
  const isPublicRoute = activeMenu === 'landing' || activeMenu === 'login' || activeMenu === 'signup';

  useEffect(() => {
    if (!isPublicRoute && !isAuthenticated) {
      setRoute('login');
    } else if (isAuthenticated && !hasAcceptedPolicy && activeMenu !== 'policy') {
      setRoute('policy');
    } else if (isAuthenticated && hasAcceptedPolicy && !hasCompletedProfile && activeMenu !== 'profile') {
      setRoute('profile');
    }
  }, [activeMenu, isAuthenticated, hasAcceptedPolicy, hasCompletedProfile, isPublicRoute]);

  useEffect(() => {
    const titles = {
      landing: 'Bhagwn Solutions - Preserving Wealth, Empowering Growth',
      policy: 'Bhagwn Solutions - Company Policy',
      dashboard: 'Bhagwn Solutions - Executive Dashboard',
      business: 'Bhagwn Solutions - My Business',
      wallet: 'Bhagwn Solutions - Financial Wallet',
      profile: 'Bhagwn Solutions - Profile Settings',
      knowledge: 'Bhagwn Solutions - Knowledge Center',
      support: 'Bhagwn Solutions - Help Desk',
      settings: 'Bhagwn Solutions - Portal Settings',
      login: 'Bhagwn Solutions - Sign In',
      signup: 'Bhagwn Solutions - Sign Up'
    };
    document.title = titles[activeMenu] || 'Bhagwn Solutions';
  }, [activeMenu]);
  
  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Form states initialized with defaults, updated when mock user logs in
  const [profileForm, setProfileForm] = useState({
    fullName: 'Alexander Wright',
    fatherOrHusbandName: 'Robert Wright',
    motherName: 'Eleanor Wright',
    email: 'alexander.wright@mlmenterprise.com',
    phone: '6393552408',
    dob: '1985-06-15',
    gender: 'Male',
    nationality: 'Indian',
    aadhaarNumber: '9842 1234 5678',
    street: '1234 Silicon Valley Blvd, Suite 200',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
    nomineeName: 'Catherine Wright',
    nomineeRelation: 'Spouse'
  });

  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const [bankForm, setBankForm] = useState({
    bankName: 'State Bank of India',
    accountNumber: '38491029485',
    holderName: 'Alexander Wright',
    ifscCode: 'SBIN0001234',
    accountType: 'Savings',
    paytmPhonePe: '9876543210@paytm',
    paymentMobile: '+91 98765 43210'
  });

  useEffect(() => {
    if (user) {
      setBankForm(prev => ({
        ...prev,
        holderName: user.fullName
      }));
    }
  }, [user]);

  const [planForm, setPlanForm] = useState({
    planName: 'Daily Return Plan',
    schemeAmount: '1,00,000',
    referenceId: 'REF-847291',
    referenceName: 'Vikram Sharma',
    referralCode: 'REF1001',
    sourceOfIncome: 'Business / Self-Employed',
    businessDetail: 'Financial Consultancy & Advisory Services',
    serviceDetail: 'Executive Wealth Portfolio Management',
    regDate: '2021-10-12',
    regPlace: 'Head Office (New Delhi)'
  });

  const [kycForm, setKycForm] = useState({
    docType: 'Passport',
    docNumber: 'US987654321',
    status: 'Verified' // 'Pending', 'Verified', 'Not Started'
  });

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      triggerToast('Dark Mode Enabled', 'info');
    } else {
      document.documentElement.classList.remove('dark');
      triggerToast('Light Mode Enabled', 'info');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlanForm(prev => ({ ...prev, [name]: value }));
  };

  const handleKycChange = (e) => {
    const { name, value } = e.target;
    setKycForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    triggerToast('Profile Information Updated successfully!');
  };

  const handleBankSubmit = (e) => {
    e.preventDefault();
    triggerToast('Bank Details Updated successfully!');
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    triggerToast('Plan & Referral Information Updated successfully!');
  };

  const handleKycSubmit = (e) => {
    e.preventDefault();
    triggerToast('KYC Documents submitted for verification!');
  };

  // Mock Notifications list
  const notificationsList = [
    { id: 1, text: "New referral joined your downline: Sarah Jenkins", time: "5m ago", unread: true },
    { id: 2, text: "Dividend payout of $1,250.00 processed successfully", time: "2h ago", unread: false },
    { id: 3, text: "System maintenance scheduled for tonight at 2 AM EST", time: "1d ago", unread: false }
  ];

  if (activeMenu === 'landing') {
    return (
      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200">
        {toast.show && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce">
            <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-tertiary' : 'text-primary'}`}>
              {toast.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span className="font-semibold text-body-sm">{toast.message}</span>
          </div>
        )}
        <LandingPage 
          onGetStarted={() => {
            setRoute(isAuthenticated ? (hasAcceptedPolicy ? 'dashboard' : 'policy') : 'login');
          }} 
          setRoute={setRoute}
          triggerToast={triggerToast}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
    );
  }

  if (activeMenu === 'login') {
    return (
      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200">
        {toast.show && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce">
            <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-tertiary' : 'text-primary'}`}>
              {toast.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span className="font-semibold text-body-sm">{toast.message}</span>
          </div>
        )}
        <Login setRoute={setRoute} triggerToast={triggerToast} />
      </div>
    );
  }

  if (activeMenu === 'signup') {
    return (
      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200">
        {toast.show && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce">
            <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-tertiary' : 'text-primary'}`}>
              {toast.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span className="font-semibold text-body-sm">{toast.message}</span>
          </div>
        )}
        <Signup setRoute={setRoute} triggerToast={triggerToast} />
      </div>
    );
  }

  if (activeMenu === 'policy') {
    return (
      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200">
        {toast.show && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce">
            <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-tertiary' : 'text-primary'}`}>
              {toast.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span className="font-semibold text-body-sm">{toast.message}</span>
          </div>
        )}
        <CompanyPolicy setRoute={setRoute} triggerToast={triggerToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased flex transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-[999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl bg-cream border border-sand animate-fade-in">
          <span className={`material-symbols-outlined text-[18px] ${toast.type === 'success' ? 'text-forest' : 'text-primary'}`}>
            {toast.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span className="text-[13px] font-semibold text-espresso">{toast.message}</span>
        </div>
      )}

      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-sidebar-width bg-bone border-r border-sand z-50">
        
        {/* Logo Branding Area */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <img src="/logo.png" alt="Bhagwn Solutions" className="w-[170px] h-auto object-contain" />
          
          {/* Gold decorative divider */}
          <div className="flex items-center gap-3 mt-5 w-full">
            <div className="flex-1 h-px bg-gold/30"></div>
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold select-none">{t('common.executivePortal')}</span>
            <div className="flex-1 h-px bg-gold/30"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-2 overflow-y-auto hide-scrollbar">
          <ul className="space-y-1">
            {[
              { id: 'dashboard', icon: 'dashboard', label: t('nav.dashboard') },
              { id: 'business', icon: 'account_tree', label: t('nav.referralCenter') },
              { id: 'wallet', icon: 'account_balance_wallet', label: t('nav.financialWallet') },
              { id: 'profile', icon: 'person', label: t('nav.profileSettings') },
              { id: 'knowledge', icon: 'library_books', label: t('nav.knowledgeHub') },
              { id: 'support', icon: 'help_center', label: t('nav.helpDesk') },
              { id: 'settings', icon: 'settings', label: t('nav.systemSettings') }
            ].map((item) => {
              const isActive = activeMenu === item.id;
              const isLocked = !hasCompletedProfile && item.id !== 'profile';

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        triggerToast(t('profile.lockedNavNotice'), 'info');
                        return;
                      }
                      setRoute(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-[10px] rounded-lg text-[14px] transition-all duration-200 ${
                      isLocked 
                        ? 'text-warm-gray/60 bg-bone/40 cursor-not-allowed opacity-70'
                        : isActive 
                          ? 'bg-primary text-on-primary font-semibold shadow-sm cursor-pointer' 
                          : 'text-warm-gray hover:text-espresso hover:bg-ivory/60 font-medium cursor-pointer'
                    }`}
                    title={isLocked ? t('profile.lockedTooltip') : item.label}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'filled-icon' : ''}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {isLocked ? (
                      <span className="material-symbols-outlined text-[16px] text-warm-gray/60">lock</span>
                    ) : item.id === 'profile' && !hasCompletedProfile ? (
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

        {/* Bottom Actions */}
        <div className="px-5 pb-6 pt-4 space-y-2 border-t border-sand mt-auto">
          <button 
            onClick={() => triggerToast("Invitation link copied to clipboard!")}
            className="w-full bg-primary text-on-primary h-10 rounded-lg text-[13px] font-semibold hover:bg-[#641722] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            {t('nav.invitePartner')}
          </button>
          <button 
            onClick={() => {
              logout();
              setRoute('landing');
              triggerToast("Logged out successfully");
            }}
            className="w-full border border-primary/30 text-primary h-10 rounded-lg text-[13px] font-semibold hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            {t('common.signOut')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-sidebar-width min-h-screen flex flex-col">
        
        {/* TopNavBar */}
        <header className="flex justify-between items-center px-8 z-40 fixed top-0 right-0 md:left-sidebar-width h-[60px] bg-cream/80 backdrop-blur-md border-b border-sand">
          <div className="flex-1 flex items-center">
            <div className="relative w-56">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray text-[20px]">search</span>
              <input 
                className="w-full pl-10 pr-4 h-9 bg-bone border border-sand rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30 placeholder:text-warm-gray/60" 
                placeholder={t('common.search')} 
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    triggerToast(`Searching for "${e.target.value}"`);
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5 relative">
            {/* Notification trigger */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-warm-gray hover:text-espresso hover:bg-ivory transition-all cursor-pointer relative"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-cream"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-cream border border-sand rounded-xl shadow-xl py-1 z-50">
                  <div className="px-4 py-3 border-b border-sand font-semibold text-[13px] text-espresso">
                    {t('common.notifications')}
                  </div>
                  <ul className="divide-y divide-sand/50">
                    {notificationsList.map(notif => (
                      <li key={notif.id} className="px-4 py-3 hover:bg-bone cursor-pointer transition-colors" onClick={() => triggerToast(`Clicked: ${notif.text}`)}>
                        <p className={`text-[13px] text-espresso ${notif.unread ? 'font-semibold' : ''}`}>{notif.text}</p>
                        <span className="text-[11px] text-warm-gray mt-1 block">{notif.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Dark Mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-warm-gray hover:text-espresso hover:bg-ivory transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Translate / Language Switcher Button ("EN | हिंदी") */}
            <div className="relative">
              <button 
                onClick={() => {
                  const targetLang = locale === 'en' ? 'hi' : 'en';
                  switchLanguage(targetLang);
                  triggerToast(`Language switched to ${targetLang === 'en' ? 'English' : 'हिंदी'}`);
                }}
                className="h-8 px-3 rounded-lg bg-bone border border-sand hover:bg-ivory text-[12px] font-semibold text-espresso transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Switch Language / भाषा बदलें"
              >
                <span className="material-symbols-outlined text-[16px] text-gold">translate</span>
                <span>{locale === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
              </button>
            </div>

            {/* Separator */}
            <div className="w-px h-7 bg-sand"></div>

            {/* User Avatar & Name */}
            <div 
              onClick={() => {
                setRoute('profile');
                triggerToast("Viewing Account Settings");
              }}
              className="flex items-center gap-2.5 cursor-pointer group pl-1"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-sand group-hover:ring-primary/40 transition-all">
                <img 
                  alt="User Avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOnnsIyGQRXtdKlMlRbEOvUF5XvANm32XMz-jtADr_BM1ygV0rZYMrasrKyye-6D8SZfwOgEAWfSLRLWqhJQdyNTQ6PVGKpE8gRW9rHlDPeDmKt56eA0ei6EVyactjcBja2l0JFTBqR8bvyGPIZH91qWJoGplBRoGyXmXH4bCZchybK_k4PPZVT4N1tJKWrzCaAKcX-BW_8cp3VEEALcSYH-B59d8J2B1OxVZoy8F2qW8lqVKUhSaN"
                />
              </div>
              <div className="hidden lg:block">
                <p className="text-[13px] font-semibold text-espresso leading-tight">
                  {user ? user.fullName : 'Alexander Wright'}
                </p>
                <p className="text-[11px] text-warm-gray leading-tight">Gold Executive</p>
              </div>
              <span className="material-symbols-outlined text-warm-gray text-[16px] hidden lg:block">expand_more</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="mt-[60px] p-6 md:p-8 max-w-[1440px] mx-auto w-full flex-1 animate-fade-in">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex text-warm-gray text-[13px] mb-6">
            <ol className="inline-flex items-center gap-1.5">
              <li className="inline-flex items-center">
                <a className="hover:text-primary transition-colors" href="#" onClick={(e) => {e.preventDefault(); setRoute('dashboard')}}>{t('nav.dashboard')}</a>
              </li>
              {activeMenu !== 'dashboard' && (
                <li>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-espresso font-semibold">
                      {activeMenu === 'business' && t('nav.referralCenter')}
                      {activeMenu === 'wallet' && t('nav.financialWallet')}
                      {activeMenu === 'profile' && t('nav.profileSettings')}
                      {activeMenu === 'knowledge' && t('nav.knowledgeHub')}
                      {activeMenu === 'support' && t('nav.helpDesk')}
                      {activeMenu === 'settings' && t('nav.systemSettings')}
                    </span>
                  </div>
                </li>
              )}
            </ol>
          </nav>

          {/* Conditional rendering of active page */}
          {activeMenu === 'dashboard' && <Dashboard triggerToast={triggerToast} />}
          {activeMenu === 'business' && <MyBusiness triggerToast={triggerToast} />}
          {activeMenu === 'wallet' && <Wallet triggerToast={triggerToast} />}
          {activeMenu === 'profile' && (
            <Profile 
              setRoute={setRoute}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              profileForm={profileForm}
              handleProfileChange={handleProfileChange}
              handleProfileSubmit={handleProfileSubmit}
              bankForm={bankForm}
              handleBankChange={handleBankChange}
              handleBankSubmit={handleBankSubmit}
              planForm={planForm}
              handlePlanChange={handlePlanChange}
              handlePlanSubmit={handlePlanSubmit}
              kycForm={kycForm}
              handleKycChange={handleKycChange}
              handleKycSubmit={handleKycSubmit}
              triggerToast={triggerToast}
            />
          )}
          {activeMenu === 'knowledge' && <KnowledgeCenter triggerToast={triggerToast} />}
          {activeMenu === 'support' && <Support triggerToast={triggerToast} />}
          {activeMenu === 'settings' && (
            <Settings 
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              language={language}
              setLanguage={setLanguage}
              triggerToast={triggerToast}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
