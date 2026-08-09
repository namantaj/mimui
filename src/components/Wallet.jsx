import React, { useState } from 'react';

function Wallet({ triggerToast }) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('Bank Transfer');
  const [searchTerm, setSearchTerm] = useState('');

  const balances = [
    { title: 'Available Wallet Balance', value: '$12,450.00', detail: 'Ready for withdrawal request', icon: 'account_balance_wallet', color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Ledger Balance', value: '$14,200.00', detail: 'Pending cycle confirmation', icon: 'pending_actions', color: 'text-gold', bg: 'bg-gold/10' },
    { title: 'Total Payouts Released', value: '$32,800.00', detail: 'Processed since account activation', icon: 'paid', color: 'text-tertiary', bg: 'bg-tertiary/10' }
  ];

  const transactions = [
    { id: 'TXN-1094', description: 'Sponsor Referral Commission - Sarah Jenkins', date: '2026-07-28', type: 'Commission', amount: '+$840.00', status: 'Completed' },
    { id: 'TXN-1093', description: 'Monthly Binary Leg Matching Reward', date: '2026-07-25', type: 'Matching Dividend', amount: '+$1,200.00', status: 'Completed' },
    { id: 'TXN-1087', description: 'Wallet Payout Cash Withdrawal Request', date: '2026-07-15', type: 'Withdrawal', amount: '-$1,500.00', status: 'Completed' },
    { id: 'TXN-1081', description: 'Level 2 Indirect Placement Commission - Emily Watson', date: '2026-07-10', type: 'Commission', amount: '+$380.00', status: 'Completed' },
    { id: 'TXN-1075', description: 'Executive Diamond Milestone Incentive Bonus', date: '2026-07-01', type: 'Rank Payout', amount: '+$2,500.00', status: 'Completed' },
    { id: 'TXN-1064', description: 'Wallet Payout Cash Withdrawal Request', date: '2026-06-15', type: 'Withdrawal', amount: '-$2,000.00', status: 'Completed' }
  ];

  const filteredTransactions = transactions.filter(txn =>
    txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
      triggerToast('Please enter a valid withdrawal amount', 'error');
      return;
    }
    if (parseFloat(withdrawAmount) > 12450.00) {
      triggerToast('Insufficient funds available', 'error');
      return;
    }
    triggerToast(`Withdrawal request of $${parseFloat(withdrawAmount).toFixed(2)} submitted successfully via ${withdrawMethod}!`);
    setWithdrawAmount('');
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Title Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">Financial Wallet</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage portfolios, track earnings, and submit secure withdrawal requests.</p>
      </div>

      {/* Balance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
        {balances.map((bal, idx) => (
          <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex items-center justify-between">
            <div className="space-y-sm">
              <p className="font-label-caps text-label-caps text-on-surface-variant">{bal.title}</p>
              <h3 className="font-title-sm text-title-sm text-on-surface font-bold text-2xl">{bal.value}</h3>
              <p className="text-xs text-on-surface-variant">{bal.detail}</p>
            </div>
            <div className={`h-12 w-12 rounded-full ${bal.bg} ${bal.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-xl">{bal.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Transaction History log */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
            <h3 className="font-title-sm text-title-sm text-on-surface">Transaction Ledger</h3>
            
            {/* Search Filter */}
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-xl pr-sm py-xs bg-surface border border-outline-variant rounded-full font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary/20" 
                placeholder="Search ledger..." 
                type="text"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-body-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant font-bold">
                  <th className="pb-sm font-semibold">Txn ID</th>
                  <th className="pb-sm font-semibold">Description</th>
                  <th className="pb-sm font-semibold">Date</th>
                  <th className="pb-sm font-semibold">Type</th>
                  <th className="pb-sm font-semibold">Amount</th>
                  <th className="pb-sm font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredTransactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-md font-mono-label text-xs">{txn.id}</td>
                    <td className="py-md text-on-surface font-semibold">{txn.description}</td>
                    <td className="py-md text-on-surface-variant">{txn.date}</td>
                    <td className="py-md">{txn.type}</td>
                    <td className={`py-md font-bold ${txn.amount.startsWith('+') ? 'text-tertiary' : 'text-primary'}`}>
                      {txn.amount}
                    </td>
                    <td className="py-md text-right">
                      <span className="inline-block px-sm py-xs rounded-full text-xs font-semibold bg-tertiary/10 text-tertiary">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-lg text-center text-on-surface-variant">
                      No matching records found for "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-fit">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-xs">Submit Payout Request</h3>
          <p className="text-body-sm text-on-surface-variant mb-lg">Submit secure requests to release available yields to your verified settlement account.</p>

          <form onSubmit={handleWithdrawalSubmit} className="space-y-md">
            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Withdrawal Amount ($)</label>
              <input 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                type="number"
                step="0.01"
              />
              <p className="text-xs text-on-surface-variant">Available balance: $12,450.00</p>
            </div>

            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Settlement Method</label>
              <select 
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
              >
                <option>Bank Transfer (Chase Bank ••••5678)</option>
                <option>USDT Settlement (TRC-20 Wallet)</option>
                <option>PayPal Verified Settlement</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-on-primary font-title-sm text-body-sm font-semibold py-sm rounded-lg hover:opacity-95 transition-all shadow-md cursor-pointer"
            >
              Submit Payout Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
