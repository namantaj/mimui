import React from 'react';

function LandingPage({ onGetStarted, darkMode, toggleDarkMode }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6]/30 text-[#111c2d] antialiased selection:bg-blue-600/10 dark:bg-slate-950 dark:text-slate-100 font-sans">

      {/* Dynamic Keyframes for Floating Card */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes floatCard {
          0% { transform: translateY(0px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-0.5deg); }
          100% { transform: translateY(0px) rotate(1deg); }
        }
        .animate-float-illustration {
          animation: floatCard 6s ease-in-out infinite;
        }
      `}} />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 dark:bg-slate-900/80 dark:border-slate-800 z-50 flex items-center justify-between px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl text-blue-800 tracking-tight dark:text-blue-400">MLM Enterprise</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-350">
          <a href="#product" className="hover:text-blue-700 transition-colors border-b-2 border-blue-700 pb-1">Product</a>
          <a href="#solutions" className="hover:text-blue-700 transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-blue-700 transition-colors">Pricing</a>
          <button onClick={onGetStarted} className="hover:text-blue-700 transition-colors font-semibold cursor-pointer">Log In</button>
        </nav>

        {/* Right Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="text-slate-655 hover:text-blue-800 transition-colors dark:text-slate-400 dark:hover:text-blue-400 flex items-center cursor-pointer"
          >
            <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button
            onClick={onGetStarted}
            className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-[1px] cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 text-sm"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section - Refactored as requested */}
      <section id="product" className="pt-[140px] pb-[80px] px-6 md:px-[64px] w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 min-h-[90vh] overflow-hidden">

        {/* Left Column: Hero Text (45% Width) */}
        <div className="w-full md:w-[45%] flex flex-col justify-center space-y-6 text-center md:text-left items-center md:items-start shrink-0">
          <h1 className="font-extrabold text-[36px] md:text-[48px] lg:text-[72px] xl:text-[80px] leading-[1.1] tracking-tight text-slate-900 dark:text-slate-100">
            Build a Network <br />
            <span className="text-blue-800 dark:text-blue-400">That Actually</span> <br />
            <span className="text-amber-600 dark:text-amber-500">Works</span>
          </h1>

          <p className="text-[18px] md:text-[20px] leading-[1.7] text-slate-500 dark:text-slate-400 max-w-[600px] w-full">
            Professional-grade infrastructure for modern organizations focused on sustainable growth and compliance. Stop wrestling with legacy software and start scaling with precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto h-[52px] px-8 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold flex items-center justify-center cursor-pointer transition-colors shadow-md text-sm shrink-0"
            >
              Get Started
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto h-[52px] px-8 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-300 font-semibold flex items-center justify-center transition-colors text-sm shrink-0"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Right Column: Hierarchical Org Node Graphic (55% Width) */}
        <div className="w-full md:w-[55%] flex items-center justify-center lg:justify-end relative shrink-0">
          {/* Proportional graphic card box */}
          <div className="relative w-full max-w-[440px] aspect-[4/3] flex items-center justify-center">

            {/* Soft Blue background glow */}
            <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0"></div>

            {/* Floating Graphic Card */}
            <div className="relative bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full z-10 animate-float-illustration">

              {/* Top Bar Circles */}
              <div className="flex gap-1.5 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              </div>

              {/* Hierarchical Structure Drawing */}
              <div className="flex flex-col items-center py-6 space-y-6 relative">
                {/* Upline Node */}
                <div className="w-12 h-12 rounded-full bg-blue-800 dark:bg-blue-600 flex items-center justify-center text-white shadow-lg relative z-20">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>

                {/* Line connector down */}
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 relative z-10"></div>

                {/* Horizontal line connector */}
                <div className="absolute top-[80px] left-[15%] right-[15%] h-[1px] bg-slate-200 dark:bg-slate-700 z-10"></div>

                {/* Downline Nodes */}
                <div className="flex justify-between w-full px-8 relative z-20">
                  {/* Node 1 (Orange/Gold) */}
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>

                  {/* Node 2 (Blue) */}
                  <div className="w-10 h-10 rounded-full bg-blue-800 dark:bg-blue-600 flex items-center justify-center text-white shadow-md">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>

                  {/* Node 3 (Blue) */}
                  <div className="w-10 h-10 rounded-full bg-blue-800 dark:bg-blue-600 flex items-center justify-center text-white shadow-md">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Feature List */}
          <div className="space-y-6 text-left w-full max-w-[600px]">
            <div>
              <span className="px-4 py-1 bg-amber-100 text-amber-850 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                Management Suite
              </span>
              <h2 className="font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-slate-100 mt-2">
                The Executive Dashboard
              </h2>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Gain unprecedented visibility into your entire organizational structure. From real-time volume tracking to predictive attrition analytics, we provide the tools needed for proactive leadership.
            </p>

            <ul className="space-y-4 text-sm font-semibold text-slate-700 dark:text-slate-350">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <span>Instant commission reconciliation and payout status.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <span>Grow your network effortlessly with personalized referral links and referral tracking.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <span>Automated regulatory reporting for multi-jurisdiction compliance.</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className="flex justify-center w-full max-w-[580px] mx-auto">
            <div className="bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-750 rounded-2xl shadow-xl p-4 overflow-hidden w-full group">
              <img
                src="/screen.png"
                alt="Executive Dashboard Mockup"
                className="w-full h-auto rounded-lg shadow-sm group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 text-center">
        <div className="max-w-[600px] mx-auto px-6 space-y-6">
          <h2 className="font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-slate-100">
            Transparent Compensation Modeling
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We believe in clarity over hype. Our compensation engine is mathematically verified to ensure long-term sustainability for both the company and its partners.
          </p>
          <div className="pt-4">
            <button
              onClick={onGetStarted}
              className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 text-sm"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;
