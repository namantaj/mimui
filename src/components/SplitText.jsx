import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SplitText = ({
  text = '',
  className = '',
  delay = 50,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  tag = 'span',
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Auto-detect Devanagari (Hindi) text to force grapheme-safe word-level animation
  const containsDevanagari = /[\u0900-\u097F]/.test(String(text));
  const effectiveSplitType = (splitType === 'auto' || containsDevanagari) ? 'words' : splitType;

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts && document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current;

      // Select targets based on effectiveSplitType
      const targets = effectiveSplitType === 'words' 
        ? el.querySelectorAll('.split-word')
        : el.querySelectorAll('.split-char');

      if (!targets.length) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const tween = gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        tween.kill();
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        effectiveSplitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const lines = text ? String(text).split('\n') : [];
  const Tag = tag || 'span';

  return (
    <Tag
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        display: 'inline-block',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        willChange: 'transform, opacity'
      }}
    >
      {lines.map((line, lIdx) => {
        const words = line.split(' ');
        return (
          <span
            key={lIdx}
            className="split-line inline-block"
            style={{ display: lines.length > 1 ? 'block' : 'inline-block' }}
          >
            {words.map((word, wIdx) => {
              if (effectiveSplitType === 'words') {
                return (
                  <React.Fragment key={wIdx}>
                    <span
                      className="split-word"
                      style={{
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        willChange: 'transform, opacity',
                        opacity: from.opacity !== undefined ? from.opacity : 0
                      }}
                    >
                      {word}
                    </span>
                    {wIdx < words.length - 1 && (
                      <span className="split-space" style={{ display: 'inline-block' }}>
                        &nbsp;
                      </span>
                    )}
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={wIdx}>
                  <span
                    className="split-word"
                    style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                  >
                    {Array.from(word).map((char, cIdx) => (
                      <span
                        key={cIdx}
                        className="split-char"
                        style={{
                          display: 'inline-block',
                          willChange: 'transform, opacity',
                          opacity: from.opacity !== undefined ? from.opacity : 0
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                  {wIdx < words.length - 1 && (
                    <span className="split-space" style={{ display: 'inline-block' }}>
                      &nbsp;
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
};

export default SplitText;
