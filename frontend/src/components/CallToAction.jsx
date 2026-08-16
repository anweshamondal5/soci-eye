import React from 'react';
import { Sparkles, ArrowRight, ArrowUp, Activity } from 'lucide-react';

export default function CallToAction({ onStartClick }) {
  return (
    <section className="cta-section">
      <div className="cta-container glass-panel">
        <div className="cta-glow-backdrop"></div>
        <div className="cta-grid-lines"></div>

        <div className="cta-content">
          <div className="cta-badge">
            <span className="cta-badge-dot"></span>
            <Sparkles size={13} />
            <span>INSTANT SOCIAL INTELLIGENCE</span>
          </div>

          <h2 className="cta-headline">
            Ready to understand what people <br />
            <span className="animated-gradient-text">really think?</span>
          </h2>

          <p className="cta-subtext">
            Analyze any brand, consumer product, viral person or public trend in seconds with Soci-Eye's AI engine.
          </p>

          <button onClick={onStartClick} className="cta-primary-btn" aria-label="Start analyzing topics">
            <span>Start Analyzing</span>
            <ArrowRight size={16} className="cta-btn-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
