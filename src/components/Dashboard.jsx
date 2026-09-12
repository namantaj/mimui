import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

function Dashboard({ triggerToast }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [member, setMember] = useState(null);
  const [directReferrals, setDirectReferrals] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [recentWithdrawals, setRecentWithdrawals] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName =
    member?.full_name?.split(' ')[0] ||
    user?.fullName?.split(' ')[0] ||
    'Partner';

  /* ─────────────────────────────────────────────
     Helpers
  ───────────────────────────────────────────── */

  const fmtInr = (value) => {
    if (value === null || value === undefined || value === '') {
      return '₹0';
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const timeAgo = (date) => {
    if (!date) return '';

    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return 'Just now';

    const minutes = Math.floor(diff / 60);

    if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return formatDate(date);
  };

  /* ─────────────────────────────────────────────
     Load Dashboard Data
  ───────────────────────────────────────────── */

  const loadDashboard = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      /* ─────────────────────────────────────────
         1. Current Member
      ───────────────────────────────────────── */

      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select(`
          id,
          full_name,
          email,
          phone,
          member_id,
          membership_plan,
          membership_status,
          wallet_balance,
          total_earnings,
          rank,
          sponsor,
          plan_amount,
          payment_status,
          created_at
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (memberError) {
        console.error('Error loading member:', memberError);
      }

      setMember(memberData || null);

      /* ─────────────────────────────────────────
         2. Direct Referrals
      ───────────────────────────────────────── */

      if (memberData?.member_id) {
        const {
          count: referralCount,
          error: referralError,
        } = await supabase
          .from('members')
          .select('id', {
            count: 'exact',
            head: true,
          })
          .eq('sponsor', memberData.member_id);

        if (referralError) {
          console.error(
            'Error loading referrals:',
            referralError
          );

          setDirectReferrals(0);
        } else {
          setDirectReferrals(referralCount || 0);
        }
      } else {
        setDirectReferrals(0);
      }

      /* ─────────────────────────────────────────
         3. Pending Withdrawals
      ───────────────────────────────────────── */

      const {
        count: pendingCount,
        error: withdrawalCountError,
      } = await supabase
        .from('withdrawals')
        .select('id', {
          count: 'exact',
          head: true,
        })
        .eq('member_id', user.id)
        .eq('status', 'pending');

      if (withdrawalCountError) {
        console.error(
          'Error loading withdrawal count:',
          withdrawalCountError
        );
      }

      setPendingWithdrawals(pendingCount || 0);

      /* ─────────────────────────────────────────
         4. Recent Withdrawals
      ───────────────────────────────────────── */

      const {
        data: withdrawalData,
        error: withdrawalError,
      } = await supabase
        .from('withdrawals')
        .select(`
          id,
          amount,
          method,
          status,
          note,
          created_at,
          updated_at
        `)
        .eq('member_id', user.id)
        .order('created_at', {
          ascending: false,
        })
        .limit(5);

      if (withdrawalError) {
        console.error(
          'Error loading withdrawals:',
          withdrawalError
        );
      }

      setRecentWithdrawals(withdrawalData || []);

      /* ─────────────────────────────────────────
         5. Recent Support Tickets
      ───────────────────────────────────────── */

      const {
        data: ticketData,
        error: ticketError,
      } = await supabase
        .from('support_tickets')
        .select(`
          id,
          ticket_number,
          subject,
          category,
          status,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .order('created_at', {
          ascending: false,
        })
        .limit(5);

      if (ticketError) {
        console.error(
          'Error loading support tickets:',
          ticketError
        );
      }

      setRecentTickets(ticketData || []);
    } catch (error) {
      console.error(
        'Dashboard loading error:',
        error
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* ─────────────────────────────────────────────
     REALTIME DASHBOARD
  ───────────────────────────────────────────── */

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`dashboard-live-${user.id}`)

      /* Member changes
         Payment, earnings, wallet, plan, rank,
         membership status, etc.
      */
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
          filter: `id=eq.${user.id}`,
        },
        () => {
          loadDashboard();
        }
      )

      /* New direct referral */
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'members',
          filter: `sponsor=eq.${member?.member_id || ''}`,
        },
        () => {
          loadDashboard();
        }
      )

      /* Support tickets
         New ticket, status change,
         admin reply, etc.
      */
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadDashboard();
        }
      )

      /* Withdrawals
         New request, approval, rejection, etc.
      */
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'withdrawals',
          filter: `member_id=eq.${user.id}`,
        },
        () => {
          loadDashboard();
        }
      )

      .subscribe((status) => {
        console.log(
          'Dashboard realtime status:',
          status
        );
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    user?.id,
    member?.member_id,
    loadDashboard,
  ]);

  /* ─────────────────────────────────────────────
     Copy Referral Link
  ───────────────────────────────────────────── */

  const copyReferralLink = async () => {
    if (!member?.member_id) {
      triggerToast(
        'Member ID is not available.'
      );
      return;
    }

    const referralLink =
      `${window.location.origin}/join/${member.member_id}`;

    try {
      await navigator.clipboard.writeText(
        referralLink
      );

      triggerToast(
        'Referral link copied to clipboard!'
      );
    } catch (error) {
      console.error(
        'Clipboard error:',
        error
      );

      triggerToast(
        'Unable to copy referral link.'
      );
    }
  };

  /* ─────────────────────────────────────────────
     Payment Status
  ───────────────────────────────────────────── */

  const getPaymentStatus = () => {
    if (!member?.membership_plan) {
      return null;
    }

    if (member.payment_status === 'approved') {
      return {
        label: 'Approved',
        icon: 'check_circle',
        color: 'emerald',
        wrapper:
          'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-600',
      };
    }

    if (member.payment_status === 'rejected') {
      return {
        label: 'Rejected',
        icon: 'cancel',
        color: 'red',
        wrapper:
          'bg-red-50 border-red-200',
        iconColor: 'text-red-600',
      };
    }

    return {
      label: 'Pending Review',
      icon: 'pending_actions',
      color: 'amber',
      wrapper:
        'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600',
    };
  };

  const paymentStatus =
    getPaymentStatus();

  /* ─────────────────────────────────────────────
     Recent Activity
  ───────────────────────────────────────────── */

  const activities = [
    ...recentWithdrawals.map((item) => ({
      id: `withdrawal-${item.id}`,
      icon: 'account_balance_wallet',

      title:
        `Withdrawal request of ${fmtInr(item.amount)}`,

      detail:
        `Status: ${item.status || 'Pending'}`,

      date: item.created_at,

      iconBg:
        item.status === 'approved'
          ? 'bg-emerald-50'
          : item.status === 'rejected'
            ? 'bg-red-50'
            : 'bg-amber-50',

      iconColor:
        item.status === 'approved'
          ? 'text-emerald-600'
          : item.status === 'rejected'
            ? 'text-red-600'
            : 'text-amber-600',
    })),

    ...recentTickets.map((item) => ({
      id: `ticket-${item.id}`,

      icon: 'support_agent',

      title:
        `Support ticket ${item.ticket_number}`,

      detail:
        `${item.subject} • ${item.status}`,

      date: item.created_at,

      iconBg: 'bg-primary/8',

      iconColor: 'text-primary',
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 6);

  /* ─────────────────────────────────────────────
     Statistics
  ───────────────────────────────────────────── */

  const stats = [
    {
      title:
        t('dashboard.totalEarnings'),

      value:
        fmtInr(member?.total_earnings),

      subtitle:
        'Lifetime earnings',

      icon: 'payments',

      accent: 'primary',

      iconBg: 'bg-primary/8',

      iconColor: 'text-primary',
    },

    {
      title: 'Wallet Balance',

      value:
        fmtInr(member?.wallet_balance),

      subtitle:
        'Available balance',

      icon:
        'account_balance_wallet',

      accent: 'gold',

      iconBg: 'bg-gold/10',

      iconColor: 'text-gold',
    },

    {
      title:
        t('dashboard.activeReferrals'),

      value:
        directReferrals,

      subtitle:
        directReferrals === 1
          ? 'Direct partner'
          : 'Direct partners',

      icon: 'group',

      accent: 'primary',

      iconBg: 'bg-primary/8',

      iconColor: 'text-primary',
    },

    {
      title: 'Plan Amount',

      value:
        fmtInr(member?.plan_amount),

      subtitle:
        member?.payment_status
          ? `Payment ${member.payment_status}`
          : 'No payment submitted',

      icon: 'receipt_long',

      accent: 'gold',

      iconBg: 'bg-gold/10',

      iconColor: 'text-gold',
    },
  ];

  /* ─────────────────────────────────────────────
     UI
  ───────────────────────────────────────────── */

  return (
    <div className="space-y-6 pb-4">

      {/* ═══════════════════════════════════════════
          WELCOME HEADER
      ═══════════════════════════════════════════ */}

      <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-6 md:px-8 md:py-7 shadow-card">

        {/* Decorative elements */}
        <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full border border-white/10" />

        <div className="absolute -right-6 -bottom-28 w-64 h-64 rounded-full border border-white/10" />

        <div className="absolute right-28 top-10 w-20 h-20 rounded-full bg-gold/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Welcome */}
          <div>

            <div className="flex items-center gap-2 mb-2">

              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                Executive Portal
              </span>

              <span className="w-1 h-1 rounded-full bg-white/30" />

              <span className="text-[11px] text-white/70">
                Member Dashboard
              </span>

            </div>

            <h2 className="text-[28px] md:text-[32px] font-bold text-white tracking-tight leading-tight">
              Welcome back, {displayName}
            </h2>

            <p className="text-[14px] text-white/70 mt-2">
              Here's your current business portfolio snapshot.
            </p>

          </div>

          {/* Header information */}
          <div className="flex flex-wrap items-center gap-3">

            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3">

              <p className="text-[9px] uppercase tracking-[0.12em] text-white/50 font-bold">
                Member ID
              </p>

              <p className="text-[13px] text-white font-semibold mt-1">
                {member?.member_id || '-'}
              </p>

            </div>

            <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3">

              <p className="text-[9px] uppercase tracking-[0.12em] text-white/50 font-bold">
                Status
              </p>

              <div className="flex items-center gap-1.5 mt-1">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                <p className="text-[13px] text-white font-semibold capitalize">
                  {member?.membership_status || 'Active'}
                </p>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LOADING
      ═══════════════════════════════════════════ */}

      {loading && !member ? (

        <div className="bg-cream border border-sand rounded-2xl p-10 shadow-card">

          <div className="flex items-center justify-center gap-3 text-warm-gray">

            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>

            <span className="text-sm">
              Loading your dashboard...
            </span>

          </div>

        </div>

      ) : (

        <>

          {/* ═════════════════════════════════════════
              PAYMENT / WITHDRAWAL STATUS
          ═════════════════════════════════════════ */}

          {(paymentStatus ||
            pendingWithdrawals > 0) && (

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Payment */}

                {paymentStatus && (

                  <div
                    className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${paymentStatus.wrapper}`}
                  >

                    <div
                      className={`absolute right-0 top-0 w-24 h-24 rounded-full ${paymentStatus.color === 'emerald'
                          ? 'bg-emerald-200/30'
                          : paymentStatus.color === 'red'
                            ? 'bg-red-200/30'
                            : 'bg-amber-200/30'
                        } -translate-y-12 translate-x-12`}
                    />

                    <div className="relative flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shrink-0">

                        <span
                          className={`material-symbols-outlined text-[23px] ${paymentStatus.iconColor}`}
                        >
                          {paymentStatus.icon}
                        </span>

                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-[10px] uppercase tracking-[0.1em] font-bold opacity-60">
                            Membership Payment
                          </span>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70">
                            {paymentStatus.label}
                          </span>

                        </div>

                        <p className="text-[14px] font-bold mt-1 truncate">
                          {member?.membership_plan ||
                            'Selected Plan'}
                        </p>

                        <p className="text-[12px] opacity-70 mt-0.5">
                          {fmtInr(member?.plan_amount)}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

                {/* Pending withdrawals */}

                {pendingWithdrawals > 0 && (

                  <div className="relative overflow-hidden rounded-2xl border bg-blue-50 border-blue-200 px-5 py-4 text-blue-800">

                    <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-blue-200/30 -translate-y-12 translate-x-12" />

                    <div className="relative flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shrink-0">

                        <span className="material-symbols-outlined text-blue-600 text-[23px]">
                          account_balance_wallet
                        </span>

                      </div>

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.1em] font-bold opacity-60">
                          Withdrawal Requests
                        </p>

                        <p className="text-[14px] font-bold mt-1">
                          {pendingWithdrawals}{' '}
                          pending request
                          {pendingWithdrawals > 1
                            ? 's'
                            : ''}
                        </p>

                        <p className="text-[12px] opacity-70 mt-0.5">
                          Waiting for admin approval
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}

          {/* ═════════════════════════════════════════
              STATISTICS
          ═════════════════════════════════════════ */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {stats.map((stat, idx) => (

              <div
                key={idx}
                className="group relative overflow-hidden bg-cream border border-sand rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
              >

                {/* Accent line */}

                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${stat.accent === 'primary'
                      ? 'bg-primary'
                      : 'bg-gold'
                    }`}
                />

                <div className="flex items-start justify-between">

                  <div className="min-w-0">

                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-warm-gray">
                      {stat.title}
                    </p>

                    <h3 className="text-[26px] font-bold text-espresso tracking-tight leading-none mt-3 truncate">
                      {stat.value}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-3">

                      <span className="material-symbols-outlined text-[14px] text-warm-gray">
                        info
                      </span>

                      <span className="text-[11px] font-medium text-warm-gray">
                        {stat.subtitle}
                      </span>

                    </div>

                  </div>

                  <div
                    className={`w-11 h-11 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >

                    <span className="material-symbols-outlined text-[21px]">
                      {stat.icon}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* ═════════════════════════════════════════
              MEMBERSHIP + REFERRAL
          ═════════════════════════════════════════ */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Membership */}

            <div className="lg:col-span-2 bg-cream border border-sand rounded-2xl shadow-card overflow-hidden">

              <div className="px-6 py-5 border-b border-sand/70 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">

                    <span className="material-symbols-outlined text-primary text-[21px]">
                      workspace_premium
                    </span>

                  </div>

                  <div>

                    <h3 className="text-[15px] font-bold text-espresso">
                      Membership Information
                    </h3>

                    <p className="text-[11px] text-warm-gray mt-0.5">
                      Your current membership details
                    </p>

                  </div>

                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                  Member
                </span>

              </div>

              <div className="p-6">

                {/* Current plan */}

                <div className="rounded-xl bg-bone border border-sand/80 p-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                      Current Plan
                    </p>

                    <p className="text-[17px] font-bold text-espresso mt-1">
                      {member?.membership_plan ||
                        'Not selected'}
                    </p>

                  </div>

                  <div className="sm:text-right">

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                      Plan Value
                    </p>

                    <p className="text-[17px] font-bold text-primary mt-1">
                      {fmtInr(member?.plan_amount)}
                    </p>

                  </div>

                </div>

                {/* Details */}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                      Status
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5">

                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                      <p className="text-[13px] font-bold text-espresso capitalize">
                        {member?.membership_status ||
                          'Pending'}
                      </p>

                    </div>

                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                      Member ID
                    </p>

                    <p className="text-[13px] font-bold text-espresso mt-1.5">
                      {member?.member_id || '-'}
                    </p>

                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                      Current Rank
                    </p>

                    <p className="text-[13px] font-bold text-espresso mt-1.5">
                      {member?.rank ||
                        'Not assigned'}
                    </p>

                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                      Sponsor
                    </p>

                    <p className="text-[13px] font-bold text-espresso mt-1.5 truncate">
                      {member?.sponsor ||
                        'Not assigned'}
                    </p>

                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                      Joined
                    </p>

                    <p className="text-[13px] font-bold text-espresso mt-1.5">
                      {formatDate(
                        member?.created_at
                      )}
                    </p>

                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                      Payment
                    </p>

                    <p className="text-[13px] font-bold text-espresso mt-1.5 capitalize">
                      {member?.payment_status ||
                        'Pending'}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ═══════════════════════════════════════
                REFERRAL NETWORK
            ═══════════════════════════════════════ */}

            <div className="relative overflow-hidden bg-cream border border-sand rounded-2xl shadow-card p-6 text-espresso">

              {/* Decorative circles */}

              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full border border-sand/60" />

              <div className="absolute -right-5 -bottom-16 w-40 h-40 rounded-full bg-gold/5" />

              <div className="relative z-10 flex flex-col h-full">

                {/* Header */}

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">

                    <span className="material-symbols-outlined text-gold text-[21px]">
                      hub
                    </span>

                  </div>

                  <div>

                    <h3 className="text-[15px] font-bold text-espresso">
                      Referral Network
                    </h3>

                    <p className="text-[11px] text-warm-gray mt-0.5">
                      Grow your partner network
                    </p>

                  </div>

                </div>

                {/* Referral link */}

                <div className="mt-6">

                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-warm-gray">
                    Your Referral Link
                  </p>

                  <div className="mt-2 rounded-xl bg-bone border border-sand/80 p-3">

                    <p className="text-[11px] text-warm-gray truncate">
                      {member?.member_id
                        ? `${window.location.origin}/join/${member.member_id}`
                        : 'Referral link unavailable'}
                    </p>

                  </div>

                  <button
                    onClick={copyReferralLink}
                    disabled={!member?.member_id}
                    className="w-full mt-3 bg-gold hover:bg-[#b58b27] disabled:opacity-40 disabled:cursor-not-allowed text-espresso font-bold text-[12px] py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >

                    <span className="material-symbols-outlined text-[16px]">
                      content_copy
                    </span>

                    Copy Referral Link

                  </button>

                </div>

                {/* Referral count */}

                <div className="mt-auto pt-6">

                  <div className="flex items-end justify-between">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-gray">
                        Direct Referrals
                      </p>

                      <p className="text-[30px] font-bold text-primary leading-none mt-1">
                        {directReferrals}
                      </p>

                    </div>

                    <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">

                      <span className="material-symbols-outlined text-gold">
                        group
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ═════════════════════════════════════════
              ACTIVITY + WITHDRAWALS
          ═════════════════════════════════════════ */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Recent Activity */}

            <div className="bg-cream border border-sand rounded-2xl shadow-card overflow-hidden">

              <div className="px-6 py-5 border-b border-sand/70 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">

                  <span className="material-symbols-outlined text-primary text-[21px]">
                    history
                  </span>

                </div>

                <div>

                  <h3 className="text-[15px] font-bold text-espresso">
                    Recent Activity
                  </h3>

                  <p className="text-[11px] text-warm-gray mt-0.5">
                    Your latest account activity
                  </p>

                </div>

              </div>

              <div className="px-6">

                {activities.length === 0 ? (

                  <div className="py-12 text-center">

                    <div className="w-12 h-12 mx-auto rounded-full bg-bone flex items-center justify-center">

                      <span className="material-symbols-outlined text-[22px] text-warm-gray/50">
                        history
                      </span>

                    </div>

                    <p className="text-[13px] font-semibold text-espresso mt-3">
                      No recent activity
                    </p>

                    <p className="text-[11px] text-warm-gray mt-1">
                      Your latest account actions will appear here.
                    </p>

                  </div>

                ) : (

                  activities.map(
                    (activity, idx) => (

                      <div
                        key={activity.id}
                        className={`flex items-start gap-3 py-4 ${idx <
                            activities.length - 1
                            ? 'border-b border-sand/50'
                            : ''
                          }`}
                      >

                        <div
                          className={`w-9 h-9 rounded-xl ${activity.iconBg} flex items-center justify-center shrink-0`}
                        >

                          <span
                            className={`material-symbols-outlined text-[17px] ${activity.iconColor}`}
                          >
                            {activity.icon}
                          </span>

                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="text-[12px] font-semibold text-espresso leading-snug">
                            {activity.title}
                          </p>

                          <p className="text-[11px] text-warm-gray mt-1 truncate">
                            {activity.detail}
                          </p>

                          <p className="text-[10px] text-warm-gray/70 mt-1">
                            {timeAgo(activity.date)}
                          </p>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

            {/* Recent Withdrawals */}

            <div className="bg-cream border border-sand rounded-2xl shadow-card overflow-hidden">

              <div className="px-6 py-5 border-b border-sand/70 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">

                  <span className="material-symbols-outlined text-gold text-[21px]">
                    account_balance_wallet
                  </span>

                </div>

                <div>

                  <h3 className="text-[15px] font-bold text-espresso">
                    Recent Withdrawals
                  </h3>

                  <p className="text-[11px] text-warm-gray mt-0.5">
                    Your latest withdrawal requests
                  </p>

                </div>

              </div>

              <div className="px-6">

                {recentWithdrawals.length === 0 ? (

                  <div className="py-12 text-center">

                    <div className="w-12 h-12 mx-auto rounded-full bg-bone flex items-center justify-center">

                      <span className="material-symbols-outlined text-[22px] text-warm-gray/50">
                        account_balance_wallet
                      </span>

                    </div>

                    <p className="text-[13px] font-semibold text-espresso mt-3">
                      No withdrawal requests
                    </p>

                    <p className="text-[11px] text-warm-gray mt-1">
                      Your withdrawal history will appear here.
                    </p>

                  </div>

                ) : (

                  recentWithdrawals.map(
                    (withdrawal, idx) => (

                      <div
                        key={withdrawal.id}
                        className={`flex items-center justify-between py-4 ${idx <
                            recentWithdrawals.length - 1
                            ? 'border-b border-sand/50'
                            : ''
                          }`}
                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-9 h-9 rounded-xl bg-bone border border-sand/70 flex items-center justify-center shrink-0">

                            <span className="material-symbols-outlined text-[17px] text-warm-gray">
                              payments
                            </span>

                          </div>

                          <div className="min-w-0">

                            <p className="text-[13px] font-bold text-espresso">
                              {fmtInr(
                                withdrawal.amount
                              )}
                            </p>

                            <p className="text-[10px] text-warm-gray mt-1">
                              {withdrawal.method ||
                                'Withdrawal'}{' '}
                              •{' '}
                              {formatDate(
                                withdrawal.created_at
                              )}
                            </p>

                          </div>

                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full capitalize shrink-0 ${withdrawal.status ===
                              'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : withdrawal.status ===
                                'rejected'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                        >
                          {withdrawal.status ||
                            'pending'}
                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default Dashboard;