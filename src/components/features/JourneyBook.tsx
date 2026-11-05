"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, List, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { journeyChapters } from "@/lib/journeyChapters";

const introLines = [
  "Some stories are not just told...",
  "They are passed from one generation to another...",
  "Stories of courage, hope, devotion and light.",
  "And tonight, you are invited to experience one.",
];

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: 8 + (index * 5.3) % 85,
  top: 18 + (index * 7.7) % 68,
  delay: (index % 5) * 0.4,
  duration: 5 + (index % 6),
}));

export function JourneyBook() {
  const { play } = useApp();
  const [introIndex, setIntroIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [turnDirection, setTurnDirection] = useState(1);
  const [isEnding, setIsEnding] = useState(false);

  const chapter = journeyChapters[activeIndex];
  const progress = ((activeIndex + 1) / journeyChapters.length) * 100;

  const goToChapter = useCallback(
    (nextIndex: number, direction: number) => {
      if (nextIndex < 0 || nextIndex >= journeyChapters.length) {
        return;
      }

      setTurnDirection(direction);
      setActiveIndex(nextIndex);
      setShowToc(false);
      play("open");
    },
    [play],
  );

  const goToPreviousChapter = useCallback(() => {
    if (activeIndex === 0) {
      return;
    }

    goToChapter(activeIndex - 1, -1);
  }, [activeIndex, goToChapter]);

  const goToNextChapter = useCallback(() => {
    if (activeIndex === journeyChapters.length - 1) {
      setTurnDirection(1);
      setIsEnding(true);
      play("open");
      return;
    }

    goToChapter(activeIndex + 1, 1);
  }, [activeIndex, goToChapter, play]);

  useEffect(() => {
    if (!showIntro) {
      return undefined;
    }

    const isTitleScreen = introIndex >= introLines.length;
    const timer = window.setTimeout(() => {
      if (isTitleScreen) {
        setShowIntro(false);
        return;
      }

      setIntroIndex((current) => current + 1);
    }, isTitleScreen ? 1800 : 1400);

    return () => window.clearTimeout(timer);
  }, [introIndex, showIntro]);

  useEffect(() => {
    if (showIntro || isEnding) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNextChapter();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPreviousChapter();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showIntro, isEnding, goToNextChapter, goToPreviousChapter]);

  const replayJourney = () => {
    setIntroIndex(0);
    setShowIntro(true);
    setShowToc(false);
    setIsEnding(false);
    setActiveIndex(0);
    setTurnDirection(1);
  };

  const displayedIntroLines = introLines.slice(0, Math.min(introIndex, introLines.length));

  return (
    <>
      {showIntro ? (
        <div className="journey-page-shell journey-intro-shell">
          <div className="journey-intro-glow" aria-hidden="true" />
          <div className="journey-intro-sequence" aria-live="polite">
            {displayedIntroLines.map((line, index) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.12 }}
                className="journey-intro-line"
              >
                {line}
              </motion.p>
            ))}

            {introIndex >= introLines.length ? (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="journey-title-stack"
              >
                <p className="journey-intro-kicker">THE STORY OF DIWALI</p>
                <h1 className="journey-intro-heading">A Journey Through Ten Chapters of Light</h1>
              </motion.div>
            ) : null}
          </div>

          <button type="button" className="journey-skip-button" onClick={() => setShowIntro(false)}>
            Skip Intro
          </button>
        </div>
      ) : isEnding ? (
        <div className="journey-page-shell journey-ending-shell">
          <div className="journey-ending-glow" aria-hidden="true" />
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="journey-particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}

          <motion.div
            className="journey-ending-book"
            initial={{ opacity: 0.5, scale: 1, rotateX: 0, y: 0 }}
            animate={{ opacity: 1, scale: 0.92, rotateX: 74, y: 16 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="journey-book-shell journey-book-shell-ending">
              <div className="journey-page journey-page-left">
                <div className="journey-image-frame">
                  <Image
                    src={journeyChapters[journeyChapters.length - 1].image}
                    alt={journeyChapters[journeyChapters.length - 1].title}
                    width={800}
                    height={1000}
                    priority
                    className="journey-image"
                  />
                </div>
              </div>
              <div className="journey-page journey-page-right">
                <p className="journey-chapter-label">CHAPTER 10</p>
                <h2 className="journey-book-title">A LIGHT WITHIN US</h2>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            className="journey-ending-content"
          >
            <div className="journey-diya">
              <span className="journey-diya-flame" />
            </div>
            <p className="journey-ending-message">
              May the light you celebrate tonight continue to shine within you, long after the diyas have faded.
            </p>
            <div className="journey-ending-actions">
              <button type="button" className="journey-primary-action" onClick={replayJourney}>
                Replay Journey
              </button>
              <Link href="/" className="journey-secondary-action">
                Return to Website
              </Link>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="journey-page-shell">
          <div className="journey-topbar">
            <div>
              <p className="journey-kicker">THE STORY OF DIWALI</p>
              <p className="journey-subtitle">A Journey Through Ten Chapters of Light</p>
            </div>
            <button type="button" className="journey-toc-button" onClick={() => setShowToc((value) => !value)}>
              <List size={16} />
              Contents
            </button>
          </div>

          <div className="journey-progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="journey-header-row">
            <p className="journey-status-text">Chapter {activeIndex + 1} of {journeyChapters.length}</p>
          </div>

          <AnimatePresence>
            {showToc ? (
              <motion.aside
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="journey-toc-panel"
              >
                <div className="journey-toc-header">
                  <span>Table of Contents</span>
                  <button type="button" onClick={() => setShowToc(false)}>
                    Close
                  </button>
                </div>
                <ul className="journey-toc-list">
                  {journeyChapters.map((item) => (
                    <li key={item.number}>
                      <button
                        type="button"
                        className={activeIndex === item.number - 1 ? "active" : ""}
                        onClick={() => goToChapter(item.number - 1, item.number - 1 > activeIndex ? 1 : -1)}
                      >
                        <span>0{item.number}</span>
                        <span>{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.aside>
            ) : null}
          </AnimatePresence>

          <div className="journey-book-stage">
            <AnimatePresence mode="wait">
              <motion.article
                key={chapter.number}
                initial={{ opacity: 0, x: turnDirection > 0 ? -30 : 30, rotateY: turnDirection > 0 ? -80 : 80 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: turnDirection > 0 ? 30 : -30, rotateY: turnDirection > 0 ? 80 : -80 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="journey-book-shell"
              >
                <div className="journey-page journey-page-left">
                  <div className="journey-image-frame">
                    <Image
                      src={chapter.image}
                      alt={`${chapter.title} illustration`}
                      width={1200}
                      height={1600}
                      priority={activeIndex === 0}
                      sizes="(max-width: 768px) 100vw, 56vw"
                      className="journey-image"
                    />
                  </div>
                  <div className="journey-page-caption">
                    <Sparkles size={12} />
                    <span>Chapter {chapter.number}</span>
                  </div>
                </div>

                <div className="journey-page journey-page-right">
                  <p className="journey-chapter-label">CHAPTER {String(chapter.number).padStart(2, "0")}</p>
                  <h1 className="journey-book-title">{chapter.title}</h1>
                  <div className="journey-rule" aria-hidden="true" />
                  <div className="journey-story-copy">
                    {chapter.text.split("\n\n").map((paragraph, index) => (
                      <p key={`${chapter.number}-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="journey-controls">
            <button
              type="button"
              className="journey-arrow-button"
              onClick={goToPreviousChapter}
              disabled={activeIndex === 0}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="journey-progress-pill">Chapter {activeIndex + 1} of {journeyChapters.length}</div>

            <button type="button" className="journey-arrow-button" onClick={goToNextChapter}>
              {activeIndex === journeyChapters.length - 1 ? "Finale" : "Next"}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
