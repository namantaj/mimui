import React, { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

function Support({ triggerToast }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');

  const [ticketHistory, setTicketHistory] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // LOAD MEMBER'S TICKETS
  // ============================================================
  const loadTickets = async () => {
    if (!user?.id) {
      setTicketHistory([]);
      setLoadingTickets(false);
      return;
    }

    setLoadingTickets(true);

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTicketHistory(data || []);
    } catch (error) {
      console.error('Error loading support tickets:', error);

      if (triggerToast) {
        triggerToast(
          'Unable to load your support tickets',
          'error'
        );
      }
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user?.id]);

  // ============================================================
  // SUBMIT SUPPORT TICKET
  // ============================================================
  const handleTicketSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      if (triggerToast) {
        triggerToast(
          'Please fill out ticket subject and message details',
          'error'
        );
      }
      return;
    }

    if (!user?.id) {
      if (triggerToast) {
        triggerToast(
          'Your session could not be found. Please log in again.',
          'error'
        );
      }
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          category,
          priority,
          subject: subject.trim(),
          message: message.trim(),
          status: 'Open'
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Add newly created ticket to the top of the list
      setTicketHistory((prev) => [
        data,
        ...prev
      ]);

      setSubject('');
      setMessage('');
      setCategory('Technical Issue');
      setPriority('Medium');

      if (triggerToast) {
        triggerToast(
          `Support ticket opened successfully. Ticket ID: ${data.ticket_number}!`
        );
      }

    } catch (error) {
      console.error(
        'Error creating support ticket:',
        error
      );

      if (triggerToast) {
        triggerToast(
          'Unable to create support ticket. Please try again.',
          'error'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // CLEAR FORM
  // ============================================================
  const handleClear = () => {
    setSubject('');
    setMessage('');
    setCategory('Technical Issue');
    setPriority('Medium');

    if (triggerToast) {
      triggerToast('Fields cleared', 'info');
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================
  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================
  const getStatusClass = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-tertiary/10 text-tertiary';

      case 'Closed':
        return 'bg-surface-container text-on-surface-variant';

      case 'In Progress':
        return 'bg-secondary/10 text-secondary';

      case 'Rejected':
        return 'bg-error/10 text-error';

      case 'Open':
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="space-y-lg animate-fade-in">

      {/* ======================================================
          TITLE HEADER
      ======================================================= */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">
          {t('support.title')}
        </h2>

        <p className="font-body-md text-body-md text-on-surface-variant">
          {t('support.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

        {/* ====================================================
            SUBMIT TICKET FORM
        ===================================================== */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">

          <h3 className="font-title-sm text-title-sm text-on-surface mb-md">
            {t('support.submitHeader')}
          </h3>

          <form
            onSubmit={handleTicketSubmit}
            className="space-y-md"
          >

            {/* Category + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">

              {/* Category */}
              <div className="space-y-xs">

                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  {t('support.departmentLabel')}
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                >

                  <option value="Technical Issue">
                    {t('support.technicalIssue')}
                  </option>

                  <option value="Payouts & Banking">
                    {t('support.payoutsBanking')}
                  </option>

                  <option value="Genealogy">
                    {t('support.genealogy')}
                  </option>

                  <option value="Product Orders">
                    {t('support.productOrders')}
                  </option>

                  <option value="Compliance">
                    {t('support.compliance')}
                  </option>

                </select>

              </div>

              {/* Priority */}
              <div className="space-y-xs">

                <label className="font-label-caps text-label-caps text-on-surface-variant">
                  {t('support.urgencyLabel')}
                </label>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow appearance-none"
                >

                  <option value="Low">
                    {t('support.low')}
                  </option>

                  <option value="Medium">
                    {t('support.medium')}
                  </option>

                  <option value="High">
                    {t('support.high')}
                  </option>

                  <option value="Critical">
                    {t('support.critical')}
                  </option>

                </select>

              </div>

            </div>

            {/* Subject */}
            <div className="space-y-xs">

              <label className="font-label-caps text-label-caps text-on-surface-variant">
                {t('support.subjectLabel')}
              </label>

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('support.subjectPlaceholder')}
                className="w-full h-10 px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                type="text"
              />

            </div>

            {/* Description */}
            <div className="space-y-xs">

              <label className="font-label-caps text-label-caps text-on-surface-variant">
                {t('support.descLabel')}
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="6"
                placeholder={t('support.descPlaceholder')}
                className="w-full p-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
              />

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-md pt-sm">

              <button
                type="button"
                onClick={handleClear}
                disabled={submitting}
                className="px-xl py-sm rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
              >
                {t('support.clearFields')}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-xl py-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:opacity-95 transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {submitting
                  ? 'Submitting...'
                  : t('support.submitTicket')}
              </button>

            </div>

          </form>
        </div>

        {/* ====================================================
            TICKET HISTORY
        ===================================================== */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-fit">

          <h3 className="font-title-sm text-title-sm text-on-surface mb-lg">
            {t('support.ticketHistory')}
          </h3>

          {loadingTickets ? (

            <div className="py-lg text-center text-sm text-on-surface-variant">
              Loading tickets...
            </div>

          ) : ticketHistory.length === 0 ? (

            <div className="py-lg text-center text-sm text-on-surface-variant">
              No support tickets yet.
            </div>

          ) : (

            <div className="space-y-md">

              {ticketHistory.map((tkt) => (

                <div
                  key={tkt.id}
                  onClick={() =>
                    triggerToast?.(
                      `Ticket ${tkt.ticket_number} — ${tkt.status}`
                    )
                  }
                  className="p-md bg-surface border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors"
                >

                  {/* Ticket Number + Status */}
                  <div className="flex items-center justify-between gap-md mb-xs">

                    <span className="font-mono-label text-xs font-semibold text-primary">
                      {tkt.ticket_number}
                    </span>

                    <span
                      className={`inline-block px-sm py-xs rounded-full text-xs font-semibold ${getStatusClass(
                        tkt.status
                      )}`}
                    >
                      {tkt.status}
                    </span>

                  </div>

                  {/* Subject */}
                  <h4 className="font-bold text-body-sm text-on-surface">
                    {tkt.subject}
                  </h4>

                  {/* Category + Date */}
                  <div className="flex items-center justify-between mt-sm text-xs text-on-surface-variant">

                    <span>
                      {tkt.category}
                    </span>

                    <span>
                      {formatDate(tkt.created_at)}
                    </span>

                  </div>

                  {/* =================================================
                      ADMIN REPLY
                  ================================================== */}
                  {tkt.admin_reply && (
                    <div className="mt-md p-md rounded-lg bg-primary/5 border border-primary/10">

                      <div className="flex items-center gap-2 mb-xs">

                        <span className="text-xs font-bold text-primary">
                          Admin Reply
                        </span>

                      </div>

                      <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                        {tkt.admin_reply}
                      </p>

                    </div>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default Support;