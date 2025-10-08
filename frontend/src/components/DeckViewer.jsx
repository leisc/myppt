import React from "react";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const defaultDeckState = {
  title: "",
  subtitle: "",
  slides: []
};

const renderBullet = ({ label, description }, index) => (
  <li key={index}>
    <span className="highlight">{label}:</span> {description}
  </li>
);

const renderMetrics = (metrics = []) => (
  <div className="metric-grid">
    {metrics.map(({ value, label }, index) => (
      <div key={index} className="metric-card">
        <span className="metric-value">{value}</span>
        <span className="metric-label">{label}</span>
      </div>
    ))}
  </div>
);

const renderColumnItems = (items = []) => (
  <ul className="column-list">
    {items.map((item, index) => {
      if (item == null) return null;
      if (typeof item === "string") {
        return <li key={index}>{item}</li>;
      }

      const label = item.label || item.title;
      const description = item.description || item.detail;

      return (
        <li key={index}>
          {label && <strong>{label}</strong>}
          {description && <span>{description}</span>}
        </li>
      );
    })}
  </ul>
);

const renderTimelineActivities = (activities = []) => (
  <ul className="timeline-activities">
    {activities.map((activity, index) => (
      <li key={index}>{activity}</li>
    ))}
  </ul>
);

const SlideContent = ({ slide }) => {
  if (!slide) return null;

  switch (slide.layout) {
    case 'cover':
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          {slide.content?.tagline && <p className="slide-tagline">{slide.content.tagline}</p>}
        </div>
      );
    case "text":
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          {/* render a simple list of text items for the 'text' layout */}
          {slide.content?.items && (
            <ul className="slide-list">
              {slide.content.items.map((it, i) => (
                <li key={i}>{typeof it === 'string' ? it : it.text || it.label || JSON.stringify(it)}</li>
              ))}
            </ul>
          )}
          {slide.content?.tagline && <p className="slide-tagline">{slide.content.tagline}</p>}
        </div>
      );
    case "bullets":
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <ul className="slide-list">{slide.content?.bullets?.map(renderBullet)}</ul>
        </div>
      );
    case "two-column": {
      const left = slide.content?.left || {};
      const right = slide.content?.right || {};
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          <div className="slide-grid-two">
            <div>
              {left.subtitle && <p className="slide-subtitle">{left.subtitle}</p>}
              {left.bullets && <ul className="slide-list">{left.bullets.map(renderBullet)}</ul>}
              {left.metrics && renderMetrics(left.metrics)}
            </div>
            <div>
              {right.subtitle && <p className="slide-subtitle">{right.subtitle}</p>}
              {right.bullets && <ul className="slide-list">{right.bullets.map(renderBullet)}</ul>}
              {right.metrics && renderMetrics(right.metrics)}
            </div>
          </div>
        </div>
      );
    }
    case "three-column": {
      const columns = slide.content?.columns || [];
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <div className="slide-grid-three">
            {columns.map((column, index) => (
              <div key={column.title || index} className="column-card">
                {column.title && <h3>{column.title}</h3>}
                {renderColumnItems(column.items || column.bullets || [])}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "timeline": {
      const phases = slide.content?.phases || [];
      return (
        <div className="slide-content slide-timeline">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <div className="timeline-track">
            {phases.map((phase, index) => (
              <div key={phase.phase || phase.title || index} className="timeline-phase">
                <div className="timeline-phase-header">
                  <span className="timeline-phase-number">{index + 1}</span>
                  <span className="timeline-phase-title">{phase.title}</span>
                </div>
                {renderTimelineActivities(phase.activities || phase.tasks || [])}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'hub': {
      const core = slide.content?.core || "";
      const spokes = slide.content?.spokes || [];
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <motion.div className="diagram-container hub-diagram">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }} className="hub-core">
              {core}
            </motion.div>
            {spokes.map((s, i) => {
              const angle = (i / (spokes.length || 1)) * 2 * Math.PI;
              const x = 300 * Math.cos(angle);
              const y = 200 * Math.sin(angle);
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x, y, scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="hub-spoke"
                >
                  <div className="spoke-label">{s.label}</div>
                  {s.description && <div className="meta spoke-desc">{s.description}</div>}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      );
    }

    case 'image-left': {
      const image = slide.content?.image || {};
      const caption = slide.content?.caption;
      const text = slide.content?.text || {};
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <div className="slide-image-left">
            <div>
              {image?.src && <img className="media-image" src={image.src} alt={image.alt || slide.title} />}
              {caption && <div className="slide-image-caption">{caption}</div>}
            </div>
            <div className="media-text">
              {text.heading && <h3>{text.heading}</h3>}
              {text.bullets && <ul className="slide-list">{text.bullets.map(renderBullet)}</ul>}
            </div>
          </div>
        </div>
      );
    }

    case 'image-center': {
      const image = slide.content?.image || {};
      const caption = slide.content?.caption;
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <div className="slide-image-center">
            {image?.src && <img className="media-image" src={image.src} alt={image.alt || slide.title} />}
            {caption && <div className="slide-image-caption">{caption}</div>}
          </div>
        </div>
      );
    }

    case 'ring': {
      const center = slide.content?.center || "";
      const items = slide.content?.items || [];
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <motion.div className="diagram-container ring-diagram">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="ring-center">{center}</motion.div>
            {items.map((item, i) => {
              const angle = (i / (items.length || 1)) * 2 * Math.PI;
              const x = 180 * Math.cos(angle);
              const y = 180 * Math.sin(angle);
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x, y, scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="ring-item"
                >
                  {item}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      );
    }

    case 'pyramid':
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <div className="pyramid">
            {slide.content.levels.map((lvl, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                className="pyramid-level"
                style={{ width: `${100 - i * 10}%` }}
              >
                <h4 className="pyramid-title">{lvl.title}</h4>
                <p className="meta">{lvl.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'radar': {
      const axes = slide.content?.axes || [];
      const values = slide.content?.values || [];
      const data = axes.map((axis, i) => ({ subject: axis, A: values[i] || 0 }));
      const maxValue = slide.content?.maxValue || (values.length ? Math.max(...values) * 1.2 : 1);
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <RadarChart outerRadius={120} width={400} height={300} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, maxValue]} />
              <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </motion.div>
        </div>
      );
    }

    case 'flow': {
      const steps = slide.content?.steps || [];
      return (
        <div className="slide-content">
          <h1 className="slide-title">{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <motion.div className="flex items-center justify-center space-x-4">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.2 }} className="bg-green-50 px-4 py-2 rounded-xl shadow text-center">
                  <div className="font-semibold">{s.title}</div>
                  {s.description && <div className="text-sm text-gray-600">{s.description}</div>}
                </motion.div>
                {i < steps.length - 1 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }} className="text-2xl text-gray-400">→</motion.span>}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      );
    }

    default:
      return <p className="slide-error">Unsupported slide layout.</p>;
  }
};

export default function DeckViewer({
  deck,
  loading = false,
  loadingMessage = "Loading deck…",
  enableKeyboard = true,
  enableFullscreen = false
}) {
  const safeDeck = deck && Array.isArray(deck.slides) ? deck : defaultDeckState;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notesVisible, setNotesVisible] = useState(false);
  const [overviewVisible, setOverviewVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const slides = useMemo(() => safeDeck.slides || [], [safeDeck]);
  const currentSlide = slides[currentIndex] || null;

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (event) => {
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          event.preventDefault();
          setCurrentIndex((index) => Math.min(index + 1, slides.length - 1));
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          setCurrentIndex((index) => Math.max(index - 1, 0));
          break;
        case "o":
        case "O":
          setOverviewVisible((value) => !value);
          break;
        case "n":
        case "N":
          setNotesVisible((value) => !value);
          break;
        case "Escape":
          setOverviewVisible(false);
          setNotesVisible(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, enableKeyboard]);

  const goToSlide = useCallback(
    (index) => {
      setCurrentIndex(() => Math.min(Math.max(index, 0), slides.length - 1));
    },
    [slides.length]
  );

  const next = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, slides.length - 1));
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, [slides.length]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!enableFullscreen || !containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen", error);
    }
  }, [enableFullscreen]);

  if (loading) {
    return (
      <div className="viewer-stage">
        <div className="slide-frame loading">{loadingMessage}</div>
      </div>
    );
  }

  const progressValue = slides.length ? ((currentIndex + 1) / slides.length) * 100 : 0;

  return (
    <div className="viewer-shell" ref={containerRef}>
      <header className="viewer-header">
        <div>
          <h2>{safeDeck.title || "Deck"}</h2>
          {safeDeck.subtitle && <p className="meta">{safeDeck.subtitle}</p>}
        </div>
        <div className="hero-actions">
          <button className="button-secondary" onClick={() => setNotesVisible((value) => !value)}>
            {notesVisible ? "Hide notes" : "Show notes"}
          </button>
          {enableFullscreen && (
            <button className="button-secondary" onClick={toggleFullscreen}>
              {isFullscreen ? "Exit full screen" : "Enter full screen"}
            </button>
          )}
          <button className="button-secondary" onClick={() => setOverviewVisible(true)}>
            Slide overview
          </button>
        </div>
      </header>

      <section className="viewer-stage">
        <div className="slide-shell">
          <div className={`slide-frame ${currentSlide?.layout === 'cover' ? 'slide-cover' : ''}`}>
            {currentSlide ? (
              <SlideContent slide={currentSlide} />
            ) : (
              <div className="slide-content slide-empty">
                <p className="slide-error">No slides available.</p>
              </div>
            )}
          </div>

          <div className="viewer-controls">
            <div className="hero-actions">
              <button className="button-secondary" onClick={prev} disabled={currentIndex === 0}>
                Previous
              </button>
              <button
                className="button-secondary"
                onClick={next}
                disabled={currentIndex === slides.length - 1}
              >
                Next
              </button>
            </div>
            <div className="progress">
              <span>
                {slides.length > 0 ? `${currentIndex + 1} / ${slides.length}` : "0 / 0"}
              </span>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressValue}%` }} />
              </div>
            </div>
          </div>

          {notesVisible && (
            <aside className="notes-panel" aria-live="polite">
              {currentSlide?.notes || "No speaker notes for this slide."}
            </aside>
          )}
        </div>
      </section>

      {overviewVisible && (
        <div className="overview-drawer" role="dialog" aria-modal="true">
          <div className="overview-panel">
            <div className="viewer-header">
              <h3>Slides overview</h3>
              <button className="button-secondary" onClick={() => setOverviewVisible(false)}>
                Close
              </button>
            </div>
            <div className="overview-grid">
              {slides.map((slide, index) => (
                <button
                  key={slide.id || index}
                  type="button"
                  className={`overview-card ${index === currentIndex ? "active" : ""}`}
                  onClick={() => {
                    goToSlide(index);
                    setOverviewVisible(false);
                  }}
                >
                  <span className="overview-index">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{slide.title}</strong>
                  {slide.subtitle && <span className="meta">{slide.subtitle}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
