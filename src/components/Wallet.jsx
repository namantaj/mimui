import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const METHODS = [
  'Bank Transfer',
  'UPI / PhonePe / GPay',
  'USDT / Crypto',
];

const formatCurrency = (val) => {
  if (!val && val !== 0) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(val) || 0);
};

const formatDate = (d) => {
  if (!d) return '—';

  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StatusPill = ({ status }) => {
  const cfg = {
    pending: {
      bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
      label: 'Pending',
    },
    approved: {
      bg: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800/50',
      label: 'Rejected',
    },
  };

  const s = status?.toLowerCase() || 'pending';
  const c = cfg[s] || cfg.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${c.bg}`}
    >
      {c.label}
    </span>
  );
};

function Wallet({ triggerToast }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  // =========================================================
  // FORM STATE
  // =========================================================
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState(METHODS[0]);
  const [withdrawNote, setWithdrawNote] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // WITHDRAWAL HISTORY
  // =========================================================
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const [withdrawalError, setWithdrawalError] = useState('');

  // =========================================================
  // MEMBER / WALLET DATA
  // =========================================================
  const [depositStatus, setDepositStatus] = useState('');
  const [membershipPlan, setMembershipPlan] = useState('');
  const [planAmount, setPlanAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  // =========================================================
  // PLAN-LEVEL WITHDRAWAL ACCESS
  // =========================================================
  const [memberPlans, setMemberPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // =========================================================
  // SEARCH
  // =========================================================
  const [searchTerm, setSearchTerm] = useState('');

  // =========================================================
  // LOAD MEMBER DATA
  // =========================================================
  const loadMemberData = useCallback(async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('members')
      .select(
        'payment_status, membership_plan, plan_amount, wallet_balance'
      )
      .eq('id', user.id)
      .maybeSingle();

    if (!error && data) {
      setDepositStatus(data.payment_status || '');
      setMembershipPlan(data.membership_plan || '');
      setPlanAmount(data.plan_amount || '');
      setWalletBalance(Number(data.wallet_balance) || 0);
    }
  }, [user?.id]);

  // =========================================================
  // LOAD MEMBER PLANS
  // =========================================================
  const loadMemberPlans = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingPlans(true);

      const { data, error } = await supabase
        .from('member_plans')
        .select(
          'id, member_id, plan_name, plan_amount, withdrawal_balance, withdrawal_enabled, created_at, updated_at'
        )
        .eq('member_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      const plans = data || [];
      setMemberPlans(plans);

      // Automatically select the first enabled plan.
      const enabledPlans = plans.filter(
        (plan) => plan.withdrawal_enabled === true
      );

      setSelectedPlanId((current) => {
        if (
          current &&
          enabledPlans.some((plan) => plan.id === current)
        ) {
          return current;
        }

        return enabledPlans[0]?.id || '';
      });
    } catch (err) {
      console.error('Error loading member plans:', err);
      setMemberPlans([]);
      setSelectedPlanId('');
    } finally {
      setLoadingPlans(false);
    }
  }, [user?.id]);

  // =========================================================
  // LOAD WITHDRAWALS
  // =========================================================
  const loadWithdrawals = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingWithdrawals(true);
      setWithdrawalError('');

      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('member_id', user.id)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setWithdrawals(data || []);
    } catch (err) {
      console.error('Error loading withdrawal history:', err);

      setWithdrawalError(
        err?.message || 'Could not load withdrawal history.'
      );
    } finally {
      setLoadingWithdrawals(false);
    }
  }, [user?.id]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    loadMemberData();
    loadMemberPlans();
    loadWithdrawals();
  }, [loadMemberData, loadMemberPlans, loadWithdrawals]);

  // =========================================================
  // REALTIME
  // =========================================================
  useEffect(() => {
    if (!user?.id) return;

    // Member data updates.
    const memberChannel = supabase
      .channel(`wallet-member-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'members',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (!payload.new) return;

          setDepositStatus(payload.new.payment_status || '');
          setMembershipPlan(payload.new.membership_plan || '');
          setPlanAmount(payload.new.plan_amount || '');
          setWalletBalance(Number(payload.new.wallet_balance) || 0);
        }
      )
      .subscribe();

    // IMPORTANT:
    // Admin lock/unlock happens on member_plans, not members.
    const plansChannel = supabase
      .channel(`wallet-plans-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'member_plans',
          filter: `member_id=eq.${user.id}`,
        },
        () => {
          loadMemberPlans();
        }
      )
      .subscribe();

    // Withdrawal history updates.
    const withdrawalChannel = supabase
      .channel(`wallet-withdrawals-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'withdrawals',
          filter: `member_id=eq.${user.id}`,
        },
        () => {
          loadWithdrawals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(memberChannel);
      supabase.removeChannel(plansChannel);
      supabase.removeChannel(withdrawalChannel);
    };
  }, [user?.id, loadMemberPlans, loadWithdrawals]);

  // =========================================================
  // ENABLED PLANS
  // =========================================================
  const enabledPlans = memberPlans.filter(
    (plan) => plan.withdrawal_enabled === true
  );

  const selectedPlan =
    enabledPlans.find((plan) => plan.id === selectedPlanId) || null;

  const withdrawalAccessEnabled = enabledPlans.length > 0;

  // =========================================================
  // SUBMIT WITHDRAWAL
  // =========================================================
  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      triggerToast('You must be logged in.', 'error');
      return;
    }

    // Re-check the current plan from Supabase before inserting.
    if (!selectedPlanId) {
      triggerToast(
        'No withdrawal-enabled plan is available.',
        'error'
      );
      return;
    }

    const { data: currentPlan, error: planError } = await supabase
      .from('member_plans')
      .select(
        'id, member_id, plan_name, plan_amount, withdrawal_balance, withdrawal_enabled'
      )
      .eq('id', selectedPlanId)
      .eq('member_id', user.id)
      .maybeSingle();

    if (planError) {
      console.error('Withdrawal plan check error:', planError);
      triggerToast(
        'Could not verify withdrawal access. Please try again.',
        'error'
      );
      return;
    }

    if (!currentPlan || currentPlan.withdrawal_enabled !== true) {
      await loadMemberPlans();

      triggerToast(
        'Withdrawal access for this plan is currently locked by admin.',
        'error'
      );
      return;
    }

    const amt = parseFloat(withdrawAmount);

    if (
      !withdrawAmount ||
      Number.isNaN(amt) ||
      amt <= 0
    ) {
      triggerToast(
        'Please enter a valid withdrawal amount.',
        'error'
      );
      return;
    }

    setSubmitting(true);

    try {
      // IMPORTANT:
      // Wallet balance is intentionally NOT checked.
      // A customer may submit even when the balance is ₹0.
      //
      // member_plan_id tells Admin exactly which plan the
      // withdrawal belongs to.
      const { data, error } = await supabase
        .from('withdrawals')
        .insert({
          member_id: user.id,
          member_plan_id: currentPlan.id,
          amount: amt,
          method: withdrawMethod,
          note: withdrawNote.trim() || null,
          status: 'pending',
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      console.log('Withdrawal request created:', data);

      triggerToast(
        `Withdrawal request of ${formatCurrency(
          amt
        )} submitted successfully. Pending admin approval.`,
        'success'
      );

      setWithdrawAmount('');
      setWithdrawNote('');

      await loadWithdrawals();
    } catch (err) {
      console.error('Withdrawal submission error:', err);

      triggerToast(
        err?.message || 'Failed to submit withdrawal request.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // FILTER WITHDRAWALS
  // =========================================================
  const filteredWithdrawals = withdrawals.filter((w) => {
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase();

    return (
      w.method?.toLowerCase().includes(search) ||
      w.status?.toLowerCase().includes(search) ||
      w.note?.toLowerCase().includes(search) ||
      String(w.amount).includes(searchTerm)
    );
  });

  // =========================================================
  // STATISTICS
  // =========================================================
  const pendingCount = withdrawals.filter(
    (w) => w.status?.toLowerCase() === 'pending'
  ).length;

  const totalApproved = withdrawals
    .filter((w) => w.status?.toLowerCase() === 'approved')
    .reduce(
      (total, w) => total + Number(w.amount || 0),
      0
    );

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="space-y-lg animate-fade-in">

      {/* HEADER */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">
          {t('wallet.title')}
        </h2>

        <p className="font-body-md text-body-md text-on-surface-variant">
          {t('wallet.subtitle')}
        </p>
      </div>

      {/* PLAN WITHDRAWAL ACCESS */}
      {!loadingPlans && (
        <div
          className={`rounded-xl border p-4 ${withdrawalAccessEnabled
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50'
            }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`material-symbols-outlined text-2xl shrink-0 ${withdrawalAccessEnabled
                ? 'text-emerald-600'
                : 'text-red-600'
                }`}
            >
              {withdrawalAccessEnabled ? 'lock_open' : 'lock'}
            </span>

            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm ${withdrawalAccessEnabled
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-red-800 dark:text-red-300'
                  }`}
              >
                {withdrawalAccessEnabled
                  ? 'Withdrawal Access Available'
                  : 'Withdrawal Requests Locked'}
              </p>

              <p className="text-xs text-on-surface-variant mt-0.5">
                {withdrawalAccessEnabled
                  ? `${enabledPlans.length} plan${enabledPlans.length === 1 ? '' : 's'
                  } currently enabled for withdrawal.`
                  : 'Admin has not enabled withdrawal access for any of your plans.'}
              </p>

              {withdrawalAccessEnabled && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {enabledPlans.map((plan) => (
                    <span
                      key={plan.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/70 dark:bg-black/10 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        check_circle
                      </span>
                      {plan.plan_name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DEPOSIT STATUS */}
      {membershipPlan && (
        <div
          className={`rounded-xl border p-4 flex items-start sm:items-center gap-3 ${depositStatus === 'approved'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
            : depositStatus === 'rejected'
              ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
            }`}
        >
          <span
            className={`material-symbols-outlined text-2xl shrink-0 ${depositStatus === 'approved'
              ? 'text-emerald-600'
              : depositStatus === 'rejected'
                ? 'text-red-600'
                : 'text-amber-600'
              }`}
          >
            {depositStatus === 'approved'
              ? 'check_circle'
              : depositStatus === 'rejected'
                ? 'cancel'
                : 'pending_actions'}
          </span>

          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold text-sm ${depositStatus === 'approved'
                ? 'text-emerald-800 dark:text-emerald-300'
                : depositStatus === 'rejected'
                  ? 'text-red-800 dark:text-red-300'
                  : 'text-amber-800 dark:text-amber-300'
                }`}
            >
              Membership Deposit — {membershipPlan} (
              {formatCurrency(planAmount)})
            </p>

            <p className="text-xs text-on-surface-variant mt-0.5">
              Payment Status:{' '}
              <strong className="capitalize">
                {depositStatus === 'approved'
                  ? 'Approved ✓'
                  : depositStatus === 'rejected'
                    ? 'Rejected ✗'
                    : 'Pending Review'}
              </strong>

              {depositStatus === 'approved' &&
                ' — Your membership is active.'}

              {depositStatus === 'rejected' &&
                ' — Please contact admin.'}

              {depositStatus === 'pending' &&
                ' — Admin will review your payment shortly.'}
            </p>
          </div>
        </div>
      )}

      {/* BALANCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">

        {/* Available Balance */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex items-center justify-between">
          <div className="space-y-sm">
            <p className="font-label-caps text-label-caps text-on-surface-variant">
              {t('wallet.availableBalance')}
            </p>

            <h3 className="font-title-sm text-title-sm text-on-surface font-bold text-2xl">
              {formatCurrency(walletBalance)}
            </h3>

            <p className="text-xs text-on-surface-variant">
              {t('wallet.availableDetail')}
            </p>
          </div>

          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">
              account_balance_wallet
            </span>
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex items-center justify-between">
          <div className="space-y-sm">
            <p className="font-label-caps text-label-caps text-on-surface-variant">
              Pending Withdrawals
            </p>

            <h3 className="font-title-sm text-title-sm text-on-surface font-bold text-2xl">
              {pendingCount}
            </h3>

            <p className="text-xs text-on-surface-variant">
              Awaiting admin approval
            </p>
          </div>

          <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">
              pending_actions
            </span>
          </div>
        </div>

        {/* Total Approved */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex items-center justify-between">
          <div className="space-y-sm">
            <p className="font-label-caps text-label-caps text-on-surface-variant">
              {t('wallet.totalPayouts')}
            </p>

            <h3 className="font-title-sm text-title-sm text-on-surface font-bold text-2xl">
              {formatCurrency(totalApproved)}
            </h3>

            <p className="text-xs text-on-surface-variant">
              Total approved withdrawals
            </p>
          </div>

          <div className="h-12 w-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">
              paid
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

        {/* WITHDRAWAL HISTORY */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
            <h3 className="font-title-sm text-title-sm text-on-surface">
              Withdrawal Requests
            </h3>

            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  search
                </span>

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-sm py-xs bg-surface border border-outline-variant rounded-full font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                  placeholder="Search…"
                  type="text"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  loadWithdrawals();
                  loadMemberPlans();
                }}
                className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface transition cursor-pointer"
                title="Refresh"
              >
                <span className="material-symbols-outlined text-[18px]">
                  refresh
                </span>
              </button>
            </div>
          </div>

          {loadingWithdrawals ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : withdrawalError ? (
            <div className="py-8 text-center text-sm text-red-600">
              {withdrawalError}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-body-sm">
                <thead>
                  <tr className="border-b border-outline-variant text-on-surface-variant font-bold text-xs">
                    <th className="pb-sm font-semibold">Amount</th>
                    <th className="pb-sm font-semibold">Method</th>
                    <th className="pb-sm font-semibold">Note</th>
                    <th className="pb-sm font-semibold">Date</th>
                    <th className="pb-sm font-semibold text-right">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-outline-variant">
                  {filteredWithdrawals.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-on-surface-variant text-sm"
                      >
                        {searchTerm
                          ? 'No records match your search.'
                          : 'No withdrawal requests yet. Submit one below.'}
                      </td>
                    </tr>
                  ) : (
                    filteredWithdrawals.map((w) => (
                      <tr
                        key={w.id}
                        className="hover:bg-surface-container-low transition-colors"
                      >
                        <td className="py-md font-bold text-on-surface">
                          {formatCurrency(w.amount)}
                        </td>

                        <td className="py-md text-on-surface-variant text-xs">
                          {w.method}
                        </td>

                        <td className="py-md text-on-surface-variant text-xs max-w-[120px] truncate">
                          {w.note || '—'}
                        </td>

                        <td className="py-md text-on-surface-variant text-xs whitespace-nowrap">
                          {formatDate(w.created_at)}
                        </td>

                        <td className="py-md text-right">
                          <StatusPill status={w.status} />

                          {w.admin_note && (
                            <p className="text-[10px] text-on-surface-variant mt-0.5 max-w-[140px] ml-auto text-right">
                              {w.admin_note}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SUBMIT WITHDRAWAL */}
        <div
          className={`bg-surface-container-lowest border rounded-xl p-lg shadow-sm h-fit ${withdrawalAccessEnabled
            ? 'border-outline-variant'
            : 'border-red-200 dark:border-red-800/50'
            }`}
        >
          <div className="flex items-start justify-between gap-3 mb-xs">
            <div>
              <h3 className="font-title-sm text-title-sm text-on-surface">
                {t('wallet.submitPayout')}
              </h3>

              <p className="text-body-sm text-on-surface-variant mt-1">
                {withdrawalAccessEnabled
                  ? t('wallet.payoutSubtitle')
                  : 'Withdrawal access is currently locked by admin.'}
              </p>
            </div>

            <span
              className={`material-symbols-outlined shrink-0 ${withdrawalAccessEnabled
                ? 'text-emerald-600'
                : 'text-red-500'
                }`}
            >
              {withdrawalAccessEnabled ? 'lock_open' : 'lock'}
            </span>
          </div>

          {loadingPlans ? (
            <div className="mt-lg flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : !withdrawalAccessEnabled ? (
            <div className="mt-lg rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600">
                  lock
                </span>

                <div>
                  <p className="font-semibold text-sm text-red-800 dark:text-red-300">
                    Withdrawal Locked
                  </p>

                  <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                    None of your plans currently have withdrawal access.
                    Admin must enable a plan before you can submit a request.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleWithdrawalSubmit}
              className="space-y-md mt-lg"
            >

              {/* PLAN */}
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  Withdrawal Plan
                </label>

                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  disabled={submitting}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none disabled:opacity-60"
                  required
                >
                  {enabledPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.plan_name} — {formatCurrency(plan.plan_amount)}
                    </option>
                  ))}
                </select>

                {selectedPlan && (
                  <div className="rounded-lg bg-surface-container-low border border-outline-variant p-3 mt-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] text-on-surface-variant">
                          Plan Withdrawal Balance
                        </p>
                        <p className="font-bold text-on-surface mt-0.5">
                          {formatCurrency(selectedPlan.withdrawal_balance)}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-[14px]">
                          check_circle
                        </span>
                        Enabled
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* AMOUNT */}
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  {t('wallet.withdrawalAmount')}
                </label>

                <input
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                  type="number"
                  step="1"
                  min="1"
                  required
                  disabled={submitting}
                />

                <p className="text-xs text-on-surface-variant">
                  Current wallet balance:{' '}
                  <strong>{formatCurrency(walletBalance)}</strong>
                </p>

                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                  Wallet balance does not determine whether you can submit a
                  request. Requests are subject to admin approval.
                </p>
              </div>

              {/* METHOD */}
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  {t('wallet.settlementMethod')}
                </label>

                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  disabled={submitting}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none disabled:opacity-60"
                >
                  {METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* NOTE */}
              <div className="space-y-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  Note (optional)
                </label>

                <input
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  placeholder="UPI ID, account details, etc."
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow disabled:opacity-60"
                  type="text"
                  maxLength={200}
                  disabled={submitting}
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting || !selectedPlanId}
                className="w-full bg-primary text-on-primary font-title-sm text-body-sm font-semibold py-sm rounded-lg hover:opacity-95 transition-all shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? 'Submitting…'
                  : t('wallet.submitBtn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;
