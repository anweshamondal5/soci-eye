import React from 'react';
import { Sparkles, Quote, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AIInsightCard({ insight, topic }) {
  if (!insight) return null;

  return (
    <div className="ai-insight-card glass-panel">
      <div className="insight-gradient-border"></div>
      <div className="insight-ambient-glow"></div>
      
      <div className="insight-header">
        <div className="insight-badge">
          <span className="insight-pulse-sparkle">✦</span>
          <span>AI EXECUTIVE SYNTHESIS</span>
        </div>
        
        <div className="ai-model-tag">
          <Cpu size={13} className="model-cpu-icon" />
          <span>Gemini Intelligence Engine</span>
        </div>
      </div>

      <div className="insight-content-box">
        <div className="insight-quote-col">
          <div className="quote-icon-bubble">
            <Quote size={20} className="quote-svg" />
          </div>
        </div>

        <div className="insight-body">
          <span className="insight-eyebrow">
            What people are saying about <strong className="topic-accent">{topic}</strong>
          </span>
          <p className="insight-text">{insight}</p>
        </div>
      </div>

      <div className="insight-footer">
        <div className="insight-footer-item">
          <CheckCircle2 size={13} className="footer-check-icon" />
          <span>Grounded strictly in verified public sentiment metrics and domain distributions</span>
        </div>
      </div>
    </div>
  );
}
