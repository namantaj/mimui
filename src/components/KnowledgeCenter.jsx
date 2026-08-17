import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function KnowledgeCenter({ triggerToast }) {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const materials = [
    { title: t('knowledge.doc1Title'), size: '12.4 MB', format: 'PDF', icon: 'present_to_all', desc: t('knowledge.doc1Desc') },
    { title: t('knowledge.doc2Title'), size: '4.8 MB', format: 'PDF', icon: 'menu_book', desc: t('knowledge.doc2Desc') },
    { title: t('knowledge.doc3Title'), size: '22.1 MB', format: 'ZIP', icon: 'photo_library', desc: t('knowledge.doc3Desc') },
    { title: t('knowledge.doc4Title'), size: '2.5 MB', format: 'PDF', icon: 'gavel', desc: t('knowledge.doc4Desc') }
  ];

  const faqs = [
    { q: t('knowledge.faq1Q'), a: t('knowledge.faq1A') },
    { q: t('knowledge.faq2Q'), a: t('knowledge.faq2A') },
    { q: t('knowledge.faq3Q'), a: t('knowledge.faq3A') },
    { q: t('knowledge.faq4Q'), a: t('knowledge.faq4A') }
  ];

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Title Header */}
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">{t('knowledge.title')}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{t('knowledge.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Resources Grid */}
        <div className="lg:col-span-2 space-y-md">
          <h3 className="font-title-sm text-title-sm text-on-surface">{t('knowledge.officialMedia')}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {materials.map((item, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="h-10 w-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-md">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <h4 className="font-bold text-body-md text-on-surface">{item.title}</h4>
                  <p className="text-body-sm text-on-surface-variant mt-xs leading-relaxed">{item.desc}</p>
                </div>

                <div className="flex items-center justify-between border-t border-outline-variant/50 pt-md mt-lg">
                  <span className="text-xs text-on-surface-variant font-semibold">{item.format} • {item.size}</span>
                  <button
                    onClick={() => triggerToast(`Downloading: ${item.title}`)}
                    className="bg-surface hover:bg-surface-container border border-outline-variant font-body-sm text-body-sm py-xs px-md rounded transition-colors flex items-center gap-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    {t('knowledge.download')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-fit">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-lg">{t('knowledge.faqs')}</h3>

          <div className="space-y-sm">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-outline-variant rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-md py-sm bg-surface-container-low flex justify-between items-center font-bold text-body-sm text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-sm transform transition-transform duration-200" style={isOpen ? { transform: 'rotate(180deg)' } : undefined}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-md bg-surface text-body-sm text-on-surface-variant border-t border-outline-variant/30 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeCenter;
