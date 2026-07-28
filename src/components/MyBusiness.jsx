import React from 'react';

function MyBusiness({ triggerToast }) {
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label} copied to clipboard!`);
  };

  const timelineData = [
    { label: 'Week 1', count: 2, height: '20%' },
    { label: 'Week 2', count: 4, height: '40%' },
    { label: 'Week 3', count: 3, height: '30%' },
    { label: 'Week 4', count: 6, height: '60%' },
    { label: 'Week 5', count: 8, height: '80%' },
    { label: 'Week 6', count: 5, height: '45%' },
    { label: 'Week 7', count: 7, height: '70%' },
    { label: 'Week 8', count: 9, height: '90%' },
  ];

  return (
    <div className="space-y-lg animate-fade-in">

      {/* Header Title */}
      <div className="flex justify-between items-end mb-xl">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-xs dark:text-slate-100">Referral Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Track, share, and manage your network expansion tools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
        {/* Left Column: Primary Actions & Stats */}
        <div className="xl:col-span-2 flex flex-col gap-lg">
          
          {/* Referral Code Card (Bento Style) */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm relative overflow-hidden group dark:bg-slate-900 dark:border-slate-800">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed-dim rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <h3 className="font-title-sm text-title-sm text-on-surface mb-md flex items-center gap-sm dark:text-slate-100">
              <span className="material-symbols-outlined text-primary dark:text-blue-400">link</span>
              Your Unique Invite Links
            </h3>
            
            <div className="space-y-md">
              {/* Code */}
              <div className="bg-surface-container-low rounded-lg p-md flex items-center justify-between border border-outline-variant/50 dark:bg-slate-800 dark:border-slate-700">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 mb-xs">Referral Code</p>
                  <p className="font-mono-label text-mono-label text-primary font-bold text-lg dark:text-blue-400">NEXUS-8892</p>
                </div>
                <button 
                  onClick={() => handleCopy("NEXUS-8892", "Referral Code")}
                  className="h-10 px-md bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-700 dark:text-slate-200 rounded-lg text-on-surface font-body-sm text-body-sm hover:shadow-sm transition-all flex items-center gap-sm hover:-translate-y-[1px]"
                >
                  <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  Copy
                </button>
              </div>

              {/* URL */}
              <div className="bg-surface-container-low rounded-lg p-md flex items-center justify-between border border-outline-variant/50 dark:bg-slate-800 dark:border-slate-700">
                <div className="overflow-hidden pr-md">
                  <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 mb-xs">Referral URL</p>
                  <p className="font-body-sm text-body-sm text-on-surface truncate dark:text-slate-200">nexusmlm.io/join/8892</p>
                </div>
                <button 
                  onClick={() => handleCopy("nexusmlm.io/join/8892", "Referral URL")}
                  className="h-10 px-md bg-primary-container text-on-primary-container rounded-lg font-body-sm text-body-sm hover:opacity-90 transition-all flex items-center gap-sm shadow-sm hover:shadow hover:-translate-y-[1px] shrink-0 dark:bg-blue-600 dark:text-slate-100"
                >
                  <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Social Share */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-md flex items-center gap-sm dark:text-slate-100">
              <span className="material-symbols-outlined text-secondary dark:text-slate-400">share</span>
              Quick Share
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
              <button 
                onClick={() => triggerToast("Sharing to WhatsApp...")}
                className="flex flex-col items-center justify-center p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors group dark:bg-slate-850 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined fill">chat</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface dark:text-slate-300">WhatsApp</span>
              </button>
              <button 
                onClick={() => triggerToast("Sharing to Telegram...")}
                className="flex flex-col items-center justify-center p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors group dark:bg-slate-850 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="w-12 h-12 rounded-full bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined fill">send</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface dark:text-slate-300">Telegram</span>
              </button>
              <button 
                onClick={() => triggerToast("Sharing to Facebook...")}
                className="flex flex-col items-center justify-center p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors group dark:bg-slate-850 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined fill">thumb_up</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface dark:text-slate-300">Facebook</span>
              </button>
              <button 
                onClick={() => triggerToast("Sharing via Email...")}
                className="flex flex-col items-center justify-center p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors group dark:bg-slate-850 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-sm group-hover:scale-110 transition-transform dark:bg-slate-750 dark:text-slate-200">
                  <span className="material-symbols-outlined fill">mail</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface dark:text-slate-300">Email</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-l-4 border-l-primary dark:bg-slate-900 dark:border-slate-800 dark:border-l-blue-500">
              <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 mb-xs">Total Referrals</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface dark:text-slate-100">342</span>
                <span className="font-body-sm text-body-sm text-tertiary flex items-center mb-1 dark:text-green-400 font-semibold">
                  <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> +8%
                </span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-l-4 border-l-[#D97706] dark:bg-slate-900 dark:border-slate-800 dark:border-l-amber-500">
              <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 mb-xs">Successful Joins</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface dark:text-slate-100">47</span>
                <span className="font-body-sm text-body-sm text-tertiary flex items-center mb-1 dark:text-green-400 font-semibold">
                  <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> +4%
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-l-4 border-l-secondary dark:bg-slate-900 dark:border-slate-800 dark:border-l-slate-500">
              <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400 mb-xs">Conversion Rate</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface dark:text-slate-100">13.7%</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400 mb-1">Avg. 11.2%</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-title-sm text-title-sm text-on-surface dark:text-slate-100">Referral Timeline</h3>
              <select className="bg-surface dark:bg-slate-950 border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 font-body-sm text-body-sm rounded-lg py-1 px-3 focus:ring-primary">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            
            <div className="w-full h-64 bg-surface-container-low dark:bg-slate-800 rounded-lg relative overflow-hidden flex items-end justify-between px-md pt-lg pb-sm border border-outline-variant/30 dark:border-slate-700">
              {/* Timeline Bars */}
              {timelineData.map((bar, idx) => (
                <div 
                  key={idx} 
                  className="w-[8%] bg-[#d97706] rounded-t-sm opacity-80 hover:opacity-100 transition-all cursor-pointer relative group"
                  style={{ height: bar.height }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded hidden group-hover:block whitespace-nowrap z-10 dark:bg-slate-900">
                    {bar.count} Joins
                  </div>
                </div>
              ))}
              {/* Grid Lines */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between py-sm">
                <div className="w-full border-t border-outline-variant/20 dark:border-slate-700/20"></div>
                <div className="w-full border-t border-outline-variant/20 dark:border-slate-700/20"></div>
                <div className="w-full border-t border-outline-variant/20 dark:border-slate-700/20"></div>
                <div className="w-full border-t border-outline-variant/20 dark:border-slate-700/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: QR Code Sharing */}
        <div className="xl:col-span-1">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm sticky top-24 dark:bg-slate-900 dark:border-slate-800">
            <div className="text-center mb-lg">
              <h3 className="font-title-sm text-title-sm text-on-surface mb-xs dark:text-slate-100">In-Person Sharing</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400">Let prospects scan to join instantly.</p>
            </div>
            
            <div className="bg-white p-lg rounded-xl border-2 border-dashed border-outline-variant dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center mb-lg relative">
              {/* Mock QR Code */}
              <div className="w-48 h-48 bg-surface-container-high dark:bg-slate-900 rounded flex items-center justify-center overflow-hidden">
                <img 
                  className="w-full h-full object-cover opacity-80" 
                  alt="A clean, functional corporate QR code" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4TSVMQKczcenOUAqfgxZEJZCNJwcTD80RQMNR6cZkQJapL2BbA0pI6wLRO1JZ4au-BDyXlOLQbUfNLdof717na1sPORmEFCLskh98pOMkDoplK5JKGfAGohL-e_nuelS_ePU1NgRQPiH849vHnWLJEXJlNMdL0cAhGQMhPq_7P6M1GWkJwTseovi19djQaDbIcsAScJs-I0NSH3vwD6ePXoxM1VZ_T9_Og38ghk1Bf9LsEa1QyHle" 
                />
              </div>
              {/* Overlay Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-lg shadow-sm flex items-center justify-center border border-outline-variant dark:border-slate-700 p-1">
                  <span className="material-symbols-outlined text-primary dark:text-blue-400 fill">corporate_fare</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <button 
                onClick={() => triggerToast("Downloading QR Code flyer...")}
                className="w-full bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-700 dark:text-slate-200 text-on-surface font-title-sm text-body-sm py-sm rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Download QR Code
              </button>
              <button 
                onClick={() => triggerToast("Sending flyer sheet to printer...")}
                className="w-full bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-700 dark:text-slate-200 text-on-surface font-title-sm text-body-sm py-sm rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                Print Flyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBusiness;
