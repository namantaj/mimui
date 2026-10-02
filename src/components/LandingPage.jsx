import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SplitText from './SplitText';

function LandingPage({ onGetStarted, _setRoute, triggerToast, darkMode, toggleDarkMode }) {
  const { t, locale, switchLanguage } = useLanguage();
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  const planMetaMap = {
    '01': {
      id: '01',
      icon: 'account_balance_wallet',
      color: 'text-[#B9933F]',
      bg: 'bg-[#B9933F]/10',
      border: 'border-[#B9933F]'
    },
    '02': {
      id: '02',
      icon: 'calendar_today',
      color: 'text-[#861F2B]',
      bg: 'bg-[#861F2B]/10',
      border: 'border-[#861F2B]'
    },
    '03': {
      id: '03',
      icon: 'trending_up',
      color: 'text-[#285846]',
      bg: 'bg-[#285846]/10',
      border: 'border-[#285846]'
    },
    '04': {
      id: '04',
      icon: 'savings',
      color: 'text-[#B9933F]',
      bg: 'bg-[#B9933F]/10',
      border: 'border-[#B9933F]'
    },
    '05': {
      id: '05',
      icon: 'lock_clock',
      color: 'text-[#861F2B]',
      bg: 'bg-[#861F2B]/10',
      border: 'border-[#861F2B]'
    },
    '06': {
      id: '06',
      icon: 'payments',
      color: 'text-[#285846]',
      bg: 'bg-[#285846]/10',
      border: 'border-[#285846]'
    },
    '07': {
      id: '07',
      icon: 'account_balance',
      color: 'text-[#B9933F]',
      bg: 'bg-[#B9933F]/10',
      border: 'border-[#B9933F]'
    }
  };

  const handleOpenPlanModal = (planId) => {
    setSelectedPlanId(planId);
  };

  const handleSelectPlanAction = (planTitle) => {
    setSelectedPlanId(null);
    if (triggerToast) {
      triggerToast(`Selected ${planTitle}. Proceeding to registration...`);
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
        <div className="w-full lg:w-[45%] flex flex-col justify-center items-start space-y-4 text-left shrink-0">
          
          {/* Small Eyebrow */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9933F] block">BHAGWN SOLUTIONS</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#756F66] block">{t('landing.eyebrowTag')}</span>
          </div>

          {/* Main Headline */}
          <h1 key={locale} className="text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.12] font-bold tracking-tight text-[#1D1B19]">
            <span className="block">
              <SplitText
                text={t('landing.startSmall')}
                splitType={locale === 'hi' ? 'words' : 'chars'}
                delay={50}
                duration={0.6}
                ease="power3.out"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="left"
                tag="span"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </span>
            <span className="block text-[#861F2B]">
              <SplitText
                text={t('landing.investSmart')}
                splitType={locale === 'hi' ? 'words' : 'chars'}
                delay={50}
                duration={0.6}
                ease="power3.out"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="left"
                tag="span"
              />
            </span>
            <span className="block">
              {locale === 'en' ? (
                <>
                  <SplitText
                    text="Build Your "
                    splitType="chars"
                    delay={50}
                    duration={0.6}
                    ease="power3.out"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="left"
                    tag="span"
                  />
                  <span className="text-[#B9933F] inline-block">
                    <SplitText
                      text="Future."
                      splitType="chars"
                      delay={50}
                      duration={0.6}
                      ease="power3.out"
                      from={{ opacity: 0, y: 40 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      rootMargin="-100px"
                      textAlign="left"
                      tag="span"
                    />
                  </span>
                </>
              ) : (
                <>
                  <SplitText
                    text="अपना "
                    splitType="words"
                    delay={50}
                    duration={0.6}
                    ease="power3.out"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="left"
                    tag="span"
                  />
                  <span className="text-[#B9933F] inline-block">
                    <SplitText
                      text="भविष्य बनाएं।"
                      splitType="words"
                      delay={50}
                      duration={0.6}
                      ease="power3.out"
                      from={{ opacity: 0, y: 40 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      rootMargin="-100px"
                      textAlign="left"
                      tag="span"
                    />
                  </span>
                </>
              )}
            </span>
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

        {/* Right Column: Dominant Rewards Visual + Clean Promotional Text Below */}
        <div className="w-full lg:w-[54%] flex flex-col items-center justify-center text-center shrink-0 relative">
          
          {/* 1. Dominant Rewards / Prices Image */}
          <div className="w-full max-w-[620px] relative flex items-center justify-center">
            <img 
              src="/hero_rewards_visual.png" 
              alt="Bhagwn Solutions Investment Rewards & Gifts" 
              className="w-full h-auto object-contain max-h-[440px] sm:max-h-[480px] transition-transform duration-500 hover:scale-[1.01]"
            />
          </div>

          {/* 2. Short Promotional Message Directly Below Image */}
          <div className="w-full max-w-[540px] mt-4 space-y-2 flex flex-col items-center">
            
            {/* Headline */}
            <h2 className="text-[24px] sm:text-[30px] lg:text-[34px] font-bold tracking-tight leading-tight text-[#1D1B19]">
              {t('landing.rewardsHeroHeadline1')} <span className="text-[#861F2B]">{t('landing.rewardsHeroHeadline2')}</span>
            </h2>

            {/* Supporting Sentence */}
            <p className="text-[14px] sm:text-[14.5px] leading-[1.5] text-[#756F66] max-w-[460px]">
              {t('landing.rewardsHeroSub')}
            </p>

            {/* Small Supporting Line */}
            <div className="pt-1 text-[12px] font-semibold text-[#B9933F] tracking-wide">
              {t('landing.exclusiveSub')}
            </div>

          </div>

        </div>

      </section>

      {/* 3. DIRECT SMOOTH TRANSITION TO INVESTMENT PLANS SECTION */}
      <section id="plans" className="pt-6 pb-16 px-6 md:px-12 max-w-[1240px] mx-auto">
        
        {/* Subtle Gold Line Separator */}
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

        {/* Investment Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {['01', '02', '03', '04', '05', '06', '07'].map((id) => {
            const planKey = `p${parseInt(id, 10)}`;
            const meta = planMetaMap[id];
            const isFeatured = id === '01';

            return (
              <div 
                key={id}
                className={`bg-[#FFFDF8] rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-[#B9933F] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-[240px] relative group ${
                  isFeatured ? 'border-2 border-[#B9933F]/60' : 'border border-[#D8D0C1]'
                }`}
              >
                {isFeatured && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded bg-[#B9933F]/15 text-[#B9933F] tracking-wider uppercase">
                    {t('landing.featured')}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-[12px] font-bold font-mono text-[#B9933F]">{id}</span>
                    <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center ${meta.color}`}>
                      <span className="material-symbols-outlined text-[16px]">{meta.icon}</span>
                    </div>
                  </div>

                  <h3 className="text-[16.5px] font-bold text-[#1D1B19] mb-1">{t(`landing.plans.${planKey}.title`)}</h3>
                  <p className="text-[12.5px] text-[#756F66] leading-snug">
                    {t(`landing.plans.${planKey}.desc`)}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F4F0E8] border border-[#D8D0C1] text-[11px] font-semibold text-[#1D1B19]">
                      {t(`landing.plans.${planKey}.badge`)}
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-[#D8D0C1]/60 flex items-center justify-between">
                    <button 
                      onClick={() => handleOpenPlanModal(id)}
                      className="text-[12.5px] font-bold text-[#861F2B] group-hover:text-[#641722] flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('landing.explorePlan')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

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

      {/* 6. WHY BHAGWN SOLUTIONS (Redesigned Premium 4-Card Feature Section) */}
      <section id="why-us" className="py-14 px-6 md:px-12 max-w-[1240px] mx-auto relative">
        
        {/* Subtle Background Decorative Arc */}
        <div className="w-80 h-80 rounded-full border border-[#B9933F]/10 absolute -top-10 -right-10 pointer-events-none hidden lg:block"></div>

        {/* Section Heading with SplitText & Gold Decorative Divider */}
        <div key={locale} className="text-center mb-10">
          <SplitText
            text={t('landing.whyBhagwnTitle')}
            className="text-2xl sm:text-[28px] font-bold text-center text-[#1D1B19]"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType={locale === 'hi' ? 'words' : 'chars'}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            tag="h2"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          {/* Subtle Decorative Gold Divider */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-[1px] bg-[#B9933F]/40"></div>
            <div className="w-2 h-2 rotate-45 border border-[#B9933F] bg-[#B9933F]/20"></div>
            <div className="w-12 h-[1px] bg-[#B9933F]/40"></div>
          </div>
        </div>

        {/* 4 Feature Cards Grid with Decorative Connecting Line */}
        <div className="relative">
          
          {/* Subtle Horizontal Decorative Dotted Line Behind Cards (Desktop) */}
          <div className="hidden md:block absolute top-[68px] left-[12%] right-[12%] h-[1px] border-t-2 border-dashed border-[#B9933F]/25 pointer-events-none z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
            
            {/* Card 01 */}
            <div 
              onClick={() => triggerToast && triggerToast("Bhagwn Solutions offers 6 flexible investment categories.")}
              className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-2xl p-6 shadow-xs hover:shadow-card-hover hover:border-[#B9933F] transition-all duration-300 relative group flex flex-col items-center justify-between min-h-[230px] cursor-pointer"
            >
              {/* Number Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#B9933F] text-[#FFFDF8] font-bold text-[11px] font-mono flex items-center justify-center border-2 border-[#FFFDF8] shadow-xs z-10">
                01
              </div>

              {/* Large Circular Icon Area */}
              <div className="w-14 h-14 rounded-full bg-[#F4F0E8] border border-[#D8D0C1]/80 flex items-center justify-center text-[#861F2B] mt-2 mb-3 group-hover:scale-105 group-hover:bg-[#FFFDF8] group-hover:border-[#B9933F]/60 transition-all shadow-2xs">
                <span className="material-symbols-outlined text-[24px] text-[#B9933F]">grid_view</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-[15px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.multiplePlans')}</h3>
                <p className="text-[12px] text-[#756F66] leading-relaxed">{t('landing.multiplePlansDesc')}</p>
              </div>

              {/* Decorative Accent Line */}
              <div className="w-8 h-[2px] bg-[#B9933F]/30 mt-4 group-hover:w-12 group-hover:bg-[#B9933F] transition-all"></div>
            </div>

            {/* Card 02 */}
            <div 
              onClick={() => triggerToast && triggerToast("Contributions start as low as ₹10 or ₹50 daily.")}
              className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-2xl p-6 shadow-xs hover:shadow-card-hover hover:border-[#B9933F] transition-all duration-300 relative group flex flex-col items-center justify-between min-h-[230px] cursor-pointer"
            >
              {/* Number Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#B9933F] text-[#FFFDF8] font-bold text-[11px] font-mono flex items-center justify-center border-2 border-[#FFFDF8] shadow-xs z-10">
                02
              </div>

              {/* Large Circular Icon Area */}
              <div className="w-14 h-14 rounded-full bg-[#F4F0E8] border border-[#D8D0C1]/80 flex items-center justify-center text-[#861F2B] mt-2 mb-3 group-hover:scale-105 group-hover:bg-[#FFFDF8] group-hover:border-[#B9933F]/60 transition-all shadow-2xs">
                <span className="material-symbols-outlined text-[24px] text-[#861F2B]">tune</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-[15px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.flexibleOptions')}</h3>
                <p className="text-[12px] text-[#756F66] leading-relaxed">{t('landing.flexibleOptionsDesc')}</p>
              </div>

              {/* Decorative Accent Line */}
              <div className="w-8 h-[2px] bg-[#B9933F]/30 mt-4 group-hover:w-12 group-hover:bg-[#B9933F] transition-all"></div>
            </div>

            {/* Card 03 */}
            <div 
              onClick={() => triggerToast && triggerToast("All plans follow transparent maturity timetables.")}
              className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-2xl p-6 shadow-xs hover:shadow-card-hover hover:border-[#B9933F] transition-all duration-300 relative group flex flex-col items-center justify-between min-h-[230px] cursor-pointer"
            >
              {/* Number Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#B9933F] text-[#FFFDF8] font-bold text-[11px] font-mono flex items-center justify-center border-2 border-[#FFFDF8] shadow-xs z-10">
                03
              </div>

              {/* Large Circular Icon Area */}
              <div className="w-14 h-14 rounded-full bg-[#F4F0E8] border border-[#D8D0C1]/80 flex items-center justify-center text-[#285846] mt-2 mb-3 group-hover:scale-105 group-hover:bg-[#FFFDF8] group-hover:border-[#B9933F]/60 transition-all shadow-2xs">
                <span className="material-symbols-outlined text-[24px] text-[#285846]">account_tree</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-[15px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.structuredInvestment')}</h3>
                <p className="text-[12px] text-[#756F66] leading-relaxed">{t('landing.structuredInvestmentDesc')}</p>
              </div>

              {/* Decorative Accent Line */}
              <div className="w-8 h-[2px] bg-[#B9933F]/30 mt-4 group-hover:w-12 group-hover:bg-[#B9933F] transition-all"></div>
            </div>

            {/* Card 04 */}
            <div 
              onClick={() => triggerToast && triggerToast("Contact helpdesk anytime via Support Portal.")}
              className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-2xl p-6 shadow-xs hover:shadow-card-hover hover:border-[#B9933F] transition-all duration-300 relative group flex flex-col items-center justify-between min-h-[230px] cursor-pointer"
            >
              {/* Number Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#B9933F] text-[#FFFDF8] font-bold text-[11px] font-mono flex items-center justify-center border-2 border-[#FFFDF8] shadow-xs z-10">
                04
              </div>

              {/* Large Circular Icon Area */}
              <div className="w-14 h-14 rounded-full bg-[#F4F0E8] border border-[#D8D0C1]/80 flex items-center justify-center text-[#B9933F] mt-2 mb-3 group-hover:scale-105 group-hover:bg-[#FFFDF8] group-hover:border-[#B9933F]/60 transition-all shadow-2xs">
                <span className="material-symbols-outlined text-[24px] text-[#B9933F]">support_agent</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-[15px] font-bold text-[#1D1B19] group-hover:text-[#861F2B] transition-colors">{t('landing.customerSupport')}</h3>
                <p className="text-[12px] text-[#756F66] leading-relaxed">{t('landing.customerSupportDesc')}</p>
              </div>

              {/* Decorative Accent Line */}
              <div className="w-8 h-[2px] bg-[#B9933F]/30 mt-4 group-hover:w-12 group-hover:bg-[#B9933F] transition-all"></div>
            </div>

          </div>
        </div>

      </section>

      {/* 7. REDESIGNED PREMIUM CTA SECTION */}
      <section id="contact" className="px-6 md:px-12 my-10 max-w-[1240px] mx-auto">
        <div className="bg-[#861F2B] text-[#FFFDF8] py-14 px-6 md:px-12 rounded-3xl relative overflow-hidden text-center shadow-card border border-[#B9933F]/30">
          
          {/* Subtle Corner Background Patterns & Glow */}
          <div className="bg-[radial-gradient(#B9933F_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-15 absolute top-0 left-0 w-36 h-36 pointer-events-none"></div>
          <div className="w-64 h-64 rounded-full border border-[#B9933F]/20 absolute -bottom-20 -right-20 pointer-events-none"></div>
          <div className="w-48 h-48 rounded-full border border-[#B9933F]/15 absolute -bottom-10 -right-10 pointer-events-none"></div>

          <div className="max-w-[620px] mx-auto space-y-4 relative z-10">
            
            {/* Small Decorative Ornament */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-[1px] bg-[#B9933F]/60"></div>
              <span className="material-symbols-outlined text-[#B9933F] text-[18px]">workspace_premium</span>
              <div className="w-8 h-[1px] bg-[#B9933F]/60"></div>
            </div>

            {/* Heading */}
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#FFFDF8]">
              {t('landing.readyToExplore')}
            </h2>

            {/* Supporting Text */}
            <p className="text-[14.5px] text-[#FFFDF8]/85 max-w-[500px] mx-auto leading-relaxed">
              {t('landing.readySubheading')}
            </p>

            {/* Button */}
            <div className="pt-3">
              <button
                onClick={onGetStarted}
                className="bg-[#FFFDF8] hover:bg-[#F4F0E8] text-[#861F2B] font-bold py-3.5 px-9 rounded-xl text-[13.5px] tracking-wide uppercase transition-all cursor-pointer shadow-lg border border-[#B9933F]/40 hover:scale-[1.02] inline-flex items-center gap-2"
              >
                <span>{t('common.getStarted')}</span>
                <span className="material-symbols-outlined text-[18px] text-[#861F2B]">arrow_forward</span>
              </button>
            </div>

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
      {selectedPlanId && (() => {
        const planKey = `p${parseInt(selectedPlanId, 10)}`;
        const planData = t(`landing.plans.${planKey}`);
        const meta = planMetaMap[selectedPlanId];
        if (!planData || !meta) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1B19]/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
            <div className="bg-[#FFFDF8] border-2 border-[#B9933F] rounded-2xl shadow-2xl p-6 sm:p-7 w-full max-w-[620px] max-h-[90vh] overflow-y-auto my-auto relative text-left space-y-5">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPlanId(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F0E8] hover:bg-[#EAE4D7] text-[#756F66] hover:text-[#1D1B19] flex items-center justify-center cursor-pointer transition-colors"
                aria-label={t('landing.close')}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-3.5 pr-8">
                <div className={`w-12 h-12 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                  <span className="material-symbols-outlined text-[26px]">{meta.icon}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-[#B9933F] uppercase block">{planData.tag}</span>
                  <h3 className="text-[20px] sm:text-[22px] font-extrabold text-[#1D1B19] leading-tight">{planData.title}</h3>
                  <p className="text-[13px] text-[#756F66] mt-1 leading-relaxed">{planData.overview}</p>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-3 bg-[#F4F0E8] border border-[#D8D0C1] rounded-xl p-3.5 sm:p-4 text-[13px]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F66] block">{t('landing.plans.minInvestment')}</span>
                  <span className="font-bold text-[#1D1B19] text-[14px]">{planData.min}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F66] block">{t('landing.plans.investmentType')}</span>
                  <span className="font-bold text-[#1D1B19] text-[14px]">{planData.type}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F66] block">{t('landing.plans.tenure')}</span>
                  <span className="font-bold text-[#861F2B] text-[14px]">{planData.tenure}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F66] block">{t('landing.plans.payoutSchedule')}</span>
                  <span className="font-bold text-[#285846] text-[14px]">{planData.payout}</span>
                </div>
              </div>

              {/* Allocated Sectors (if Plan 01) */}
              {planData.sectors && (
                <div className="space-y-2">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#B9933F] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                    <span>{t('landing.plans.allocatedSectors')}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {planData.sectors.map((sec, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#F4F0E8] border border-[#D8D0C1] text-[12px] font-semibold text-[#1D1B19]">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {planData.features && (
                <div className="space-y-2">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1D1B19] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#B9933F]">stars</span>
                    <span>{t('landing.plans.keyFeatures')}</span>
                  </h4>
                  <ul className="space-y-2 text-[13px] text-[#1D1B19]">
                    {planData.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#861F2B] text-[16px] shrink-0 mt-0.5">check_circle</span>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Special Offer Cards for Daily Return Plan (03) */}
              {selectedPlanId === '03' && planData.offerA && planData.offerB && (
                <div className="space-y-3 pt-1">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1D1B19] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#285846]">table_chart</span>
                    <span>{t('landing.plans.planExample')}</span>
                  </h4>
                  
                  {/* Offer A */}
                  <div className="bg-[#FFFDF8] border border-[#D8D0C1] rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[12px] font-bold text-[#861F2B] uppercase tracking-wider block">{planData.offerA.title}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12.5px] pt-1">
                      <div className="bg-[#F4F0E8] p-2 rounded-lg"><span className="text-[#756F66] block text-[11px]">Investment</span><strong className="text-[#1D1B19]">{planData.offerA.min}</strong></div>
                      <div className="bg-[#F4F0E8] p-2 rounded-lg"><span className="text-[#756F66] block text-[11px]">Daily Payout</span><strong className="text-[#285846]">{planData.offerA.daily}</strong></div>
                      <div className="bg-[#F4F0E8] p-2 rounded-lg"><span className="text-[#756F66] block text-[11px]">Referral Bonus</span><strong className="text-[#B9933F]">{planData.offerA.ref}</strong></div>
                    </div>
                    {planData.offerA.details && (
                      <p className="text-[12px] text-[#756F66] pt-1 leading-snug">{planData.offerA.details}</p>
                    )}
                    {planData.offerA.gold && (
                      <p className="text-[12px] font-semibold text-[#B9933F] pt-0.5">{planData.offerA.gold}</p>
                    )}
                  </div>

                  {/* Offer B */}
                  <div className="bg-[#FFFDF8] border-2 border-[#B9933F]/40 rounded-xl p-3.5 space-y-2 bg-gradient-to-br from-[#FFFDF8] to-[#F4F0E8]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#B9933F] uppercase tracking-wider">{planData.offerB.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#B9933F] text-[#FFFDF8]">PROMOTIONAL OFFER</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[12px]">
                      <div className="bg-[#FFFDF8] border border-[#D8D0C1] p-2 rounded-lg"><span className="text-[#756F66] block text-[10.5px]">Min Deposit</span><strong className="text-[#1D1B19]">{planData.offerB.min}</strong></div>
                      <div className="bg-[#FFFDF8] border border-[#D8D0C1] p-2 rounded-lg"><span className="text-[#756F66] block text-[10.5px]">Duration</span><strong className="text-[#1D1B19]">{planData.offerB.duration}</strong></div>
                      <div className="bg-[#FFFDF8] border border-[#D8D0C1] p-2 rounded-lg"><span className="text-[#756F66] block text-[10.5px]">Daily R.O.I</span><strong className="text-[#285846]">{planData.offerB.daily}</strong></div>
                      <div className="bg-[#FFFDF8] border border-[#D8D0C1] p-2 rounded-lg"><span className="text-[#756F66] block text-[10.5px]">Monthly Return</span><strong className="text-[#1D1B19]">{planData.offerB.monthly}</strong></div>
                      <div className="bg-[#FFFDF8] border border-[#D8D0C1] p-2 rounded-lg"><span className="text-[#756F66] block text-[10.5px]">Total Return</span><strong className="text-[#861F2B]">{planData.offerB.totalPayout}</strong></div>
                      <div className="bg-[#FFFDF8] border border-[#D8D0C1] p-2 rounded-lg"><span className="text-[#756F66] block text-[10.5px]">Total Benefit Shown</span><strong className="text-[#B9933F]">{planData.offerB.netBenefit}</strong></div>
                    </div>
                    {planData.offerB.amendmentNotice && (
                      <div className="pt-1.5 text-[11.5px] font-bold text-[#861F2B] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px]">info</span>
                        <span>{planData.offerB.amendmentNotice}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Plan Tables (for Plans 02, 04, 05, 06) */}
              {planData.tableHeader && planData.tableRows && selectedPlanId !== '03' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#1D1B19] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#285846]">table_chart</span>
                      <span>{t('landing.plans.planExample')}</span>
                    </h4>
                    <span className="text-[10.5px] italic text-[#756F66]">{t('landing.plans.brochureDisclaimer')}</span>
                  </div>

                  <div className="overflow-x-auto border border-[#D8D0C1] rounded-xl bg-[#FFFDF8]">
                    <table className="w-full text-left border-collapse text-[12.5px]">
                      <thead>
                        <tr className="bg-[#F4F0E8] border-b border-[#D8D0C1] text-[#1D1B19] font-bold">
                          {Object.values(planData.tableHeader).map((head, idx) => (
                            <th key={idx} className="p-2.5 font-semibold text-[11.5px] uppercase tracking-wider">{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D8D0C1]/60 text-[#1D1B19]">
                        {planData.tableRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#F4F0E8]/50 transition-colors">
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className="p-2.5 font-medium">{val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Terms & Conditions Notice Box */}
              {planData.disclaimer && (
                <div className="bg-[#F4F0E8]/80 border border-[#D8D0C1] rounded-xl p-3 text-[11.5px] text-[#756F66] space-y-1">
                  <span className="font-bold text-[#861F2B] uppercase tracking-wider text-[10px] block">{t('landing.plans.termsHeader')}</span>
                  <p className="leading-snug">{planData.disclaimer}</p>
                </div>
              )}

              {/* Modal Footer CTAs */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleSelectPlanAction(planData.title)}
                  className="flex-1 h-11 bg-[#861F2B] hover:bg-[#641722] text-[#FFFDF8] font-bold text-[13.5px] uppercase tracking-wide rounded-xl shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t('landing.selectAndInvest')}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => setSelectedPlanId(null)}
                  className="px-5 h-11 border border-[#D8D0C1] hover:border-[#756F66] text-[#1D1B19] font-bold text-[13.5px] uppercase tracking-wide rounded-xl hover:bg-[#F4F0E8] cursor-pointer transition-colors"
                >
                  {t('landing.close')}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}

export default LandingPage;
