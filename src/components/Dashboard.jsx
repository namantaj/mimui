import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Dashboard({ triggerToast }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const displayName = user ? user.fullName.split(' ')[0] : 'Partner';

  const stats = [
    { title: t('dashboard.totalEarnings'), value: '$45,250.00', change: '+12.5%', icon: 'payments', iconColor: 'text-primary', iconBg: 'bg-primary/8' },
    { title: t('dashboard.monthlyDividends'), value: '$12,480.00', change: '+8.3%', icon: 'trending_up', iconColor: 'text-gold', iconBg: 'bg-gold/8' },
    { title: t('dashboard.activeReferrals'), value: '42', change: '+2 new', icon: 'group', iconColor: 'text-primary', iconBg: 'bg-primary/8' },
    { title: t('dashboard.sponsorLegVolume'), value: '38,400 PV', change: '+4,200 this week', icon: 'analytics', iconColor: 'text-gold', iconBg: 'bg-gold/8' },
  ];

  const topPerformers = [
    { name: 'Sarah Jenkins', sales: '$8,400.00', recruits: 7, rank: 'Ruby Director Partner', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOnnsIyGQRXtdKlMlRbEOvUF5XvANm32XMz-jtADr_BM1ygV0rZYMrasrKyye-6D8SZfwOgEAWfSLRLWqhJQdyNTQ6PVGKpE8gRW9rHlDPeDmKt56eA0ei6EVyactjcBja2l0JFTBqR8bvyGPIZH91qWJoGplBRoGyXmXH4bCZchybK_k4PPZVT4N1tJKWrzCaAKcX-BW_8cp3VEEALcSYH-B59d8J2B1OxVZoy8F2qW8lqVKUhSaN' },
    { name: 'Michael Chang', sales: '$6,250.00', recruits: 5, rank: 'Emerald Portfolio Leader', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe8oLmHDjQpBARIImVqHvbh-ono3iANmz82cN0HNIuMXp_uoyQ4ZIMNgWKt7U_gmgBcHnpsD9jOWfUuIIImIe_pzvTcDRcnmD2mUVk1twt8IvTMuNcV5CFoI61OZD5GEex2j1ycgdYeilCQ4ijjf1zAaULdttqOMrA3GCWb530NxxxkuKOMLU7dQf06irnQ0yH_Me8dAKADm-VLwOcU91AquzmvS_DdBPe3QK_9BC7ctdtEU_Xxje9' },
    { name: 'Elena Rostova', sales: '$5,900.00', recruits: 4, rank: 'Gold Executive Partner', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMj-Gtz7xvOs0APxExRvyWq7M1Sv0uUdjFAEydJ06AULapwmBCb9Fq6oSUg9gg-VZY9J60nKcdZzTnFnCpIEp8HKTzkL73ZhBgySVlvKTorP1k6VqFee0lecUzmS0UfLPyLCHkxfXXhKs8mruJ_r09mfye2ML73CDTt20hsu1kwru1hGG9a56lNiahIpwUDoXAMah-L7B4rS1Z1FK4Dc0sq07Q-7mUtlAnxj74JtmJOFCxfcrLiPWD' },
  ];

  const recentActivity = [
    { text: 'Sarah Jenkins joined your sponsor downline.', time: '5 mins ago', icon: 'person_add' },
    { text: 'Leg matching commission of $320.00 credited to ledger.', time: '2 hours ago', icon: 'account_balance_wallet' },
    { text: 'Rank promotion bonus processed for Gold Executive Partner.', time: '1 day ago', icon: 'military_tech' },
    { text: 'Compliance update: New compliance toolkit published.', time: '2 days ago', icon: 'info' },
  ];

  return (
    <div className="space-y-6">

      {/* Title Header */}
      <div className="mb-2">
        <h2 className="text-[28px] font-bold text-espresso tracking-tight leading-tight">
          {t('dashboard.title')}
        </h2>
        <p className="text-[15px] text-warm-gray mt-1.5">
          {t('dashboard.welcomeMsg', { name: displayName })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-cream border border-sand rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 flex items-start justify-between group"
          >
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-gray">{stat.title}</p>
              <h3 className="text-[22px] font-bold text-espresso tracking-tight leading-none">{stat.value}</h3>
              <p className="text-[12px] font-semibold text-forest flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {stat.change}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
              <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rank Progress & Referral Network */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Rank Progress Card */}
        <div className="lg:col-span-2 bg-cream border border-sand rounded-2xl p-6 shadow-card">
          
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">military_tech</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-espresso leading-tight">{t('dashboard.rankStanding')}: {t('dashboard.goldExecutive')}</h3>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-warm-gray">{t('dashboard.nextMilestone')}: <span className="font-semibold text-espresso">{t('dashboard.diamondDirector')}</span></span>
              <span className="text-[13px] font-bold text-primary">76% {t('dashboard.completed')}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-ivory rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '76%' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-sand/60">
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-gray">{t('dashboard.directReferralsReq')}</p>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-espresso">
                  <span className="material-symbols-outlined text-forest text-[16px]">check_circle</span>
                  12 / 10 required
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-gray">{t('dashboard.groupPvReq')}</p>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-espresso">
                  <span className="material-symbols-outlined text-forest text-[16px]">check_circle</span>
                  38.4K / 50K PV
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-gray">{t('dashboard.matchingVolumeReq')}</p>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gold">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  18K / 25K PV
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Network Card */}
        <div className="bg-cream border border-sand rounded-2xl p-6 shadow-card flex flex-col">
          
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/8 flex items-center justify-center">
              <span className="material-symbols-outlined text-gold text-[18px]">hub</span>
            </div>
            <h3 className="text-[15px] font-bold text-espresso leading-tight">{t('dashboard.secureNetworkTitle')}</h3>
          </div>

          <p className="text-[13px] text-warm-gray leading-relaxed mb-5">
            {t('dashboard.secureNetworkDesc')}
          </p>
          
          {/* Referral URL field */}
          <div className="bg-bone border border-sand rounded-lg p-3 flex items-center justify-between mb-4">
            <span className="text-[13px] text-espresso truncate pr-2 font-medium">bhagwnsolutions.io/join/{user ? user.referralCode : 'REF1001'}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`bhagwnsolutions.io/join/${user ? user.referralCode : 'REF1001'}`);
                triggerToast("Sponsor URL copied to clipboard!");
              }}
              className="bg-primary hover:bg-[#641722] text-on-primary text-[12px] font-semibold py-1.5 px-3.5 rounded-md shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              {t('common.copy')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-auto">
            <button 
              onClick={() => triggerToast("Email invitation template dispatched")}
              className="bg-bone border border-sand text-espresso h-9 rounded-lg text-[12px] font-semibold hover:bg-ivory transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              {t('dashboard.emailInvite')}
            </button>
            <button 
              onClick={() => triggerToast("QR Code window expanded")}
              className="bg-bone border border-sand text-espresso h-9 rounded-lg text-[12px] font-semibold hover:bg-ivory transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
              {t('dashboard.showQrCode')}
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top Partners */}
        <div className="bg-cream border border-sand rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold/8 flex items-center justify-center">
                <span className="material-symbols-outlined text-gold text-[18px]">stars</span>
              </div>
              <h3 className="text-[15px] font-bold text-espresso">Top Direct Downline Partners</h3>
            </div>
            <button 
              onClick={() => triggerToast("Viewing full partner directory")}
              className="text-[12px] font-semibold text-primary hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-sand/60">
            {topPerformers.map((performer, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-sand shrink-0">
                    <img alt={performer.name} className="w-full h-full object-cover" src={performer.avatar} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-espresso">{performer.name}</h4>
                    <p className="text-[11px] text-warm-gray">{performer.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-primary">{performer.sales}</p>
                  <p className="text-[11px] text-warm-gray">{performer.recruits} partners</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-cream border border-sand rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">history</span>
              </div>
              <h3 className="text-[15px] font-bold text-espresso">Recent Operations Log</h3>
            </div>
            <button 
              onClick={() => triggerToast("Viewing full activity log")}
              className="text-[12px] font-semibold text-primary hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-0">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className={`flex items-start gap-3 py-3.5 ${idx < recentActivity.length - 1 ? 'border-b border-sand/50' : ''}`}>
                <div className="mt-0.5 h-8 w-8 rounded-lg bg-bone border border-sand/50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-warm-gray">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-espresso leading-snug">{activity.text}</p>
                  <span className="text-[11px] text-warm-gray mt-0.5 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
