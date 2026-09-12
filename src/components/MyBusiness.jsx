import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

function MyBusiness({ triggerToast }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [member, setMember] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('8weeks');

  // =========================================================
  // HELPERS
  // =========================================================

  const fmtInr = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
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

  const getInitials = (name) => {
    if (!name) return 'M';

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  // =========================================================
  // LOAD MEMBER + REFERRALS
  // =========================================================

  const loadBusiness = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // -----------------------------------------------------
      // Current member
      // -----------------------------------------------------

      const {
        data: memberData,
        error: memberError,
      } = await supabase
        .from('members')
        .select(`
          id,
          full_name,
          email,
          member_id,
          membership_plan,
          membership_status,
          rank,
          created_at
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (memberError) {
        console.error(
          'Error loading member:',
          memberError
        );
      }

      setMember(memberData || null);

      // -----------------------------------------------------
      // Direct referrals
      // -----------------------------------------------------

      if (!memberData?.member_id) {
        setReferrals([]);
        return;
      }

      const {
        data: referralData,
        error: referralError,
      } = await supabase
        .from('members')
        .select(`
          id,
          full_name,
          email,
          phone,
          member_id,
          membership_plan,
          membership_status,
          plan_amount,
          profile_completed,
          rank,
          sponsor,
          created_at
        `)
        .eq('sponsor', memberData.member_id)
        .order('created_at', {
          ascending: false,
        });

      if (referralError) {
        console.error(
          'Error loading referrals:',
          referralError
        );

        setReferrals([]);
      } else {
        setReferrals(referralData || []);
      }
    } catch (error) {
      console.error(
        'Referral Central loading error:',
        error
      );

      setReferrals([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  // =========================================================
  // REALTIME REFERRAL UPDATES
  // =========================================================

  useEffect(() => {
    if (!user?.id || !member?.member_id) {
      return;
    }

    const channel = supabase
      .channel(
        `referral-central-${member.member_id}`
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
        },
        () => {
          loadBusiness();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    user?.id,
    member?.member_id,
    loadBusiness,
  ]);

  // =========================================================
  // REFERRAL URL
  // =========================================================

  const referralCode = member?.member_id || '';

  const referralUrl = referralCode
    ? `${window.location.origin}/join/${referralCode}`
    : '';

  // =========================================================
  // COPY
  // =========================================================

  const handleCopy = async (text, label) => {
    if (!text) {
      triggerToast(
        `${label} is not available.`
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      triggerToast(
        `${label} copied to clipboard!`
      );
    } catch (error) {
      console.error(
        'Clipboard error:',
        error
      );

      triggerToast(
        `Unable to copy ${label}.`
      );
    }
  };

  // =========================================================
  // SOCIAL SHARING
  // =========================================================

  const shareText = referralUrl
    ? `Join me at Bhagwn Solutions. Use my referral link: ${referralUrl}`
    : '';

  const shareWhatsApp = () => {
    if (!referralUrl) return;

    const url =
      `https://wa.me/?text=${encodeURIComponent(
        shareText
      )}`;

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareTelegram = () => {
    if (!referralUrl) return;

    const url =
      `https://t.me/share/url?url=${encodeURIComponent(
        referralUrl
      )}&text=${encodeURIComponent(
        'Join me at Bhagwn Solutions'
      )}`;

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareFacebook = () => {
    if (!referralUrl) return;

    const url =
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralUrl
      )}`;

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareEmail = () => {
    if (!referralUrl) return;

    const subject =
      'Join me at Bhagwn Solutions';

    const body =
      `Hello,\n\n` +
      `I wanted to invite you to join Bhagwn Solutions.\n\n` +
      `You can register using my referral link:\n` +
      `${referralUrl}\n\n` +
      `Regards,\n` +
      `${member?.full_name || ''}`;

    window.location.href =
      `mailto:?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalReferrals =
    referrals.length;

  const successfulJoins =
    referrals.filter(
      (referral) =>
        referral.profile_completed === true
    ).length;

  const conversionRate =
    totalReferrals > 0
      ? (
        (successfulJoins /
          totalReferrals) *
        100
      ).toFixed(1)
      : '0.0';

  // =========================================================
  // CHART DATA
  // =========================================================

  const getChartData = () => {
    const weeks = [];
    const now = new Date();

    const numberOfWeeks =
      period === '12weeks'
        ? 12
        : 8;

    for (
      let i = numberOfWeeks - 1;
      i >= 0;
      i--
    ) {
      const end = new Date(now);

      end.setDate(
        now.getDate() - i * 7
      );

      const start = new Date(end);

      start.setDate(
        end.getDate() - 6
      );

      const count =
        referrals.filter(
          (referral) => {
            const created =
              new Date(
                referral.created_at
              );

            return (
              created >= start &&
              created <= end
            );
          }
        ).length;

      weeks.push({
        label:
          `W${numberOfWeeks - i}`,
        count,
      });
    }

    const max =
      Math.max(
        ...weeks.map(
          (week) => week.count
        ),
        1
      );

    return weeks.map((week) => ({
      ...week,
      height:
        `${Math.max(
          (week.count / max) *
          100,
          week.count > 0
            ? 8
            : 2
        )}%`,
    }));
  };

  const chartData =
    getChartData();

  // =========================================================
  // QR CODE
  // =========================================================

  const qrUrl = referralUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(
      referralUrl
    )}`
    : '';

  const downloadQr = async () => {
    if (!qrUrl) {
      triggerToast(
        'Referral QR code is not available.'
      );
      return;
    }

    try {
      const response =
        await fetch(qrUrl);

      if (!response.ok) {
        throw new Error(
          'QR request failed'
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          'a'
        );

      link.href = url;

      link.download =
        `bhagwn-referral-${referralCode}.png`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );

      triggerToast(
        'Referral QR code downloaded!'
      );
    } catch (error) {
      console.error(
        'QR download error:',
        error
      );

      triggerToast(
        'Unable to download QR code.'
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <h2 className="text-[28px] font-bold text-espresso">
            Referral Central
          </h2>

          <p className="text-[14px] text-warm-gray mt-1">
            Manage your referral network.
          </p>
        </div>

        <div className="bg-cream border border-sand rounded-2xl p-12 shadow-card">

          <div className="flex items-center justify-center gap-3 text-warm-gray">

            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>

            <span className="text-sm">
              Loading your referral network...
            </span>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="space-y-6 pb-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2 mb-2">

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
              Executive Portal
            </span>

            <span className="w-1 h-1 rounded-full bg-sand" />

            <span className="text-[10px] font-semibold text-warm-gray">
              Referral Central
            </span>

          </div>

          <h2 className="text-[28px] md:text-[30px] font-bold text-espresso tracking-tight">
            {t('business.title') ||
              'Referral Central'}
          </h2>

          <p className="text-[14px] text-warm-gray mt-1">
            {t('business.subtitle') ||
              'Grow and manage your partner network.'}
          </p>

        </div>

        <div className="flex items-center gap-2">

          <span className="text-[11px] text-warm-gray">
            Your Member ID
          </span>

          <span className="px-3 py-1.5 rounded-lg bg-primary/8 text-primary text-[12px] font-bold">
            {referralCode || '-'}
          </span>

        </div>

      </div>

      {/* =====================================================
          REFERRAL LINK
      ===================================================== */}

      <div className="bg-cream border border-sand rounded-2xl shadow-card overflow-hidden">

        <div className="p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">

              <span className="material-symbols-outlined text-primary">
                link
              </span>

            </div>

            <div>

              <h3 className="text-[15px] font-bold text-espresso">
                Your Referral Link
              </h3>

              <p className="text-[11px] text-warm-gray mt-0.5">
                Share this link to invite new members.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">

            <div className="bg-bone border border-sand rounded-xl px-4 py-3 min-w-0">

              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-warm-gray mb-1">
                Invitation Link
              </p>

              <p className="text-[13px] font-medium text-espresso truncate">
                {referralUrl ||
                  'Referral link unavailable'}
              </p>

            </div>

            <button
              onClick={() =>
                handleCopy(
                  referralUrl,
                  'Referral link'
                )
              }
              disabled={!referralUrl}
              className="px-5 py-3 rounded-xl bg-primary text-on-primary text-[12px] font-bold hover:bg-[#641722] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >

              <span className="material-symbols-outlined text-[18px]">
                content_copy
              </span>

              Copy Link

            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Referrals */}

        <div className="relative overflow-hidden bg-cream border border-sand rounded-2xl p-5 shadow-card">

          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-warm-gray">
                Total Direct Referrals
              </p>

              <p className="text-[30px] font-bold text-espresso mt-3">
                {totalReferrals}
              </p>

              <p className="text-[11px] text-warm-gray mt-2">
                Members using your referral
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center">

              <span className="material-symbols-outlined">
                group
              </span>

            </div>

          </div>

        </div>

        {/* Successful Joins */}

        <div className="relative overflow-hidden bg-cream border border-sand rounded-2xl p-5 shadow-card">

          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold rounded-l-2xl" />

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-warm-gray">
                Successful Joins
              </p>

              <p className="text-[30px] font-bold text-espresso mt-3">
                {successfulJoins}
              </p>

              <p className="text-[11px] text-warm-gray mt-2">
                Completed member profiles
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center">

              <span className="material-symbols-outlined">
                person_check
              </span>

            </div>

          </div>

        </div>

        {/* Completion Rate */}

        <div className="relative overflow-hidden bg-cream border border-sand rounded-2xl p-5 shadow-card">

          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-warm-gray">
                Completion Rate
              </p>

              <p className="text-[30px] font-bold text-espresso mt-3">
                {conversionRate}%
              </p>

              <p className="text-[11px] text-warm-gray mt-2">
                Referrals with completed profiles
              </p>

            </div>

            <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center">

              <span className="material-symbols-outlined">
                trending_up
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="xl:col-span-2 space-y-5">

          {/* =================================================
              DIRECT REFERRAL NETWORK
          ================================================= */}

          <div className="bg-cream border border-sand rounded-2xl shadow-card overflow-hidden">

            {/* Header */}

            <div className="px-6 py-5 border-b border-sand/70 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">

                  <span className="material-symbols-outlined text-primary">
                    hub
                  </span>

                </div>

                <div>

                  <h3 className="text-[15px] font-bold text-espresso">
                    Direct Referral Network
                  </h3>

                  <p className="text-[11px] text-warm-gray mt-0.5">
                    Members directly registered through you
                  </p>

                </div>

              </div>

              <span className="px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[10px] font-bold whitespace-nowrap">
                {totalReferrals}{' '}
                {totalReferrals === 1
                  ? 'Member'
                  : 'Members'}
              </span>

            </div>

            {/* =================================================
                FIXED EMPTY STATE
            ================================================= */}

            {referrals.length === 0 ? (

              <div className="w-full px-6 py-12">

                <div className="w-full flex flex-col items-center text-center">

                  {/* Icon */}

                  <div className="w-14 h-14 rounded-full bg-bone border border-sand/70 flex items-center justify-center">

                    <span className="material-symbols-outlined text-[25px] text-warm-gray/60">
                      group_add
                    </span>

                  </div>

                  {/* Title */}

                  <h4 className="text-[15px] font-bold text-espresso mt-4">
                    No direct referrals yet
                  </h4>

                  {/* Description */}

                  <p className="text-[12px] leading-5 text-warm-gray mt-2 w-full max-w-[420px] text-center">
                    Share your referral link with friends, family, or business
                    partners to start building your partner network.
                  </p>

                  {/* Button */}

                  <button
                    onClick={() =>
                      handleCopy(
                        referralUrl,
                        'Referral link'
                      )
                    }
                    disabled={!referralUrl}
                    className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-[12px] font-bold hover:bg-[#641722] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >

                    <span className="material-symbols-outlined text-[16px]">
                      content_copy
                    </span>

                    Copy Referral Link

                  </button>

                </div>

              </div>

            ) : (

              /* =================================================
                 REFERRAL MEMBERS
              ================================================= */

              <div className="divide-y divide-sand/60">

                {referrals.map(
                  (referral) => (

                    <div
                      key={referral.id}
                      className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-bone/40 transition-colors"
                    >

                      {/* Member */}

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 rounded-full bg-primary/8 text-primary flex items-center justify-center shrink-0 font-bold text-[12px]">
                          {getInitials(
                            referral.full_name
                          )}
                        </div>

                        <div className="min-w-0">

                          <p className="text-[13px] font-bold text-espresso truncate">
                            {referral.full_name ||
                              'Member'}
                          </p>

                          <p className="text-[10px] text-warm-gray mt-0.5">
                            {referral.member_id ||
                              '-'}
                            {' • '}
                            Joined{' '}
                            {formatDate(
                              referral.created_at
                            )}
                          </p>

                        </div>

                      </div>

                      {/* Details */}

                      <div className="flex items-center gap-3 shrink-0">

                        <div className="hidden sm:block text-right">

                          <p className="text-[11px] text-warm-gray">
                            Plan
                          </p>

                          <p className="text-[12px] font-bold text-espresso max-w-[180px] truncate">
                            {referral.membership_plan ||
                              'Not selected'}
                          </p>

                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full capitalize ${referral.profile_completed
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                            }`}
                        >
                          {referral.profile_completed
                            ? 'Completed'
                            : 'Profile Pending'}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* =================================================
              REFERRAL ACTIVITY CHART
          ================================================= */}

          <div className="bg-cream border border-sand rounded-2xl p-6 shadow-card">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

              <div>

                <h3 className="text-[15px] font-bold text-espresso">
                  Referral Activity
                </h3>

                <p className="text-[11px] text-warm-gray mt-0.5">
                  Actual member registrations over time
                </p>

              </div>

              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value)
                }
                className="bg-bone border border-sand text-espresso text-[11px] font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/10"
              >

                <option value="8weeks">
                  Last 8 weeks
                </option>

                <option value="12weeks">
                  Last 12 weeks
                </option>

              </select>

            </div>

            <div className="relative h-64 bg-bone border border-sand/70 rounded-xl px-4 pt-6 pb-8 overflow-hidden">

              {/* Grid */}

              <div className="absolute inset-0 px-4 py-6 flex flex-col justify-between pointer-events-none">

                <div className="border-t border-sand/60" />
                <div className="border-t border-sand/60" />
                <div className="border-t border-sand/60" />
                <div className="border-t border-sand/60" />

              </div>

              {/* Bars */}

              <div className="relative z-10 h-full flex items-end justify-between gap-2">

                {chartData.map(
                  (bar, index) => (

                    <div
                      key={index}
                      className="h-full flex-1 flex flex-col items-center justify-end group"
                    >

                      <div className="relative w-full max-w-[48px] flex items-end justify-center h-[calc(100%-24px)]">

                        <div
                          className="w-full bg-gold rounded-t-md hover:bg-[#b58b27] transition-all cursor-pointer relative"
                          style={{
                            height:
                              bar.height,
                          }}
                        >

                          {/* Tooltip */}

                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 whitespace-nowrap">

                            <div className="bg-espresso text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-lg">

                              {bar.count}{' '}
                              {bar.count === 1
                                ? 'join'
                                : 'joins'}

                            </div>

                          </div>

                        </div>

                      </div>

                      <span className="text-[9px] text-warm-gray mt-2">
                        {bar.label}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {totalReferrals === 0 && (

              <p className="text-[11px] text-warm-gray text-center mt-4">
                Your chart will populate automatically when members join
                through your referral link.
              </p>

            )}

          </div>

        </div>

        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <div className="space-y-5">

          {/* =================================================
              QR CODE
          ================================================= */}

          <div className="bg-cream border border-sand rounded-2xl p-6 shadow-card">

            <div className="text-center">

              <div className="flex items-center justify-center gap-3 mb-2">

                <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">

                  <span className="material-symbols-outlined text-gold">
                    qr_code_2
                  </span>

                </div>

                <h3 className="text-[15px] font-bold text-espresso">
                  Your Referral QR
                </h3>

              </div>

              <p className="text-[11px] text-warm-gray">
                Scan to open your referral registration page.
              </p>

            </div>

            {/* QR */}

            <div className="mt-5 w-52 h-52 mx-auto rounded-2xl bg-white border border-sand p-3 flex items-center justify-center shadow-sm">

              {qrUrl ? (

                <img
                  src={qrUrl}
                  alt="Referral QR Code"
                  className="w-full h-full object-contain"
                />

              ) : (

                <div className="text-center">

                  <span className="material-symbols-outlined text-4xl text-warm-gray/40">
                    qr_code_2
                  </span>

                  <p className="text-[10px] text-warm-gray mt-2">
                    QR unavailable
                  </p>

                </div>

              )}

            </div>

            <div className="mt-5 space-y-2">

              <button
                onClick={downloadQr}
                disabled={!qrUrl}
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-[12px] font-bold hover:bg-[#641722] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >

                <span className="material-symbols-outlined text-[17px]">
                  download
                </span>

                Download QR Code

              </button>

              <button
                onClick={() =>
                  window.print()
                }
                className="w-full py-2.5 rounded-xl bg-bone border border-sand text-espresso text-[12px] font-bold hover:bg-ivory transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >

                <span className="material-symbols-outlined text-[17px]">
                  print
                </span>

                Print Referral Page

              </button>

            </div>

          </div>

          {/* =================================================
              QUICK SHARE
          ================================================= */}

          <div className="bg-cream border border-sand rounded-2xl p-6 shadow-card">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">

                <span className="material-symbols-outlined text-primary">
                  share
                </span>

              </div>

              <div>

                <h3 className="text-[15px] font-bold text-espresso">
                  Quick Share
                </h3>

                <p className="text-[11px] text-warm-gray mt-0.5">
                  Invite new members
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              {/* WhatsApp */}

              <button
                onClick={shareWhatsApp}
                disabled={!referralUrl}
                className="p-4 rounded-xl border border-sand bg-bone hover:bg-ivory transition-colors flex flex-col items-center gap-2 cursor-pointer disabled:opacity-40"
              >

                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">

                  <span className="material-symbols-outlined">
                    chat
                  </span>

                </div>

                <span className="text-[11px] font-semibold text-espresso">
                  WhatsApp
                </span>

              </button>

              {/* Telegram */}

              <button
                onClick={shareTelegram}
                disabled={!referralUrl}
                className="p-4 rounded-xl border border-sand bg-bone hover:bg-ivory transition-colors flex flex-col items-center gap-2 cursor-pointer disabled:opacity-40"
              >

                <div className="w-10 h-10 rounded-full bg-primary/8 text-primary flex items-center justify-center">

                  <span className="material-symbols-outlined">
                    send
                  </span>

                </div>

                <span className="text-[11px] font-semibold text-espresso">
                  Telegram
                </span>

              </button>

              {/* Facebook */}

              <button
                onClick={shareFacebook}
                disabled={!referralUrl}
                className="p-4 rounded-xl border border-sand bg-bone hover:bg-ivory transition-colors flex flex-col items-center gap-2 cursor-pointer disabled:opacity-40"
              >

                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">

                  <span className="material-symbols-outlined">
                    thumb_up
                  </span>

                </div>

                <span className="text-[11px] font-semibold text-espresso">
                  Facebook
                </span>

              </button>

              {/* Email */}

              <button
                onClick={shareEmail}
                disabled={!referralUrl}
                className="p-4 rounded-xl border border-sand bg-bone hover:bg-ivory transition-colors flex flex-col items-center gap-2 cursor-pointer disabled:opacity-40"
              >

                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">

                  <span className="material-symbols-outlined">
                    mail
                  </span>

                </div>

                <span className="text-[11px] font-semibold text-espresso">
                  Email
                </span>

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MyBusiness;