import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function Support({ triggerToast }) {
  const { t } = useLanguage();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');

  const ticketHistory = [
    { id: 'TKT-8902', category: t('support.payoutsBanking'), subject: 'Dividend payout cycle delay check', date: '2026-07-20', priority: t('support.high'), status: t('support.resolved') },
    { id: 'TKT-8842', category: t('nav.profileSettings'), subject: 'Sponsor link tracking error', date: '2026-07-12', priority: t('support.medium'), status: t('support.closed') }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) {
      triggerToast('Please fill out ticket subject and message details', 'error');
      return;
    }
    triggerToast(`Support ticket opened successfully. Ticket ID: TKT-${Math.floor(1000 + Math.random() * 9000)}!`);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Title Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">{t('support.title')}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{t('support.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Submit Ticket Form */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-md">{t('support.submitHeader')}</h3>
          
          <form onSubmit={handleTicketSubmit} className="space-y-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">{t('support.departmentLabel')}</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                >
                  <option>{t('support.technicalIssue')}</option>
                  <option>{t('support.payoutsBanking')}</option>
                  <option>{t('support.genealogy')}</option>
                  <option>{t('support.productOrders')}</option>
                  <option>{t('support.compliance')}</option>
                </select>
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">{t('support.urgencyLabel')}</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                >
                  <option>{t('support.low')}</option>
                  <option>{t('support.medium')}</option>
                  <option>{t('support.high')}</option>
                  <option>{t('support.critical')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant">{t('support.subjectLabel')}</label>
              <input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('support.subjectPlaceholder')}
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                type="text"
              />
            </div>

            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant">{t('support.descLabel')}</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="6"
                placeholder={t('support.descPlaceholder')}
                className="w-full p-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
              ></textarea>
            </div>

            <div className="flex justify-end gap-md pt-sm">
              <button 
                type="button" 
                onClick={() => {setSubject(''); setMessage(''); triggerToast('Fields cleared', 'info')}}
                className="px-xl py-sm rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
              >
                {t('support.clearFields')}
              </button>
              <button 
                type="submit"
                className="px-xl py-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer"
              >
                {t('support.submitTicket')}
              </button>
            </div>
          </form>
        </div>

        {/* Ticket History */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-fit">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-lg">{t('support.ticketHistory')}</h3>
          
          <div className="space-y-md">
            {ticketHistory.map((tkt, idx) => (
              <div 
                key={idx} 
                onClick={() => triggerToast(`Viewing support logs for ${tkt.id}`)}
                className="p-md bg-surface border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center justify-between gap-md mb-xs">
                  <span className="font-mono-label text-xs font-semibold text-primary">{tkt.id}</span>
                  <span className="inline-block px-sm py-xs rounded-full text-xs font-semibold bg-tertiary/10 text-tertiary">
                    {tkt.status}
                  </span>
                </div>
                <h4 className="font-bold text-body-sm text-on-surface">{tkt.subject}</h4>
                <div className="flex items-center justify-between mt-sm text-xs text-on-surface-variant">
                  <span>{tkt.category}</span>
                  <span>{tkt.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
