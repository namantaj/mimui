import React from 'react';
import { useAuth } from '../context/AuthContext';

function MyBusiness({ triggerToast }) {
  const { user } = useAuth();
  const refCode = user ? user.referralCode : 'REF1001';
  const refUrl = `bhagwnsolutions.io/join/${refCode}`;

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
          <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">Partner Referral Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Track, monitor, and copy your sponsor leg invitation codes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
        {/* Left Column: Primary Actions & Stats */}
        <div className="xl:col-span-2 flex flex-col gap-lg">
          
          {/* Referral Code Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl transition-opacity"></div>
            <h3 className="font-title-sm text-title-sm text-on-surface mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">link</span>
              Your Active Sponsor Invitation Links
            </h3>
            
            <div className="space-y-md">
              {/* Code */}
              <div className="bg-surface-container-low rounded-lg p-md flex items-center justify-between border border-outline-variant/50">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Sponsor Referral Code</p>
                  <p className="font-mono-label text-primary font-bold text-lg">{refCode}</p>
                </div>
                <button 
                  onClick={() => handleCopy(refCode, "Referral Code")}
                  className="h-10 px-md bg-surface border border-outline-variant rounded-lg text-on-surface font-body-sm text-body-sm hover:shadow-sm transition-all flex items-center gap-sm hover:-translate-y-[1px] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  Copy Code
                </button>
              </div>

              {/* URL */}
              <div className="bg-surface-container-low rounded-lg p-md flex items-center justify-between border border-outline-variant/50">
                <div className="overflow-hidden pr-md">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Invitation Link</p>
                  <p className="font-body-sm text-body-sm text-on-surface truncate">{refUrl}</p>
                </div>
                <button 
                  onClick={() => handleCopy(refUrl, "Referral URL")}
                  className="h-10 px-md bg-primary text-on-primary rounded-lg font-body-sm text-body-sm hover:opacity-95 transition-all flex items-center gap-sm shadow-sm hover:-translate-y-[1px] shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  Copy Link URL
                </button>
              </div>
            </div>
          </div>

          {/* Social Share */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">share</span>
              Quick Network Sharing
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
              <button 
                onClick={() => triggerToast("Sharing link to WhatsApp...")}
                className="flex flex-col items-center justify-center p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center mb-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface">WhatsApp</span>
              </button>
              <button 
                onClick={() => triggerToast("Sharing link to Telegram...")}
                className="flex flex-col items-center justify-center p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">send</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface">Telegram</span>
              </button>
              <button 
                onClick={() => triggerToast("Sharing link to Facebook...")}
                className="flex flex-col items-center justify-center p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">thumb_up</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface">Facebook</span>
              </button>
              <button 
                onClick={() => triggerToast("Sharing via System Email...")}
                className="flex flex-col items-center justify-center p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface">Email</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-l-4 border-l-primary">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Total Referrals</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface">342</span>
                <span className="font-body-sm text-body-sm text-tertiary flex items-center mb-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> +8%
                </span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-l-4 border-l-gold">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Successful Joins</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface">47</span>
                <span className="font-body-sm text-body-sm text-tertiary flex items-center mb-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> +4%
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-l-4 border-l-secondary">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Leg Conversion Rate</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface">13.7%</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">Avg. 11.2%</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-title-sm text-title-sm text-on-surface">Referral Registration Timeline</h3>
              <select className="bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg py-1 px-3 focus:outline-none focus:ring-1 focus:ring-primary/20">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            
            <div className="w-full h-64 bg-surface-container-low rounded-lg relative overflow-hidden flex items-end justify-between px-md pt-lg pb-sm border border-outline-variant/30">
              {/* Timeline Bars - Gold Accent columns */}
              {timelineData.map((bar, idx) => (
                <div 
                  key={idx} 
                  className="w-[8%] bg-gold rounded-t-sm opacity-85 hover:opacity-100 transition-all cursor-pointer relative group"
                  style={{ height: bar.height }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded hidden group-hover:block whitespace-nowrap z-10">
                    {bar.count} Joins
                  </div>
                </div>
              ))}
              {/* Grid Lines */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between py-sm">
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: QR Code Sharing */}
        <div className="xl:col-span-1">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm sticky top-24">
            <div className="text-center mb-lg">
              <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">In-Person QR Code</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Let prospects scan to join your sponsor network directly.</p>
            </div>
            
            <div className="bg-surface p-lg rounded-xl border border-outline-variant/80 flex items-center justify-center mb-lg relative">
              {/* Mock QR Code */}
              <div className="w-48 h-48 bg-surface-container-high rounded flex items-center justify-center overflow-hidden border border-outline-variant/40">
                <img 
                  className="w-full h-full object-cover opacity-80" 
                  alt="A clean, functional corporate QR code" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4TSVMQKczcenOUAqfgxZEJZCNJwcTD80RQMNR6cZkQJapL2BbA0pI6wLRO1JZ4au-BDyXlOLQbUfNLdof717na1sPORmEFCLskh98pOMkDoplK5JKGfAGohL-e_nuelS_ePU1NgRQPiH849vHnWLJEXJlNMdL0cAhGQMhPq_7P6M1GWkJwTseovi19djQaDbIcsAScJs-I0NSH3vwD6ePXoxM1VZ_T9_Og38ghk1Bf9LsEa1QyHle" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <button 
                onClick={() => triggerToast("Downloading QR flyer...")}
                className="w-full bg-surface border border-outline-variant text-on-surface font-title-sm text-body-sm py-sm rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Download QR Code
              </button>
              <button 
                onClick={() => triggerToast("Flyer document sheet sent to printer...")}
                className="w-full bg-surface border border-outline-variant text-on-surface font-title-sm text-body-sm py-sm rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                Print Partner Flyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBusiness;
