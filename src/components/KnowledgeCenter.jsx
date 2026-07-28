import React, { useState } from 'react';

function KnowledgeCenter({ triggerToast }) {
  const [openFaq, setOpenFaq] = useState(null);

  const materials = [
    { title: 'Corporate Pitch Deck 2026', size: '12.4 MB', format: 'PDF', icon: 'present_to_all', desc: 'Sleek presentation slides detailing corporate values, products, and vision.' },
    { title: 'Global Compensation Plan v4', size: '4.8 MB', format: 'PDF', icon: 'menu_book', desc: 'Detailed documentation of matching commissions, levels, and rank limits.' },
    { title: 'Social Media Recruiting Toolkit', size: '22.1 MB', format: 'ZIP', icon: 'photo_library', desc: 'Pre-approved high-quality image banners, stories, and template scripts.' },
    { title: 'Distributor Compliance Handbook', size: '2.5 MB', format: 'PDF', icon: 'gavel', desc: 'Regulatory code of ethics and guidelines for organizational expansion.' }
  ];

  const faqs = [
    { q: 'How are binary point volumes (PV) calculated?', a: 'Every direct or indirect purchase within your downline carries a point volume value. Purchases made on your Left placement leg contribute to your Left Leg Volume, while purchases on the Right placement leg contribute to your Right Leg Volume.' },
    { q: 'When are commission payouts released?', a: 'Direct referral commissions are credited to your Available Wallet Balance instantly. Binary leg matching commissions are calculated weekly on Sunday at 23:59 EST and processed on the following Tuesday.' },
    { q: 'What happens if a direct referral goes inactive?', a: 'An inactive member does not contribute point volume (PV) for active matching rewards, and their direct sponsor bonus is suspended until they make a qualifying maintenance order of at least 50 PV.' },
    { q: 'How do I request rank promotion certificates?', a: 'Once the system automatically promotes your account status (e.g. Diamond Director), you can head to the Communications tab to submit a direct ticket request to corporate admin.' }
  ];

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Title Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs dark:text-slate-100">Knowledge & Learning Center</h2>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Access marketing templates, download official corporate documents, and resolve FAQs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Resources Grid */}
        <div className="lg:col-span-2 space-y-md">
          <h3 className="font-title-sm text-title-sm text-on-surface dark:text-slate-100">Official Marketing & Training Media</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {materials.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800"
              >
                <div>
                  <div className="h-10 w-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-md dark:bg-slate-800 dark:text-blue-400">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <h4 className="font-bold text-body-md text-on-surface dark:text-slate-100">{item.title}</h4>
                  <p className="text-body-sm text-on-surface-variant dark:text-slate-400 mt-xs leading-relaxed">{item.desc}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-outline-variant/50 pt-md mt-lg dark:border-slate-800">
                  <span className="text-xs text-on-surface-variant dark:text-slate-500 font-semibold">{item.format} • {item.size}</span>
                  <button 
                    onClick={() => triggerToast(`Downloading: ${item.title}`)}
                    className="bg-surface hover:bg-surface-container border border-outline-variant font-body-sm text-body-sm py-xs px-md rounded transition-colors flex items-center gap-xs dark:bg-slate-850 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-fit dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-lg dark:text-slate-100">Frequently Asked Questions</h3>
          
          <div className="space-y-sm">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-outline-variant rounded-lg overflow-hidden dark:border-slate-800"
                >
                  <button 
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-md py-sm bg-surface-container-low flex justify-between items-center font-bold text-body-sm text-on-surface hover:bg-surface-container-high transition-colors dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-200"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-sm transform transition-transform duration-200" style={isOpen ? { transform: 'rotate(180deg)' } : undefined}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-md bg-white text-body-sm text-on-surface-variant dark:bg-slate-900 dark:text-slate-350 border-t border-outline-variant/30 dark:border-slate-800 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeCenter;
