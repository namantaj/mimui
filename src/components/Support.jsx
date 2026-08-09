import React, { useState } from 'react';

function Support({ triggerToast }) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');

  const ticketHistory = [
    { id: 'TKT-8902', category: 'Payouts & Banking', subject: 'Dividend payout cycle delay check', date: '2026-07-20', priority: 'High', status: 'Resolved' },
    { id: 'TKT-8842', category: 'Account Settings', subject: 'Sponsor link tracking error', date: '2026-07-12', priority: 'Medium', status: 'Closed' }
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
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">Help Desk & Support</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Submit requests directly to our compliance, financial, or system administration staff.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Submit Ticket Form */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-md">Submit a Help Request</h3>
          
          <form onSubmit={handleTicketSubmit} className="space-y-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">Department / Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                >
                  <option>Technical Issue</option>
                  <option>Payouts & Banking</option>
                  <option>Genealogy & Placements</option>
                  <option>Product & Orders</option>
                  <option>Compliance & Ethics</option>
                </select>
              </div>

              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">Urgency Level</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Request Subject</label>
              <input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue..."
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                type="text"
              />
            </div>

            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Detailed Description</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="6"
                placeholder="Please describe your issue in detail. Add partner details or transaction reference codes if applicable."
                className="w-full p-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
              ></textarea>
            </div>

            <div className="flex justify-end gap-md pt-sm">
              <button 
                type="button" 
                onClick={() => {setSubject(''); setMessage(''); triggerToast('Fields cleared', 'info')}}
                className="px-xl py-sm rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
              >
                Clear Fields
              </button>
              <button 
                type="submit"
                className="px-xl py-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>

        {/* Ticket History */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-fit">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-lg">My Ticket History</h3>
          
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
