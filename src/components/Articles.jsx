import React, { useState } from 'react';

function Articles({ triggerToast }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Marketing', 'Sales Strategy', 'Onboarding', 'Mindset'];

  const articles = [
    {
      id: 1,
      title: '5 Steps to Double Your Referral Conversions',
      desc: 'Master the art of prospecting on social media and warm networks using our tested copy templates.',
      body: `Prospecting in network marketing is about solving problems, not pushing products. Here are the 5 actionable steps to double your conversions:

1. **Optimize Your Profile**: Before reaching out, ensure your social media bio and recent posts build credibility. Post high-value updates rather than corporate spam.
2. **Listen First, Pitch Second**: Ask questions to discover the prospect's pain points. Are they looking for secondary income? Do they have health goals?
3. **Use the "If I, Would You" Formula**: For example: "If I shared a quick 3-minute video explaining how our binary payout leg structure works, would you review it?"
4. **Follow Up within 24 Hours**: Put reminders in your calendar. A simple follow up: "Hey, did you get a chance to watch the video? What did you like best?"
5. **Handle Objections with "Feel, Felt, Found"**: "I understand how you feel. I felt the same way about the time requirement. But what I found was that the automated invite link allowed me to build this in just 5 hours a week."`,
      category: 'Marketing',
      readTime: '6 min read',
      date: 'July 26, 2026',
      author: 'Sophia Reynolds',
      role: 'Global Leader',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOnnsIyGQRXtdKlMlRbEOvUF5XvANm32XMz-jtADr_BM1ygV0rZYMrasrKyye-6D8SZfwOgEAWfSLRLWqhJQdyNTQ6PVGKpE8gRW9rHlDPeDmKt56eA0ei6EVyactjcBja2l0JFTBqR8bvyGPIZH91qWJoGplBRoGyXmXH4bCZchybK_k4PPZVT4N1tJKWrzCaAKcX-BW_8cp3VEEALcSYH-B59d8J2B1OxVZoy8F2qW8lqVKUhSaN'
    },
    {
      id: 2,
      title: 'Understanding Binary Match Legs Placement',
      desc: 'Learn how to place new recruits on your left and right legs to maximize monthly matching cycle bonuses.',
      body: `Understanding binary matching volumes is key to maximizing commissions. The binary payout plan matches Left Leg Volume (PV) against Right Leg Volume (PV).

1. **The Spillover Effect**: Upline members may place recruits on your outer power leg. This creates shared point volume.
2. **Balancing Your Legs**: If your Left Leg is at 18,500 PV and your Right Leg is at 19,900 PV, you are in a highly balanced state. You should place your next direct recruits on your weaker leg to balance the commission cycles.
3. **The 1/3 and 2/3 Rule**: Many binary structures calculate matches when one leg holds double the volume of the other. Our system matching bonuses matching commissions pay weekly upon reaching active cycles.
4. **Setting Default Placement**: In your Portal Settings, you can configure your default invite placement link to automatically route new clicks to your Left Leg, Right Leg, or auto-balance.`,
      category: 'Sales Strategy',
      readTime: '8 min read',
      date: 'July 20, 2026',
      author: 'Alexander Wright',
      role: 'Diamond Director',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe8oLmHDjQpBARIImVqHvbh-ono3iANmz82cN0HNIuMXp_uoyQ4ZIMNgWKt7U_gmgBcHnpsD9jOWfUuIIImIe_pzvTcDRcnmD2mUVk1twt8IvTMuNcV5CFoI61OZD5GEex2j1ycgdYeilCQ4ijjf1zAaULdttqOMrA3GCWb530NxxxkuKOMLU7dQf06irnQ0yH_Me8dAKADm-VLwOcU91AquzmvS_DdBPe3QK_9BC7ctdtEU_Xxje9'
    },
    {
      id: 3,
      title: 'onboarding Checklist: First 48 Hours',
      desc: 'Ensure your new downline member completes KYC, sets up their wallet, and shares their first referral link.',
      body: `A distributor's first 48 hours determine their long-term activity ratio. Follow this checklist for every new downline sign up:

1. **Verify KYC & Documents**: Ensure they submit their Driver's License or Passport inside the KYC tab. Withdrawals cannot be processed without approval.
2. **Configure Bank Accounts**: Help them fill out their SWIFT/IFSC codes under Bank Details.
3. **Share Referral Code**: Guide them to copy their referral URL from My Business and save it to their phone notepad.
4. **Launch Script Execution**: Draft their first invite script together: "Hey [Name], I just started a premium portal expansion project and thought of you. If I sent you my invite link, would you check it out?"
5. **Add to Team Chats**: Connect them to our communications portal and weekly webinar schedule.`,
      category: 'Onboarding',
      readTime: '5 min read',
      date: 'July 15, 2026',
      author: 'Michael Chang',
      role: 'Emerald Leader',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM-Gtz7xvOs0APxExRvyWq7M1Sv0uUdjFAEydJ06AULapwmBCb9Fq6oSUg9gg-VZY9J60nKcdZzTnFnCpIEp8HKTzkL73ZhBgySVlvKTorP1k6VqFee0lecUzmS0UfLPyLCHkxfXXhKs8mruJ_r09mfye2ML73CDTt20hsu1kwru1hGG9a56lNiahIpwUDoXAMah-L7B4rS1Z1FK4Dc0sq07Q-7mUtlAnxj74JtmJOFCxfcrLiPWD'
    },
    {
      id: 4,
      title: 'Developing a Diamond Director Mindset',
      desc: 'Overcoming the rejection cycle and transitioning from a distributor to an organizational team builder.',
      body: `Achieving high ranking status requires a paradigm shift. Here is how leaders develop the Diamond Director mindset:

1. **Separate Value from Results**: Rejection of your referral link is not a rejection of you. It is simply a statement of timing from the prospect.
2. **Focus on Consistency over Intensity**: Sponsoring 2 members a month for 12 months is infinitely better than sponsoring 10 members in week one and quitting in week two. Consistent inputs build team trust.
3. **Duplicate Leadership**: Do not be the bottleneck. Train your Level 1 directs to host onboarding sessions themselves. True success is measured by how well your team performs when you are offline.
4. **Invest in Personal Development**: Spend 20 minutes a day reading training articles, compliance rules, and strategy guides. A knowledgeable sponsor is an attractive leader.`,
      category: 'Mindset',
      readTime: '7 min read',
      date: 'July 02, 2026',
      author: 'Sophia Reynolds',
      role: 'Global Leader',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOnnsIyGQRXtdKlMlRbEOvUF5XvANm32XMz-jtADr_BM1ygV0rZYMrasrKyye-6D8SZfwOgEAWfSLRLWqhJQdyNTQ6PVGKpE8gRW9rHlDPeDmKt56eA0ei6EVyactjcBja2l0JFTBqR8bvyGPIZH91qWJoGplBRoGyXmXH4bCZchybK_k4PPZVT4N1tJKWrzCaAKcX-BW_8cp3VEEALcSYH-B59d8J2B1OxVZoy8F2qW8lqVKUhSaN'
    }
  ];

  // Filtering Logic
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-xs dark:text-slate-100">Educational Articles</h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Discover recruitment playbooks, onboarding templates, and technical explanations from top earners.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64 shrink-0">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-xl pr-sm py-xs bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-800 text-on-surface dark:text-slate-200 font-body-sm text-body-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20" 
            placeholder="Search article..." 
            type="text"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-sm overflow-x-auto hide-scrollbar pb-xs">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-lg py-xs text-body-sm rounded-full border transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat 
                ? 'bg-primary text-on-primary border-primary dark:bg-blue-600 dark:border-blue-600' 
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-low dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-850'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {filteredArticles.map(art => (
          <div 
            key={art.id} 
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800"
          >
            <div>
              <div className="flex items-center justify-between gap-md mb-md">
                <span className="bg-primary/10 text-primary dark:bg-blue-500/10 dark:text-blue-400 text-[10px] font-bold py-0.5 px-md rounded-full uppercase tracking-wider">
                  {art.category}
                </span>
                <span className="text-xs text-on-surface-variant dark:text-slate-500">{art.readTime}</span>
              </div>

              <h4 
                onClick={() => setSelectedArticle(art)}
                className="font-bold text-body-md text-on-surface hover:text-primary dark:text-slate-100 dark:hover:text-blue-400 cursor-pointer line-clamp-2"
              >
                {art.title}
              </h4>
              <p className="text-body-sm text-on-surface-variant dark:text-slate-400 mt-sm leading-relaxed line-clamp-3">
                {art.desc}
              </p>
            </div>

            {/* Author details */}
            <div className="flex items-center justify-between border-t border-outline-variant/50 pt-md mt-lg dark:border-slate-800">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shrink-0 dark:border-slate-800">
                  <img src={art.avatar} alt={art.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-on-surface dark:text-slate-200">{art.author}</h5>
                  <p className="text-[10px] text-on-surface-variant dark:text-slate-500">{art.role}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedArticle(art)}
                className="text-primary hover:text-primary-container font-title-sm text-body-sm font-semibold flex items-center gap-xs cursor-pointer dark:text-blue-400 dark:hover:text-blue-500"
              >
                Read Article
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
        {filteredArticles.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-xl text-on-surface-variant dark:text-slate-500">
            No articles found matching "{searchQuery}" under "{activeCategory}".
          </div>
        )}
      </div>

      {/* Article Read Modal Dialog */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-md animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl w-full max-w-[640px] max-h-[85vh] overflow-hidden flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
            
            {/* Header */}
            <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between shrink-0 dark:border-slate-800">
              <div className="flex items-center gap-sm flex-wrap">
                <span className="bg-primary/10 text-primary dark:bg-blue-500/10 dark:text-blue-400 text-[10px] font-bold py-0.5 px-md rounded-full uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-on-surface-variant dark:text-slate-500">{selectedArticle.readTime} • Published {selectedArticle.date}</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Article Body */}
            <div className="p-lg space-y-lg overflow-y-auto flex-1">
              <div>
                <h3 className="font-bold text-title-sm md:text-headline-md text-on-surface dark:text-slate-100 leading-snug">{selectedArticle.title}</h3>
                
                {/* Author card inside */}
                <div className="flex items-center gap-sm mt-md">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shrink-0 dark:border-slate-800">
                    <img src={selectedArticle.avatar} alt={selectedArticle.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-on-surface dark:text-slate-200">{selectedArticle.author}</h5>
                    <p className="text-[10px] text-on-surface-variant dark:text-slate-500">{selectedArticle.role}</p>
                  </div>
                </div>
              </div>

              <div className="text-body-sm text-on-surface-variant dark:text-slate-300 leading-relaxed whitespace-pre-line border-t border-outline-variant/30 pt-md dark:border-slate-800">
                {selectedArticle.body}
              </div>
            </div>

            {/* Footer */}
            <div className="px-lg py-md bg-surface-container-low border-t border-outline-variant/30 shrink-0 dark:bg-slate-850 dark:border-slate-800/30 flex justify-between items-center">
              <span className="text-xs text-on-surface-variant dark:text-slate-500">MLM Education Library</span>
              <button 
                onClick={() => {
                  setSelectedArticle(null);
                  triggerToast("Article marked as read");
                }}
                className="bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold py-xs px-md rounded transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Articles;
