import React, { useState } from 'react';

function Wallet({ triggerToast }) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('Bank Transfer');
  const [searchTerm, setSearchTerm] = useState('');

  const balances = [
    { title: 'Available Balance', value: '$12,450.00', detail: 'Ready for withdrawal', icon: 'account_balance_wallet', color: 'text-blue-600' },
    { title: 'Ledger Balance', value: '$14,200.00', detail: 'Pending matching confirmation', icon: 'pending_actions', color: 'text-amber-600' },
    { title: 'Total Withdrawn', value: '$32,800.00', detail: 'Processed since account opening', icon: 'paid', color: 'text-emerald-600' }
  ];

  const transactions = [
    { id: 'TXN-1094', description: 'Direct Referral Commission - Sarah Jenkins', date: '2026-07-28', type: 'Commission', amount: '+$840.00', status: 'Completed' },
    { id: 'TXN-1093', description: 'Monthly Binary Leg Matching Reward', date: '2026-07-25', type: 'Matching Bonus', amount: '+$1,200.00', status: 'Completed' },
    { id: 'TXN-1087', description: 'Wallet Payout Withdrawal Request', date: '2026-07-15', type: 'Withdrawal', amount: '-$1,500.00', status: 'Completed' },
    { id: 'TXN-1081', description: 'Level 2 Indirect Commission - Emily Watson', date: '2026-07-10', type: 'Commission', amount: '+$380.00', status: 'Completed' },
    { id: 'TXN-1075', description: 'Executive Diamond Rank Incentive Bonus', date: '2026-07-01', type: 'Bonus', amount: '+$2,500.00', status: 'Completed' },
    { id: 'TXN-1064', description: 'Wallet Payout Withdrawal Request', date: '2026-06-15', type: 'Withdrawal', amount: '-$2,000.00', status: 'Completed' }
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
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs dark:text-slate-100">Financial Wallet</h2>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Manage earnings, view commission payouts, and request cash withdrawals.</p>
      </div>

      {/* Balance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
        {balances.map((bal, idx) => (
          <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
            <div className="space-y-sm">
              <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">{bal.title}</p>
              <h3 className="font-title-sm text-title-sm text-on-surface font-bold text-2xl dark:text-slate-100">{bal.value}</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-500">{bal.detail}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center text-primary dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400">
              <span className="material-symbols-outlined text-xl">{bal.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Transaction History log */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
            <h3 className="font-title-sm text-title-sm text-on-surface dark:text-slate-100">Transaction History</h3>
            
            {/* Search Filter */}
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400">search</span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-xl pr-sm py-xs bg-surface border border-outline-variant rounded-full font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" 
                placeholder="Search txns..." 
                type="text"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-body-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant font-bold dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-sm font-semibold">Txn ID</th>
                  <th className="pb-sm font-semibold">Description</th>
                  <th className="pb-sm font-semibold">Date</th>
                  <th className="pb-sm font-semibold">Type</th>
                  <th className="pb-sm font-semibold">Amount</th>
                  <th className="pb-sm font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant dark:divide-slate-800">
                {filteredTransactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low transition-colors dark:hover:bg-slate-800">
                    <td className="py-md font-mono-label text-xs dark:text-slate-400">{txn.id}</td>
                    <td className="py-md text-on-surface font-semibold dark:text-slate-200">{txn.description}</td>
                    <td className="py-md text-on-surface-variant dark:text-slate-400">{txn.date}</td>
                    <td className="py-md dark:text-slate-300">{txn.type}</td>
                    <td className={`py-md font-bold ${txn.amount.startsWith('+') ? 'text-tertiary dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      {txn.amount}
                    </td>
                    <td className="py-md text-right">
                      <span className="inline-block px-sm py-xs rounded-full text-xs font-semibold bg-tertiary-container/10 text-tertiary-container dark:bg-green-500/10 dark:text-green-400">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-lg text-center text-on-surface-variant dark:text-slate-400">
                      No transactions found matching "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-fit dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-xs dark:text-slate-100">Withdraw Funds</h3>
          <p className="text-body-sm text-on-surface-variant dark:text-slate-400 mb-lg">Request payout of your available wallet balance directly to your bank or crypto account.</p>

          <form onSubmit={handleWithdrawalSubmit} className="space-y-md">
            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">Withdrawal Amount ($)</label>
              <input 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                type="number"
                step="0.01"
              />
              <p className="text-xs text-on-surface-variant dark:text-slate-500">Max limit: $12,450.00</p>
            </div>

            <div className="space-y-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">Destination Account</label>
              <select 
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              >
                <option>Bank Transfer (Chase Bank ••••5678)</option>
                <option>USDT Crypto Wallet (TRC-20)</option>
                <option>PayPal Account</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-on-primary font-title-sm text-body-sm font-semibold py-sm rounded-lg hover:bg-primary-container transition-colors shadow-md dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Request Withdrawal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
