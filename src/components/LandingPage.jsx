import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function LandingPage({ onGetStarted, _setRoute, triggerToast, darkMode, toggleDarkMode }) {
  const { t, locale, switchLanguage } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const planDetailsMap = {
    '01': {
      id: '01',
      titleKey: 'landing.plans.p1.title',
      tagKey: 'landing.plans.p1.tag',
      min: '₹10,000',
      returns: 'Structured quarterly dividend',
      descKey: 'landing.plans.p1.desc',
      badgeKey: 'landing.plans.p1.badge',
      icon: 'account_balance_wallet',
      color: 'text-[#B9933F]',
      bg: 'bg-[#B9933F]/10'
    },
    '02': {
      id: '02',
      titleKey: 'landing.plans.p2.title',
      tagKey: 'landing.plans.p2.tag',
      min: '₹10 / day',
      returns: 'Daily accumulation ledger',
      descKey: 'landing.plans.p2.desc',
      badgeKey: 'landing.plans.p2.badge',
      icon: 'calendar_today',
      color: 'text-[#861F2B]',
      bg: 'bg-[#861F2B]/8'
    },
    '03': {
      id: '03',
      titleKey: 'landing.plans.p3.title',
      tagKey: 'landing.plans.p3.tag',
      min: '₹100 min',
      returns: 'Daily return payouts',
      descKey: 'landing.plans.p3.desc',
      badgeKey: 'landing.plans.p3.badge',
      icon: 'trending_up',
      color: 'text-[#285846]',
      bg: 'bg-[#285846]/10'
    },
    '04': {
      id: '04',
      titleKey: 'landing.plans.p4.title',
      tagKey: 'landing.plans.p4.tag',
      min: '₹50 / day',
      returns: '7 months contribution cycle',
      descKey: 'landing.plans.p4.desc',
      badgeKey: 'landing.plans.p4.badge',
      icon: 'savings',
      color: 'text-[#B9933F]',
      bg: 'bg-[#B9933F]/10'
    },
    '05': {
      id: '05',
      titleKey: 'landing.plans.p5.title',
      tagKey: 'landing.plans.p5.tag',
      min: '1, 2, 3 Years',
      returns: 'Maturity interest payout',
      descKey: 'landing.plans.p5.desc',
      badgeKey: 'landing.plans.p5.badge',
      icon: 'lock_clock',
      color: 'text-[#861F2B]',
      bg: 'bg-[#861F2B]/8'
    },
    '06': {
      id: '06',
      titleKey: 'landing.plans.p6.title',
      tagKey: 'landing.plans.p6.tag',
      min: '₹10 / day',
      returns: 'Micro accumulation',
      descKey: 'landing.plans.p6.desc',
      badgeKey: 'landing.plans.p6.badge',
      icon: 'payments',
      color: 'text-[#285846]',
      bg: 'bg-[#285846]/10'
    }
  };

  const handleOpenPlanModal = (planId) => {
    const plan = planDetailsMap[planId];
    if (plan) {
      setSelectedPlan(plan);
    }
  };

  const handleSelectPlanAction = (plan) => {
    setSelectedPlan(null);
    if (triggerToast) {
      triggerToast(`Selected ${t(plan.titleKey)}. Proceeding to registration...`);
    }
    if (onGetStarted) {
      onGetStarted();
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-[#1D1B19] antialiased font-sans selection:bg-[#861F2B]/10 transition-colors duration-200">

      {/* 1. BRAND / HEADER (Sticky, 72px Height) */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#D8D0C1]/80 z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 shadow-xs transition-colors">
        
        {/* Left: Bhagwn Solutions Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/logo.png" alt="Bhagwn Solutions Logo" className="h-11 md:h-[50px] w-auto object-contain" />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-[#756F66]">
          <button onClick={() => scrollToSection('about')} className="hover:text-[#861F2B] transition-colors cursor-pointer">{t('landing.aboutUs')}</button>
          <button onClick={() => scrollToSection('plans')} className="hover:text-[#861F2B] transition-colors cursor-pointer">{t('landing.solutions')}</button>
          <button onClick={() => scrollToSection('why-us')} className="hover:text-[#861F2B] transition-colors cursor-pointer">{t('landing.ourPhilosophy')}</button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button 
            onClick={() => switchLanguage(locale === 'en' ? 'hi' : 'en')}
            className="h-8 px-3 rounded-lg bg-[#F4F0E8] border border-[#D8D0C1] hover:bg-[#FFFDF8] text-[12px] font-semibold text-[#1D1B19] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Switch Language / भाषा बदलें"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B9933F]">translate</span>
            <span>{locale === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#756F66] hover:text-[#1D1B19] hover:bg-[#FFFDF8] transition-all cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-[20px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>

          {/* Login CTA Button */}
          <button
            onClick={onGetStarted}
            className="bg-[#861F2B] hover:bg-[#641722] text-[#FFFDF8] font-bold py-2 px-5 rounded-xl shadow-xs transition-all text-[13.5px] cursor-pointer"
          >
            {t('common.logIn')}
          </button>
        </div>
      </header>

      {/* 2. HERO — MAIN EXPERIENCE (Vertically Tight & Compact) */}
      <section id="about" className="pt-[96px] pb-14 md:pb-16 px-6 md:px-12 max-w-[1320px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Column: Hero Editorial Typography */}
        <div className="w-full lg:w-[48%] flex flex-col justify-center items-start space-y-4 text-left shrink-0">
          
          {/* Small Eyebrow */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9933F] block">BHAGWN SOLUTIONS</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#756F66] block">{t('landing.eyebrowTag')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.12] font-bold tracking-tight text-[#1D1B19]">
            {t('landing.startSmall')} <br />
            <span className="text-[#861F2B]">{t('landing.investSmart')}</span> <br />
            {t('landing.buildFuture').replace(t('landing.futureWord'), '')}<span className="text-[#B9933F]">{t('landing.futureWord')}</span>
          </h1>

          {/* Short 1-2 line description */}
          <p className="text-[14.5px] leading-[1.6] text-[#756F66] max-w-[480px]">
            {t('landing.heroDesc')}
          </p>

          {/* Compact Buttons */}
          <div className="flex items-center gap-3 pt-2 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection('plans')}
              className="h-11 px-6 rounded-xl bg-[#861F2B] hover:bg-[#641722] text-[#FFFDF8] text-[13.5px] font-bold tracking-wide uppercase flex items-center justify-center cursor-pointer transition-all shadow-sm"
            >
              {t('landing.explorePlans')}
            </button>
            <button
              onClick={onGetStarted}
              className="h-11 px-6 rounded-xl bg-[#F4F0E8] border border-[#861F2B] text-[#861F2B] hover:bg-[#861F2B]/5 text-[13.5px] font-bold tracking-wide uppercase flex items-center justify-center transition-all cursor-pointer"
            >
              {t('common.getStarted')}
            </button>
          </div>

          {/* Small Trust Line */}
          <div className="pt-2 text-[12.5px] font-semibold text-[#756F66] flex items-center gap-2 flex-wrap">
            {t('landing.trustLine')}
          </div>

        </div>

        {/* Right Column: ONE Beautiful Brochure-Inspired Investment Visual */}
        <div className="w-full lg:w-[48%] flex items-center justify-center shrink-0">
          <div className="w-full max-w-[440px] bg-[#FFFDF8] border-2 border-[#B9933F]/60 rounded-2xl p-6 shadow-card relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] to-[#F4F0E8]/50">
            
            {/* Background Rupee Motif & Circular Pattern */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#B9933F]/15 pointer-events-none flex items-center justify-center">
              <div className="w-[200px] h-[200px] rounded-full border border-[#B9933F]/10"></div>
              <span className="absolute text-[110px] font-serif text-[#B9933F]/8 font-bold select-none">₹</span>
            </div>

            {/* Header Area inside Card */}
            <div className="relative z-10 flex items-center justify-between pb-3.5 mb-3 border-b border-[#D8D0C1]/80">
              <div>
                <img src="/logo.png" alt="Bhagwn Solutions" className="h-7 w-auto object-contain mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#B9933F]">{t('landing.eyebrowTag')}</span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#861F2B] text-[#FFFDF8] uppercase tracking-wider block">{t('landing.optionsBadge')}</span>
                <span className="text-[10px] text-[#756F66] mt-0.5 block">{t('landing.chooseApproach')}</span>
              </div>
            </div>

            {/* 6 Compact Plan Rows */}
            <div className="relative z-10 space-y-2">
              
              {/* Row 01 */}
              <div 
                onClick={() => handleOpenPlanModal('01')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E8] border border-[#D8D0C1]/70 hover:border-[#B9933F] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold font-mono text-[#B9933F]">01</span>
                  <span className="material-symbols-outlined text-[16px] text-[#861F2B]">account_balance_wallet</span>
                  <span className="text-[13px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.plans.p1.title')}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#756F66]">{t('landing.plans.p1.badge')}</span>
              </div>

              {/* Row 02 */}
              <div 
                onClick={() => handleOpenPlanModal('02')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E8] border border-[#D8D0C1]/70 hover:border-[#B9933F] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold font-mono text-[#B9933F]">02</span>
                  <span className="material-symbols-outlined text-[16px] text-[#861F2B]">calendar_today</span>
                  <span className="text-[13px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.plans.p2.title')}</span>
                </div>
                <span className="text-[12px] font-bold text-[#861F2B]">{t('landing.plans.p2.badge')}</span>
              </div>

              {/* Row 03 */}
              <div 
                onClick={() => handleOpenPlanModal('03')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E8] border border-[#D8D0C1]/70 hover:border-[#B9933F] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold font-mono text-[#B9933F]">03</span>
                  <span className="material-symbols-outlined text-[16px] text-[#285846]">trending_up</span>
                  <span className="text-[13px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.plans.p3.title')}</span>
                </div>
                <span className="text-[12px] font-bold text-[#285846]">{t('landing.plans.p3.badge')}</span>
              </div>

              {/* Row 04 */}
              <div 
                onClick={() => handleOpenPlanModal('04')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E8] border border-[#D8D0C1]/70 hover:border-[#B9933F] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold font-mono text-[#B9933F]">04</span>
                  <span className="material-symbols-outlined text-[16px] text-[#B9933F]">savings</span>
                  <span className="text-[13px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.plans.p4.title')}</span>
                </div>
                <span className="text-[12px] font-bold text-[#861F2B]">{t('landing.plans.p4.badge')}</span>
              </div>

              {/* Row 05 */}
              <div 
                onClick={() => handleOpenPlanModal('05')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E8] border border-[#D8D0C1]/70 hover:border-[#B9933F] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold font-mono text-[#B9933F]">05</span>
                  <span className="material-symbols-outlined text-[16px] text-[#861F2B]">lock_clock</span>
                  <span className="text-[13px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.plans.p5.title')}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#756F66]">{t('landing.plans.p5.badge')}</span>
              </div>

              {/* Row 06 */}
              <div 
                onClick={() => handleOpenPlanModal('06')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E8] border border-[#D8D0C1]/70 hover:border-[#B9933F] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold font-mono text-[#B9933F]">06</span>
                  <span className="material-symbols-outlined text-[16px] text-[#285846]">payments</span>
                  <span className="text-[13px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.plans.p6.title')}</span>
                </div>
                <span className="text-[12px] font-bold text-[#861F2B]">{t('landing.plans.p6.badge')}</span>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 3. DIRECT SMOOTH TRANSITION TO INVESTMENT PLANS SECTION */}
      <section id="plans" className="pt-6 pb-16 px-6 md:px-12 max-w-[1240px] mx-auto">
        
        {/* Subtle Gold Line Separator (Option A) */}
        <div className="w-24 h-[1px] bg-[#B9933F]/40 mx-auto mb-8"></div>

        {/* Section Header */}
        <div className="text-center max-w-[540px] mx-auto mb-10 space-y-1">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#B9933F] block">{t('landing.ourPlans')}</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#1D1B19] tracking-tight">
            {t('landing.plansHeading')}
          </h2>
          <p className="text-[14px] text-[#756F66]">
            {t('landing.plansSubheading')}
          </p>
        </div>

        {/* 6 Cards 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CARD 01 (FEATURED) */}
          <div className="bg-[#FFFDF8] border-2 border-[#B9933F]/60 rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-[#B9933F] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-[240px] relative group">
            
            <div className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded bg-[#B9933F]/15 text-[#B9933F] tracking-wider uppercase">
              {t('landing.featured')}
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[12px] font-bold font-mono text-[#B9933F]">01</span>
                <div className="w-7 h-7 rounded-lg bg-[#B9933F]/10 flex items-center justify-center text-[#B9933F]">
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                </div>
              </div>

              <h3 className="text-[16.5px] font-bold text-[#1D1B19] mb-1">{t('landing.plans.p1.title')}</h3>
              <p className="text-[12.5px] text-[#756F66] leading-snug">
                {t('landing.plans.p1.desc')}
              </p>
            </div>

            <div>
              <div className="mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F0E8] border border-[#D8D0C1] text-[11px] font-semibold text-[#1D1B19]">
                  {t('landing.plans.p1.badge')}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#D8D0C1]/60 flex items-center justify-between">
                <button 
                  onClick={() => handleOpenPlanModal('01')}
                  className="text-[12.5px] font-bold text-[#861F2B] group-hover:text-[#641722] flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('landing.explorePlan')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 02 */}
          <div className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-[#B9933F] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-[240px] group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[12px] font-bold font-mono text-[#B9933F]">02</span>
                <div className="w-7 h-7 rounded-lg bg-[#861F2B]/8 flex items-center justify-center text-[#861F2B]">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                </div>
              </div>

              <h3 className="text-[16.5px] font-bold text-[#1D1B19] mb-1">{t('landing.plans.p2.title')}</h3>
              <p className="text-[12.5px] text-[#756F66] leading-snug">
                {t('landing.plans.p2.desc')}
              </p>
            </div>

            <div>
              <div className="mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F0E8] border border-[#D8D0C1] text-[11px] font-semibold text-[#1D1B19]">
                  {t('landing.plans.p2.badge')}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#D8D0C1]/60 flex items-center justify-between">
                <button 
                  onClick={() => handleOpenPlanModal('02')}
                  className="text-[12.5px] font-bold text-[#861F2B] group-hover:text-[#641722] flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('landing.explorePlan')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 03 */}
          <div className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-[#B9933F] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-[240px] group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[12px] font-bold font-mono text-[#B9933F]">03</span>
                <div className="w-7 h-7 rounded-lg bg-[#285846]/10 flex items-center justify-center text-[#285846]">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                </div>
              </div>

              <h3 className="text-[16.5px] font-bold text-[#1D1B19] mb-1">{t('landing.plans.p3.title')}</h3>
              <p className="text-[12.5px] text-[#756F66] leading-snug">
                {t('landing.plans.p3.desc')}
              </p>
            </div>

            <div>
              <div className="mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F0E8] border border-[#D8D0C1] text-[11px] font-semibold text-[#1D1B19]">
                  {t('landing.plans.p3.badge')}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#D8D0C1]/60 flex items-center justify-between">
                <button 
                  onClick={() => handleOpenPlanModal('03')}
                  className="text-[12.5px] font-bold text-[#861F2B] group-hover:text-[#641722] flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('landing.explorePlan')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 04 */}
          <div className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-[#B9933F] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-[240px] group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[12px] font-bold font-mono text-[#B9933F]">04</span>
                <div className="w-7 h-7 rounded-lg bg-[#B9933F]/10 flex items-center justify-center text-[#B9933F]">
                  <span className="material-symbols-outlined text-[16px]">savings</span>
                </div>
              </div>

              <h3 className="text-[16.5px] font-bold text-[#1D1B19] mb-1">{t('landing.plans.p4.title')}</h3>
              <p className="text-[12.5px] text-[#756F66] leading-snug">
                {t('landing.plans.p4.desc')}
              </p>
            </div>

            <div>
              <div className="mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F0E8] border border-[#D8D0C1] text-[11px] font-semibold text-[#1D1B19]">
                  {t('landing.plans.p4.badge')}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#D8D0C1]/60 flex items-center justify-between">
                <button 
                  onClick={() => handleOpenPlanModal('04')}
                  className="text-[12.5px] font-bold text-[#861F2B] group-hover:text-[#641722] flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('landing.explorePlan')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 05 */}
          <div className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-[#B9933F] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-[240px] group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[12px] font-bold font-mono text-[#B9933F]">05</span>
                <div className="w-7 h-7 rounded-lg bg-[#861F2B]/8 flex items-center justify-center text-[#861F2B]">
                  <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                </div>
              </div>

              <h3 className="text-[16.5px] font-bold text-[#1D1B19] mb-1">{t('landing.plans.p5.title')}</h3>
              <p className="text-[12.5px] text-[#756F66] leading-snug">
                {t('landing.plans.p5.desc')}
              </p>
            </div>

            <div>
              <div className="mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F0E8] border border-[#D8D0C1] text-[11px] font-semibold text-[#1D1B19]">
                  {t('landing.plans.p5.badge')}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#D8D0C1]/60 flex items-center justify-between">
                <button 
                  onClick={() => handleOpenPlanModal('05')}
                  className="text-[12.5px] font-bold text-[#861F2B] group-hover:text-[#641722] flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('landing.explorePlan')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 06 */}
          <div className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-[#B9933F] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-[240px] group">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[12px] font-bold font-mono text-[#B9933F]">06</span>
                <div className="w-7 h-7 rounded-lg bg-[#285846]/10 flex items-center justify-center text-[#285846]">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                </div>
              </div>

              <h3 className="text-[16.5px] font-bold text-[#1D1B19] mb-1">{t('landing.plans.p6.title')}</h3>
              <p className="text-[12.5px] text-[#756F66] leading-snug">
                {t('landing.plans.p6.desc')}
              </p>
            </div>

            <div>
              <div className="mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F0E8] border border-[#D8D0C1] text-[11px] font-semibold text-[#1D1B19]">
                  {t('landing.plans.p6.badge')}
                </span>
              </div>
              <div className="pt-2.5 border-t border-[#D8D0C1]/60 flex items-center justify-between">
                <button 
                  onClick={() => handleOpenPlanModal('06')}
                  className="text-[12.5px] font-bold text-[#861F2B] group-hover:text-[#641722] flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('landing.explorePlan')}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. ONE PROMOTIONAL CALLOUT (Height ~220px) */}
      <section className="bg-[#FFFDF8] border-y border-[#D8D0C1]/80 py-10 px-6 md:px-12 my-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 min-h-[140px]">
          
          {/* Left Text */}
          <div className="space-y-2 max-w-[620px] text-left">
            <h2 className="text-[26px] sm:text-[32px] font-bold text-[#1D1B19] tracking-tight">
              {t('landing.startWhereYouAre')}
            </h2>
            <p className="text-[14px] text-[#756F66] leading-relaxed">
              {t('landing.calloutDesc')}
            </p>
          </div>

          {/* Right Visual & Button */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <span className="text-[32px] font-extrabold text-[#861F2B] block leading-none">₹10/day</span>
              <span className="text-[11px] font-semibold text-[#756F66] block mt-1">Starting point shown in selected plans</span>
            </div>
            <button
              onClick={() => scrollToSection('plans')}
              className="h-11 px-6 bg-[#861F2B] hover:bg-[#641722] text-[#FFFDF8] font-bold text-[13px] tracking-wide uppercase rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            >
              {t('landing.exploreAllPlans')}
            </button>
          </div>

        </div>
      </section>

      {/* 6. WHY BHAGWN SOLUTIONS (Compact Horizontal Row, Height ~180px) */}
      <section id="why-us" className="py-10 px-6 md:px-12 max-w-[1240px] mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-[22px] font-bold text-[#1D1B19] tracking-tight">
            {t('landing.whyBhagwnTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          
          <div 
            onClick={() => triggerToast && triggerToast("Bhagwn Solutions offers 6 flexible investment categories.")}
            className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-4 cursor-pointer hover:border-[#B9933F] transition-all space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-mono text-[#B9933F]">01</span>
              <span className="material-symbols-outlined text-[#B9933F] text-[20px]">grid_view</span>
            </div>
            <h3 className="text-[14px] font-bold text-[#1D1B19]">{t('landing.multiplePlans')}</h3>
            <p className="text-[11.5px] text-[#756F66] leading-tight">{t('landing.multiplePlansDesc')}</p>
          </div>

          <div 
            onClick={() => triggerToast && triggerToast("Contributions start as low as ₹10 or ₹50 daily.")}
            className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-4 cursor-pointer hover:border-[#B9933F] transition-all space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-mono text-[#B9933F]">02</span>
              <span className="material-symbols-outlined text-[#861F2B] text-[20px]">tune</span>
            </div>
            <h3 className="text-[14px] font-bold text-[#1D1B19]">{t('landing.flexibleOptions')}</h3>
            <p className="text-[11.5px] text-[#756F66] leading-tight">{t('landing.flexibleOptionsDesc')}</p>
          </div>

          <div 
            onClick={() => triggerToast && triggerToast("All plans follow transparent maturity timetables.")}
            className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-4 cursor-pointer hover:border-[#B9933F] transition-all space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-mono text-[#B9933F]">03</span>
              <span className="material-symbols-outlined text-[#285846] text-[20px]">account_tree</span>
            </div>
            <h3 className="text-[14px] font-bold text-[#1D1B19]">{t('landing.structuredInvestment')}</h3>
            <p className="text-[11.5px] text-[#756F66] leading-tight">{t('landing.structuredInvestmentDesc')}</p>
          </div>

          <div 
            onClick={() => triggerToast && triggerToast("Contact helpdesk anytime via Support Portal.")}
            className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-4 cursor-pointer hover:border-[#B9933F] transition-all space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-mono text-[#B9933F]">04</span>
              <span className="material-symbols-outlined text-[#B9933F] text-[20px]">support_agent</span>
            </div>
            <h3 className="text-[14px] font-bold text-[#1D1B19]">{t('landing.customerSupport')}</h3>
            <p className="text-[11.5px] text-[#756F66] leading-tight">{t('landing.customerSupportDesc')}</p>
          </div>

        </div>
      </section>

      {/* 7. FINAL CTA (~180px Height) */}
      <section id="contact" className="bg-[#861F2B] text-[#FFFDF8] py-10 px-6 text-center">
        <div className="max-w-[600px] mx-auto space-y-4">
          <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight">
            {t('landing.readyToExplore')}
          </h2>
          <p className="text-[14px] text-[#FFFDF8]/80">
            {t('landing.readySubheading')}
          </p>
          <div className="pt-1">
            <button
              onClick={onGetStarted}
              className="bg-[#B9933F] hover:bg-[#a38232] text-[#1D1B19] font-bold py-3 px-8 rounded-xl text-[13.5px] tracking-wide uppercase transition-all cursor-pointer shadow-md"
            >
              {t('common.getStarted')}
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (Clean & Compact) */}
      <footer className="py-10 bg-[#FFFDF8] border-t border-[#D8D0C1]/80 text-[#756F66] px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* Left */}
          <div className="space-y-2">
            <img src="/logo.png" alt="Bhagwn Solutions" className="h-11 w-auto object-contain mb-1" />
            <p className="text-[11px] font-bold text-[#B9933F] uppercase tracking-wider">
              {t('common.tagline')}
            </p>
          </div>

          {/* Middle */}
          <div>
            <h4 className="text-[13px] font-bold text-[#1D1B19] mb-2.5">{t('landing.quickLinks')}</h4>
            <ul className="space-y-1.5 text-[12.5px]">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-[#861F2B] transition-colors text-left cursor-pointer">{t('landing.aboutUs')}</button></li>
              <li><button onClick={() => scrollToSection('plans')} className="hover:text-[#861F2B] transition-colors text-left cursor-pointer">{t('landing.solutions')}</button></li>
              <li><button onClick={() => scrollToSection('why-us')} className="hover:text-[#861F2B] transition-colors text-left cursor-pointer">{t('landing.ourPhilosophy')}</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-[#861F2B] transition-colors text-left cursor-pointer">Contact</button></li>
            </ul>
          </div>

          {/* Right */}
          <div>
            <h4 className="text-[13px] font-bold text-[#1D1B19] mb-2.5">{t('landing.policies')}</h4>
            <ul className="space-y-1.5 text-[12.5px]">
              <li><button onClick={() => triggerToast && triggerToast("Viewing Terms & Conditions")} className="hover:text-[#861F2B] transition-colors text-left cursor-pointer">Terms</button></li>
              <li><button onClick={() => triggerToast && triggerToast("Viewing Privacy Policy")} className="hover:text-[#861F2B] transition-colors text-left cursor-pointer">Privacy</button></li>
            </ul>
          </div>

        </div>

        <div className="max-w-[1200px] mx-auto pt-4 border-t border-[#D8D0C1]/50 text-center text-[11.5px] space-y-1">
          <p>© 2026 Bhagwn Solutions. All rights reserved.</p>
          <p className="text-[10.5px] text-[#756F66]/80">{t('landing.disclaimer')}</p>
        </div>
      </footer>

      {/* 9. PLAN PREVIEW MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1B19]/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFDF8] border-2 border-[#B9933F] rounded-2xl shadow-2xl p-6 w-full max-w-[440px] space-y-4 relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-[#756F66] hover:text-[#1D1B19] text-[20px] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${selectedPlan.bg} ${selectedPlan.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[22px]">{selectedPlan.icon}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#B9933F] uppercase">{t(selectedPlan.tagKey)}</span>
                <h3 className="text-[18px] font-bold text-[#1D1B19]">{t(selectedPlan.titleKey)}</h3>
              </div>
            </div>

            {/* Content Details */}
            <p className="text-[13.5px] text-[#756F66] leading-relaxed">
              {t(selectedPlan.descKey)}
            </p>

            <div className="bg-[#F4F0E8] border border-[#D8D0C1] rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#756F66]">Contribution Threshold:</span>
                <span className="font-bold text-[#1D1B19]">{selectedPlan.min}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#756F66]">Return Schedule:</span>
                <span className="font-bold text-[#861F2B]">{selectedPlan.returns}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSelectPlanAction(selectedPlan)}
                className="flex-1 h-11 bg-[#861F2B] hover:bg-[#641722] text-[#FFFDF8] font-bold text-[13.5px] rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                {t('landing.selectAndInvest')}
              </button>
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-4 h-11 border border-[#D8D0C1] text-[#1D1B19] font-semibold text-[13.5px] rounded-xl hover:bg-[#F4F0E8] cursor-pointer transition-colors"
              >
                {t('landing.close')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default LandingPage;
