import React, { useState } from 'react';

function Announcements({ triggerToast }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const list = [
    {
      id: 1,
      title: 'Annual Global Convention 2026',
      date: 'July 24, 2026',
      category: 'Event',
      priority: 'High',
      tagColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      badgeColor: 'border-l-blue-600 dark:border-l-blue-500',
      summary: 'Vegas ticket pre-bookings are officially open at early bird pricing for all Diamond rank distributors.',
      body: 'We are thrilled to announce that the MLM Enterprise Annual Global Convention 2026 will be held in Las Vegas, Nevada! Pre-bookings are now officially open. Diamond Directors and above can claim their VIP lounge passes and exclusive early bird tickets at a 40% discount until August 15. Make sure to coordinate with your matching legs downline teams to maximize team presence at the workshops.'
    },
    {
      id: 2,
      title: 'Compliance Rule Updates',
      date: 'July 18, 2026',
      category: 'Policy',
      priority: 'Critical',
      tagColor: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      badgeColor: 'border-l-red-600 dark:border-l-red-500',
      summary: 'Please review the updated network compliance rules under section 4.2 in the Knowledge Center.',
      body: 'In order to support our continued global expansion, we have revised sections 4.2 and 4.3 of our Distributor Code of Ethics. These changes address social media advertising guidelines and pre-approval procedures for recruiting campaigns. Compliance with these terms is mandatory. Failure to comply may lead to temporary commission wallet holds.'
    },
    {
      id: 3,
      title: 'New Level Commission Structures',
      date: 'July 10, 2026',
      category: 'Financial',
      priority: 'Medium',
      tagColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      badgeColor: 'border-l-emerald-600 dark:border-l-emerald-500',
      summary: 'Level 3 and Level 4 matching bonus payouts are being increased by 1.5% starting next cycle.',
      body: 'Effective August 1, 2026, Level 3 indirect commissions and Level 4 matching points matching volume calculation limits will receive a permanent bonus increase of 1.5%. This is designed to support leaders focused on deep team training and downline development. Your ledger sheets will reflect the updated calculation model on next Tuesday payout cycles.'
    },
    {
      id: 4,
      title: 'Vite & Portal Maintenance Schedule',
      date: 'July 05, 2026',
      category: 'System',
      priority: 'Low',
      tagColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      badgeColor: 'border-l-slate-400 dark:border-l-slate-600',
      summary: 'Brief portal maintenance is scheduled for Sunday, July 30, between 02:00 and 04:00 AM EST.',
      body: 'The MLM Enterprise Portal will undergo a planned software upgrade on Sunday, July 30, from 02:00 AM to 04:00 AM EST. During this window, access to the Wallet payout dashboard and downline search logs may be temporarily offline. Payout timers and tracking indices will not be impacted.'
    }
  ];

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Title Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs dark:text-slate-100">Corporate Announcements</h2>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Stay up to date with policy changes, system modifications, rewards, and corporate convention bookings.</p>
      </div>

      {/* Feed List */}
      <div className="space-y-md">
        {list.map(broad => (
          <div 
            key={broad.id} 
            className={`p-lg bg-surface-container-lowest border border-outline-variant dark:bg-slate-900 dark:border-slate-800 rounded-xl border-l-4 ${broad.badgeColor} shadow-xs flex flex-col justify-between gap-md`}
          >
            <div className="flex items-start gap-md">
              <span className="material-symbols-outlined text-[#D97706] text-[28px] shrink-0 mt-xs">campaign</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-md flex-wrap mb-xs">
                  <div className="flex items-center gap-sm flex-wrap">
                    <h4 className="font-bold text-body-md text-on-surface dark:text-slate-100 truncate">{broad.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${broad.tagColor}`}>
                      {broad.category}
                    </span>
                    <span className="text-[10px] font-semibold text-on-surface-variant dark:text-slate-500">
                      Priority: {broad.priority}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant dark:text-slate-500">{broad.date}</span>
                </div>
                <p className="text-body-sm text-on-surface-variant dark:text-slate-350 leading-relaxed mt-sm">
                  {broad.summary}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-sm border-t border-outline-variant/30 dark:border-slate-800/30">
              <button 
                onClick={() => setSelectedItem(broad)}
                className="bg-surface hover:bg-surface-container-low border border-outline-variant dark:bg-slate-850 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 font-body-sm text-body-sm py-xs px-md rounded transition-colors cursor-pointer"
              >
                Read Full Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Dialog Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-md animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl w-full max-w-[560px] overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between dark:border-slate-800">
              <div className="flex items-center gap-sm">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedItem.tagColor}`}>
                  {selectedItem.category}
                </span>
                <span className="text-xs text-on-surface-variant dark:text-slate-400">{selectedItem.date}</span>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-lg space-y-md">
              <h3 className="font-bold text-title-sm text-on-surface dark:text-slate-100">{selectedItem.title}</h3>
              <p className="text-body-sm text-on-surface-variant dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedItem.body}
              </p>
            </div>

            <div className="px-lg py-md bg-surface-container-low border-t border-outline-variant/30 dark:bg-slate-850 dark:border-slate-800/30 flex justify-end">
              <button 
                onClick={() => {
                  setSelectedItem(null);
                  triggerToast("Closed bulletin");
                }}
                className="bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold py-xs px-md rounded transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer"
              >
                Acknowledge Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;
