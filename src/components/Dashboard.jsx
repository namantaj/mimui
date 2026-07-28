import React from 'react';

function Dashboard({ triggerToast }) {
  const stats = [
    { title: 'Total Earnings', value: '$45,250.00', change: '+12.5%', icon: 'payments', gradient: 'from-blue-600 to-indigo-600', color: 'text-blue-600' },
    { title: 'Monthly Sales', value: '$12,480.00', change: '+8.3%', icon: 'trending_up', gradient: 'from-emerald-600 to-teal-600', color: 'text-emerald-600' },
    { title: 'Active Referrals', value: '42', change: '+2 new', icon: 'group', gradient: 'from-violet-600 to-purple-600', color: 'text-violet-600' },
    { title: 'Team PV (Point Volume)', value: '38,400 PV', change: '+4,200 this week', icon: 'analytics', gradient: 'from-amber-600 to-orange-600', color: 'text-amber-600' },
  ];

  const topPerformers = [
    { name: 'Sarah Jenkins', sales: '$8,400.00', recruits: 7, rank: 'Ruby Director', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOnnsIyGQRXtdKlMlRbEOvUF5XvANm32XMz-jtADr_BM1ygV0rZYMrasrKyye-6D8SZfwOgEAWfSLRLWqhJQdyNTQ6PVGKpE8gRW9rHlDPeDmKt56eA0ei6EVyactjcBja2l0JFTBqR8bvyGPIZH91qWJoGplBRoGyXmXH4bCZchybK_k4PPZVT4N1tJKWrzCaAKcX-BW_8cp3VEEALcSYH-B59d8J2B1OxVZoy8F2qW8lqVKUhSaN' },
    { name: 'Michael Chang', sales: '$6,250.00', recruits: 5, rank: 'Emerald Leader', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe8oLmHDjQpBARIImVqHvbh-ono3iANmz82cN0HNIuMXp_uoyQ4ZIMNgWKt7U_gmgBcHnpsD9jOWfUuIIImIe_pzvTcDRcnmD2mUVk1twt8IvTMuNcV5CFoI61OZD5GEex2j1ycgdYeilCQ4ijjf1zAaULdttqOMrA3GCWb530NxxxkuKOMLU7dQf06irnQ0yH_Me8dAKADm-VLwOcU91AquzmvS_DdBPe3QK_9BC7ctdtEU_Xxje9' },
    { name: 'Elena Rostova', sales: '$5,900.00', recruits: 4, rank: 'Gold Executive', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMj-Gtz7xvOs0APxExRvyWq7M1Sv0uUdjFAEydJ06AULapwmBCb9Fq6oSUg9gg-VZY9J60nKcdZzTnFnCpIEp8HKTzkL73ZhBgySVlvKTorP1k6VqFee0lecUzmS0UfLPyLCHkxfXXhKs8mruJ_r09mfye2ML73CDTt20hsu1kwru1hGG9a56lNiahIpwUDoXAMah-L7B4rS1Z1FK4Dc0sq07Q-7mUtlAnxj74JtmJOFCxfcrLiPWD' },
  ];

  const recentActivity = [
    { text: 'Sarah Jenkins joined your direct downline team.', time: '5 mins ago', type: 'recruitment', icon: 'person_add' },
    { text: 'Matching commission payment of $320.00 credited.', time: '2 hours ago', type: 'financial', icon: 'account_balance_wallet' },
    { text: 'Rank bonus payout of $1,000.00 processed for Diamond Director.', time: '1 day ago', type: 'bonus', icon: 'military_tech' },
    { text: 'System Update: New Knowledge Center materials uploaded.', time: '2 days ago', type: 'system', icon: 'info' },
  ];

  return (
    <div className="space-y-lg">
      {/* Title Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs dark:text-slate-100">Executive Dashboard</h2>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Welcome back, Alexander! Here is your business performance snapshot.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow relative overflow-hidden dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="space-y-sm relative z-10">
              <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">{stat.title}</p>
              <h3 className="font-title-sm text-title-sm text-on-surface font-bold text-2xl dark:text-slate-100">{stat.value}</h3>
              <p className="text-body-sm font-semibold text-tertiary flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                {stat.change}
              </p>
            </div>
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${stat.gradient} text-white flex items-center justify-center shadow-md shrink-0`}>
              <span className="material-symbols-outlined text-xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rank Progress & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Rank Progress Card */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-md flex items-center gap-sm dark:text-slate-100">
            <span className="material-symbols-outlined text-primary dark:text-blue-400">military_tech</span>
            Rank Progress: Diamond Director
          </h3>
          
          <div className="space-y-lg">
            <div className="flex justify-between items-center text-body-sm">
              <span className="font-semibold text-on-surface dark:text-slate-200">Next Rank: Blue Diamond</span>
              <span className="font-bold text-primary dark:text-blue-400">76% Completed</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-surface-container border border-outline-variant/30 rounded-full h-3 overflow-hidden dark:bg-slate-800">
              <div className="bg-primary h-full rounded-full transition-all duration-1000 dark:bg-blue-500" style={{ width: '76%' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-body-sm pt-sm border-t border-outline-variant/50 dark:border-slate-800">
              <div>
                <p className="text-on-surface-variant dark:text-slate-400 mb-xs">Direct Active Referrals</p>
                <div className="flex items-center gap-xs font-semibold text-on-surface dark:text-slate-200">
                  <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                  12 / 10 required
                </div>
              </div>
              <div>
                <p className="text-on-surface-variant dark:text-slate-400 mb-xs">Group PV Requirement</p>
                <div className="flex items-center gap-xs font-semibold text-on-surface dark:text-slate-200">
                  <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                  38.4K / 50K PV
                </div>
              </div>
              <div>
                <p className="text-on-surface-variant dark:text-slate-400 mb-xs">Matching Leg Volume</p>
                <div className="flex items-center gap-xs font-semibold text-[#D97706]">
                  <span className="material-symbols-outlined text-sm">pending</span>
                  18K / 25K PV
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Share / Invite link */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
          <div>
            <h3 className="font-title-sm text-title-sm text-on-surface mb-xs dark:text-slate-100">Spread Your Network</h3>
            <p className="text-body-sm text-on-surface-variant dark:text-slate-400">Share your invite link to build your team and unlock matching leg rewards.</p>
          </div>
          
          <div className="space-y-sm my-md">
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-lg p-sm flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
              <span className="text-body-sm text-on-surface truncate pr-xs dark:text-slate-200">mlmenterprise.io/join/alex847</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("mlmenterprise.io/join/alex847");
                  triggerToast("Referral URL copied to clipboard!");
                }}
                className="bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm py-xs px-sm rounded shadow-sm transition-colors shrink-0 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <button 
              onClick={() => triggerToast("Direct Invitation email sent")}
              className="bg-white border border-outline-variant text-on-surface py-sm rounded-lg font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Email Invite
            </button>
            <button 
              onClick={() => triggerToast("QR Code code window opened")}
              className="bg-white border border-outline-variant text-on-surface py-sm rounded-lg font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Show QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard & Recent Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Top Performers */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-md flex items-center gap-sm dark:text-slate-100">
            <span className="material-symbols-outlined text-[#D97706]">stars</span>
            Top Direct Downline Performers
          </h3>
          <div className="divide-y divide-outline-variant dark:divide-slate-800">
            {topPerformers.map((performer, idx) => (
              <div key={idx} className="flex items-center justify-between py-md first:pt-0 last:pb-0">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0">
                    <img alt={performer.name} className="w-full h-full object-cover" src={performer.avatar} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-body-md text-on-surface dark:text-slate-100">{performer.name}</h4>
                    <p className="text-body-sm text-on-surface-variant dark:text-slate-400">{performer.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-body-md text-primary dark:text-blue-400">{performer.sales}</p>
                  <p className="text-body-sm text-on-surface-variant dark:text-slate-400">{performer.recruits} recruits</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity logs */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-md flex items-center gap-sm dark:text-slate-100">
            <span className="material-symbols-outlined text-secondary dark:text-slate-400">history</span>
            Recent Operations Log
          </h3>
          <div className="space-y-md">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-md">
                <div className="mt-xs h-8 w-8 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center shrink-0 dark:bg-slate-850 dark:border-slate-700">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant dark:text-slate-400">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-body-sm text-on-surface dark:text-slate-200">{activity.text}</p>
                  <span className="text-xs text-on-surface-variant dark:text-slate-500">{activity.time}</span>
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
