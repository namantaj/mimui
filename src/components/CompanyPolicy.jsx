import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function CompanyPolicy({ setRoute, triggerToast }) {
  const { acceptPolicy } = useAuth();
  const { t, locale, switchLanguage } = useLanguage();
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (!isChecked) return;
    acceptPolicy();
    if (triggerToast) {
      triggerToast(
        locale === 'en' 
          ? 'Company Policy accepted successfully!' 
          : 'कंपनी की नीति सफलतापूर्वक स्वीकार कर ली गई है!'
      );
    }
    setRoute('profile');
  };

  const points = t('companyPolicy.points') || [];
  const pointTitles = t('companyPolicy.pointTitles') || [];

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-200">
      
      {/* 1. Refined Compact Header */}
      <header className="sticky top-0 z-40 bg-[#7D1F2B] text-on-primary border-b border-gold/30 shadow-md">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left branding */}
          <div className="flex items-center gap-3.5">
            <img src="/logo.png" alt="Bhagwn Solutions" className="h-9 w-auto object-contain bg-white/10 px-2 py-1 rounded-lg border border-white/20" />
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-gold uppercase">
                {t('companyPolicy.badge')}
              </span>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-cream leading-tight">
                {t('companyPolicy.title')}
              </h1>
            </div>
          </div>

          {/* Right Language Switcher */}
          <button
            type="button"
            onClick={() => switchLanguage(locale === 'en' ? 'hi' : 'en')}
            className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-cream text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Translate / भाषा बदलें"
          >
            <span className="material-symbols-outlined text-[16px] text-gold">translate</span>
            <span>{locale === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
          </button>
        </div>
      </header>

      {/* 2. Introductory Notice Strip */}
      <div className="bg-bone border-b border-sand text-warm-gray text-[12px] sm:text-[13px] py-2.5 px-4">
        <div className="max-w-[960px] mx-auto flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">info</span>
          <p className="font-medium text-espresso/90">{t('companyPolicy.instruction')}</p>
        </div>
      </div>

      {/* 3. Main Policy Document Area */}
      <main className="flex-1 max-w-[960px] w-full mx-auto px-4 sm:px-8 py-8 flex flex-col">
        
        {/* Document Frame */}
        <article className="bg-surface border border-sand rounded-xl shadow-sm p-6 sm:p-12 space-y-8 text-espresso font-body-md">
          
          {/* Formal Document Title Block */}
          <div className="text-center pb-6 border-b border-sand/80 space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-gold">
              <span>BHAGWAN SOLUTIONS</span>
              <span>•</span>
              <span>PARIVAR GROUP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {t('companyPolicy.title')}
            </h2>
            <p className="text-[13px] text-warm-gray font-medium">
              {t('companyPolicy.subtitle')}
            </p>
          </div>

          {/* Continuous Document Policy Clauses (No individual cards) */}
          <div className="space-y-7">
            {points.map((pointText, index) => {
              const clauseNum = String(index + 1).padStart(2, '0');
              const clauseTitle = pointTitles[index] || '';

              return (
                <div 
                  key={index}
                  className="space-y-1.5 pb-6 border-b border-sand/40 last:border-b-0 last:pb-0"
                >
                  {/* Clause Section Title */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-bold font-mono text-gold tracking-wider">
                      {clauseNum}.
                    </span>
                    {clauseTitle && (
                      <h3 className="text-[14px] sm:text-[15px] font-bold text-primary uppercase tracking-wide">
                        {clauseTitle}
                      </h3>
                    )}
                  </div>

                  {/* Exact Clause Text */}
                  <p className="text-[14px] sm:text-[15px] leading-relaxed text-espresso/90 pl-6 sm:pl-7">
                    {pointText}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Formal Document Closing Statements / Mottos */}
          <div className="pt-8 border-t-2 border-sand/80 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            
            <div className="p-4 bg-bone/70 border border-sand/60 rounded-lg space-y-1">
              <span className="text-[10px] font-bold tracking-[0.15em] text-gold uppercase block">
                POLICY STATEMENT I
              </span>
              <h4 className="text-[13px] font-extrabold text-primary uppercase">
                {t('companyPolicy.motto1Title')}
              </h4>
              <p className="text-[12px] text-warm-gray italic font-medium">
                {t('companyPolicy.motto1Sub')}
              </p>
            </div>

            <div className="p-4 bg-bone/70 border border-sand/60 rounded-lg space-y-1">
              <span className="text-[10px] font-bold tracking-[0.15em] text-gold uppercase block">
                POLICY STATEMENT II
              </span>
              <h4 className="text-[13px] font-extrabold text-primary uppercase">
                {t('companyPolicy.motto2Title')}
              </h4>
              <p className="text-[12px] text-warm-gray italic font-medium">
                {t('companyPolicy.motto2Sub')}
              </p>
            </div>

          </div>

        </article>

        <div className="h-28"></div> {/* Spacer for sticky footer */}

      </main>

      {/* 4. Sticky Bottom Acknowledgement & Consent Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t border-sand shadow-2xl py-4 px-4 sm:px-8">
        <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Checkbox & Consent Statement */}
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase block">
              {t('companyPolicy.acknowledgementHeader')}
            </span>
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-sand text-primary focus:ring-primary/20 accent-primary cursor-pointer"
              />
              <span className="text-[13px] font-bold text-espresso group-hover:text-primary transition-colors leading-snug">
                {t('companyPolicy.agreeCheckbox')}
              </span>
            </label>
            <p className="text-[11px] text-warm-gray pl-7 hidden md:block">
              {t('companyPolicy.acknowledgementSubtext')}
            </p>
          </div>

          {/* Accept Button */}
          <button
            type="button"
            onClick={handleAccept}
            disabled={!isChecked}
            className={`h-11 sm:h-12 px-8 text-[14px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-md ${
              isChecked
                ? 'bg-primary text-on-primary hover:bg-[#641722] hover:shadow-lg cursor-pointer active:scale-[0.99]'
                : 'bg-sand/60 text-warm-gray cursor-not-allowed opacity-70 shadow-none'
            }`}
          >
            <span>{t('companyPolicy.acceptButton')}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

        </div>
      </div>

    </div>
  );
}

export default CompanyPolicy;
