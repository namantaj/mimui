import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function MyBusiness({ triggerToast }) {
  const { user } = useAuth();
  const { t } = useLanguage();
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
          <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">{t('business.title')}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{t('business.subtitle')}</p>
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
              {t('business.activeLinks')}
            </h3>
            
            <div className="space-y-md">
              {/* Code */}
              <div className="bg-surface-container-low rounded-lg p-md flex items-center justify-between border border-outline-variant/50">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('business.referralCode')}</p>
                  <p className="font-mono-label text-primary font-bold text-lg">{refCode}</p>
                </div>
                <button 
                  onClick={() => handleCopy(refCode, t('business.referralCode'))}
                  className="h-10 px-md bg-surface border border-outline-variant rounded-lg text-on-surface font-body-sm text-body-sm hover:shadow-sm transition-all flex items-center gap-sm hover:-translate-y-[1px] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  {t('business.copyCode')}
                </button>
              </div>

              {/* URL */}
              <div className="bg-surface-container-low rounded-lg p-md flex items-center justify-between border border-outline-variant/50">
                <div className="overflow-hidden pr-md">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('business.invitationLink')}</p>
                  <p className="font-body-sm text-body-sm text-on-surface truncate">{refUrl}</p>
                </div>
                <button 
                  onClick={() => handleCopy(refUrl, t('business.invitationLink'))}
                  className="h-10 px-md bg-primary text-on-primary rounded-lg font-body-sm text-body-sm hover:opacity-95 transition-all flex items-center gap-sm shadow-sm hover:-translate-y-[1px] shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  {t('business.copyUrl')}
                </button>
              </div>
            </div>
          </div>

          {/* Social Share */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <h3 className="font-title-sm text-title-sm text-on-surface mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">share</span>
              {t('business.quickSharing')}
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
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('business.totalReferrals')}</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface">342</span>
                <span className="font-body-sm text-body-sm text-tertiary flex items-center mb-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> +8%
                </span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-l-4 border-l-gold">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('business.successfulJoins')}</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface">47</span>
                <span className="font-body-sm text-body-sm text-tertiary flex items-center mb-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span> +4%
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-l-4 border-l-secondary">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{t('business.conversionRate')}</p>
              <div className="flex items-end gap-sm">
                <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface">13.7%</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">{t('business.avg')}</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-title-sm text-title-sm text-on-surface">{t('business.timelineTitle')}</h3>
              <select className="bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm rounded-lg py-1 px-3 focus:outline-none focus:ring-1 focus:ring-primary/20">
                <option>{t('business.last30')}</option>
                <option>{t('business.last90')}</option>
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
                    {bar.count} {t('business.joins')}
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
              <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">{t('business.qrTitle')}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{t('business.qrSubtitle')}</p>
            </div>
            
            {/* Mock QR graphic */}
            <div className="w-48 h-48 mx-auto bg-surface border border-outline-variant rounded-xl p-md flex items-center justify-center mb-lg shadow-inner">
              <div className="w-full h-full border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center p-2">
                <svg className="w-full h-full text-on-surface" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2,2H10V10H2V2M4,4V8H8V4H4M11,2H13V4H11V2M14,2H22V10H14V2M16,4V8H20V4H16M2,14H10V22H2V14M4,16V20H8V16H4M14,14H16V16H14V14M18,14H20V16H18V14M20,16H22V18H20V16M16,18H18V20H16V18M18,20H20V22H18V20M20,20H22V22H20V20M14,20H16V22H14V20M11,14H13V18H11V14M11,20H13V22H11V20Z" />
                </svg>
              </div>
            </div>

            <div className="space-y-sm">
              <button 
                onClick={() => triggerToast("Downloading Partner Invitation QR Code PNG...")}
                className="w-full bg-surface hover:bg-surface-container-low border border-outline-variant text-on-surface font-body-sm text-body-sm py-sm rounded-lg transition-colors flex items-center justify-center gap-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                {t('business.downloadQr')}
              </button>

              <button 
                onClick={() => triggerToast("Preparing printable partner recruitment flyer PDF...")}
                className="w-full bg-surface hover:bg-surface-container-low border border-outline-variant text-on-surface font-body-sm text-body-sm py-sm rounded-lg transition-colors flex items-center justify-center gap-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                {t('business.printFlyer')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBusiness;
