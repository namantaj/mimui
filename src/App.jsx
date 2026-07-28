import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MyBusiness from './components/MyBusiness';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import Communication from './components/Communication';
import Announcements from './components/Announcements';
import Articles from './components/Articles';
import KnowledgeCenter from './components/KnowledgeCenter';
import Support from './components/Support';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';

function App() {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'bank', 'kyc'
  const [activeMenu, setActiveMenu] = useState('landing'); // 'landing', 'dashboard', 'business', 'wallet', 'profile', etc.
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const titles = {
      dashboard: 'MLM Enterprise - Dashboard',
      business: 'MLM Enterprise - My Business',
      wallet: 'MLM Enterprise - Wallet',
      profile: 'MLM Enterprise - Self Profile',
      communication: 'MLM Enterprise - Communications',
      announcements: 'MLM Enterprise - Announcements',
      articles: 'MLM Enterprise - Articles',
      knowledge: 'MLM Enterprise - Knowledge Center',
      support: 'MLM Enterprise - Support Desk',
      settings: 'MLM Enterprise - Settings'
    };
    document.title = titles[activeMenu] || 'MLM Enterprise';
  }, [activeMenu]);
  
  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: 'Alexander Wright',
    email: 'alexander.wright@mlmenterprise.com',
    phone: '(555) 123-4567',
    dob: '1985-06-15',
    gender: 'Male',
    street: '1234 Silicon Valley Blvd, Suite 200',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States'
  });

  const [bankForm, setBankForm] = useState({
    bankName: 'Chase Bank',
    accountNumber: '•••• •••• •••• 5678',
    holderName: 'Alexander Wright',
    ifscCode: 'CHASUS33XX',
    accountType: 'Savings'
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

  const handleKycSubmit = (e) => {
    e.preventDefault();
    triggerToast('KYC Documents submitted for verification!');
  };

  // Mock Notifications list
  const notificationsList = [
    { id: 1, text: "New referral joined your team: Sarah Jenkins", time: "5m ago", unread: true },
    { id: 2, text: "Payout of $1,250.00 processed successfully", time: "2h ago", unread: false },
    { id: 3, text: "System maintenance scheduled for tonight at 2 AM EST", time: "1d ago", unread: false }
  ];

  if (activeMenu === 'landing') {
    return (
      <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        {toast.show && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce dark:bg-slate-900 dark:border-slate-800">
            <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-tertiary' : 'text-primary'}`}>
              {toast.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span className="font-semibold text-body-sm">{toast.message}</span>
          </div>
        )}
        <LandingPage 
          onGetStarted={() => {
            setActiveMenu('dashboard');
            triggerToast('Logged in successfully!');
          }} 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased flex transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-md px-lg py-md rounded-lg shadow-xl bg-surface-container-lowest border border-outline-variant animate-bounce dark:bg-slate-900 dark:border-slate-800">
          <span className={`material-symbols-outlined ${toast.type === 'success' ? 'text-tertiary' : 'text-primary'}`}>
            {toast.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span className="font-semibold text-body-sm">{toast.message}</span>
        </div>
      )}

      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col py-lg fixed left-0 top-0 h-full w-sidebar-width bg-surface-container-lowest border-r border-outline-variant shadow-sm z-50 dark:bg-slate-900 dark:border-slate-800">
        <div className="px-lg mb-xl">
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-blue-400">MLM Enterprise</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400 mt-sm">Premium Portal</p>
        </div>
        <nav className="flex-1 px-sm">
          <ul className="space-y-sm">
            {[
              { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
              { id: 'business', icon: 'account_tree', label: 'My Business' },
              { id: 'wallet', icon: 'account_balance_wallet', label: 'Wallet' },
              { id: 'profile', icon: 'person', label: 'Profile', filled: true },
              { id: 'communication', icon: 'mail', label: 'Communication' },
              { id: 'announcements', icon: 'campaign', label: 'Announcements' },
              { id: 'articles', icon: 'article', label: 'Articles' },
              { id: 'knowledge', icon: 'library_books', label: 'Knowledge Center' },
              { id: 'support', icon: 'help_center', label: 'Support' },
              { id: 'settings', icon: 'settings', label: 'Settings' }
            ].map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveMenu(item.id);
                      triggerToast(`Navigated to ${item.label}`);
                    }}
                    className={`w-full flex items-center px-md py-sm rounded transition-all duration-200 ${
                      isActive 
                        ? 'text-primary font-bold border-l-4 border-primary bg-surface-container-low dark:text-blue-400 dark:border-blue-400 dark:bg-slate-800' 
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800'
                    }`}
                    style={isActive ? { transform: 'scale(0.98)' } : undefined}
                  >
                    <span className={`material-symbols-outlined mr-md ${item.filled || isActive ? 'filled-icon' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="font-body-md text-body-md">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-lg mt-auto flex flex-col gap-sm w-full">
          <button 
            onClick={() => triggerToast("Invitation link copied to clipboard!")}
            className="w-full bg-primary-container text-on-primary py-sm rounded-lg font-body-sm text-body-sm font-semibold hover:bg-primary transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer"
          >
            Invite New Member
          </button>
          <button 
            onClick={() => {
              setActiveMenu('landing');
              triggerToast("Logged out successfully");
            }}
            className="w-full border border-outline-variant text-on-surface hover:bg-surface-container-high py-sm rounded-lg font-body-sm text-body-sm font-semibold transition-colors dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[260px] min-h-screen flex flex-col">
        
        {/* TopNavBar */}
        <header className="flex justify-between items-center px-xl w-full z-40 fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface border-b border-outline-variant dark:bg-slate-900 dark:border-slate-800">
          <div className="flex-1 flex items-center">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400">search</span>
              <input 
                className="w-full pl-xl pr-sm py-xs bg-surface-container-lowest border border-outline-variant rounded-full font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" 
                placeholder="Search..." 
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    triggerToast(`Searching for "${e.target.value}"`);
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-lg relative">
            {/* Notification trigger */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowLanguages(false);
                }}
                className="text-on-surface-variant hover:text-primary transition-colors dark:text-slate-400 dark:hover:text-blue-400 flex items-center"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-md w-80 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl py-sm z-50 dark:bg-slate-800 dark:border-slate-700">
                  <div className="px-md py-xs border-b border-outline-variant dark:border-slate-700 font-bold text-body-sm">
                    Notifications
                  </div>
                  <ul className="divide-y divide-outline-variant dark:divide-slate-700">
                    {notificationsList.map(notif => (
                      <li key={notif.id} className="p-md hover:bg-surface-container-low dark:hover:bg-slate-700 cursor-pointer" onClick={() => triggerToast(`Clicked: ${notif.text}`)}>
                        <p className={`font-body-sm text-body-sm ${notif.unread ? 'font-bold' : ''}`}>{notif.text}</p>
                        <span className="text-xs text-on-surface-variant dark:text-slate-400">{notif.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Dark Mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="text-on-surface-variant hover:text-primary transition-colors dark:text-slate-400 dark:hover:text-blue-400 flex items-center"
            >
              <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Translate dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowLanguages(!showLanguages);
                  setShowNotifications(false);
                }}
                className="text-on-surface-variant hover:text-primary transition-colors dark:text-slate-400 dark:hover:text-blue-400 flex items-center"
              >
                <span className="material-symbols-outlined">translate</span>
              </button>

              {showLanguages && (
                <div className="absolute right-0 mt-md w-40 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl py-sm z-50 dark:bg-slate-800 dark:border-slate-700">
                  {['English', 'Spanish', 'French', 'German'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        triggerToast(`Language switched to ${lang}`);
                        setShowLanguages(false);
                      }}
                      className="w-full text-left px-md py-sm hover:bg-surface-container-low dark:hover:bg-slate-700 text-body-sm transition-colors"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div 
              onClick={() => {
                setActiveMenu('profile');
                triggerToast("Viewing Account Settings");
              }}
              className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer hover:ring-2 hover:ring-primary/50 transition-shadow"
            >
              <img 
                alt="User Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOnnsIyGQRXtdKlMlRbEOvUF5XvANm32XMz-jtADr_BM1ygV0rZYMrasrKyye-6D8SZfwOgEAWfSLRLWqhJQdyNTQ6PVGKpE8gRW9rHlDPeDmKt56eA0ei6EVyactjcBja2l0JFTBqR8bvyGPIZH91qWJoGplBRoGyXmXH4bCZchybK_k4PPZVT4N1tJKWrzCaAKcX-BW_8cp3VEEALcSYH-B59d8J2B1OxVZoy8F2qW8lqVKUhSaN"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="mt-16 p-lg md:p-xl max-w-[1440px] mx-auto w-full flex-1 animate-fade-in">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex text-on-surface-variant font-body-sm text-body-sm mb-lg dark:text-slate-400">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a className="hover:text-primary transition-colors dark:hover:text-blue-400" href="#" onClick={(e) => {e.preventDefault(); setActiveMenu('dashboard')}}>Dashboard</a>
              </li>
              {activeMenu !== 'dashboard' && (
                <li>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                    <span className="text-on-surface font-semibold dark:text-slate-200">
                      {activeMenu === 'business' && 'My Business'}
                      {activeMenu === 'wallet' && 'Financial Wallet'}
                      {activeMenu === 'profile' && 'Self Profile'}
                      {activeMenu === 'communication' && 'Communications'}
                      {activeMenu === 'announcements' && 'Announcements'}
                      {activeMenu === 'articles' && 'Articles'}
                      {activeMenu === 'knowledge' && 'Knowledge Center'}
                      {activeMenu === 'support' && 'Support Desk'}
                      {activeMenu === 'settings' && 'Portal Settings'}
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
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              profileForm={profileForm}
              handleProfileChange={handleProfileChange}
              handleProfileSubmit={handleProfileSubmit}
              bankForm={bankForm}
              handleBankChange={handleBankChange}
              handleBankSubmit={handleBankSubmit}
              kycForm={kycForm}
              handleKycChange={handleKycChange}
              handleKycSubmit={handleKycSubmit}
              triggerToast={triggerToast}
            />
          )}
          {activeMenu === 'communication' && <Communication triggerToast={triggerToast} />}
          {activeMenu === 'announcements' && <Announcements triggerToast={triggerToast} />}
          {activeMenu === 'articles' && <Articles triggerToast={triggerToast} />}
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

export default App;
