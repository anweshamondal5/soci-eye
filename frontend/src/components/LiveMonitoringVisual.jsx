import React, { useState, useEffect } from 'react';
import { Activity, Radio, Cpu, MessageSquare, Zap, ShieldCheck, Sparkles, Waves, ArrowUpRight } from 'lucide-react';

export default function LiveMonitoringVisual() {
  const [activeSignalIndex, setActiveSignalIndex] = useState(0);

  const signalItems = [
    { type: 'Trending topic', desc: 'Social conversation detected', icon: Zap, color: '#c084fc', badge: 'Signal' },
    { type: 'New opinion', desc: 'Sentiment signal received', icon: MessageSquare, color: '#38bdf8', badge: 'Context' },
    { type: 'Social activity', desc: 'Conversation volume rising', icon: Activity, color: '#818cf8', badge: 'Volume' },
    { type: 'AI Analysis', desc: 'Understanding public opinion', icon: Cpu, color: '#34d399', badge: 'Synthesis' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSignalIndex((prev) => (prev + 1) % signalItems.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [signalItems.length]);

  return (
    <div className="live-visual-card glass-panel">
      <div className="card-ambient-glow"></div>
      
      {/* Top Header */}
      <div className="live-card-header">
        <div className="live-header-left">
          <span className="live-radar-dot"></span>
          <div className="live-title-group">
            <span className="live-card-title">LIVE MONITORING</span>
            <span className="live-card-sub">Neural Social Stream</span>
          </div>
        </div>
        
        <div className="live-badge-pulse">
          <Radio size={12} className="live-radio-icon" />
          <span>Stream Active</span>
        </div>
      </div>

      {/* Main Interactive AI Core Visualization */}
      <div className="ai-core-container">
        {/* Orbital Background Radar Rings */}
        <div className="radar-ring ring-outer animate-spin-slow"></div>
        <div className="radar-ring ring-middle"></div>
        <div className="radar-ring ring-inner"></div>
        <div className="radar-sweep-beam"></div>

        {/* Dynamic Wave Grid Lines */}
        <div className="core-grid-crosshair"></div>

        {/* Central Glowing AI Core */}
        <div className="ai-core-sphere animate-pulse-glow">
          <div className="ai-core-glow-layer"></div>
          <div className="ai-core-inner">
            <Cpu size={30} className="ai-core-icon" />
          </div>
          
          {/* Orbital Particles */}
          <div className="core-orbiting-particle p1" title="Positive Signal Flow"></div>
          <div className="core-orbiting-particle p2" title="Multilingual Node"></div>
          <div className="core-orbiting-particle p3" title="Aspect Extractor"></div>
        </div>

        {/* Floating Context Badges */}
        <div className="floating-signal-tag tag-top">
          <span className="signal-dot dot-pos"></span>
          <span>Positive Stream</span>
        </div>
        <div className="floating-signal-tag tag-right">
          <span className="signal-dot dot-neu"></span>
          <span>Multilingual NLP</span>
        </div>
        <div className="floating-signal-tag tag-left">
          <span className="signal-dot dot-neg"></span>
          <span>Relevance Guard</span>
        </div>
      </div>

      {/* Live Feed Stream */}
      <div className="live-stream-box">
        <div className="stream-header">
          <span className="stream-label">INCOMING SOCIAL SIGNALS</span>
          <span className="stream-counter">
            <span className="counter-dot"></span>
            Real-time Pipeline
          </span>
        </div>

        <div className="stream-items-list">
          {signalItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeSignalIndex;
            return (
              <div 
                key={idx} 
                className={`stream-item ${isActive ? 'stream-item-active' : ''}`}
              >
                <div className="stream-icon-box" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                  <Icon size={14} />
                </div>
                <div className="stream-content">
                  <div className="stream-type-row">
                    <span className="stream-type">{item.type}</span>
                    <span className="stream-pill-tag">{item.badge}</span>
                  </div>
                  <span className="stream-desc">{item.desc}</span>
                </div>
                {isActive && <span className="stream-active-indicator">●</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="live-card-footer">
        <div className="footer-metrics-row">
          <div className="footer-metric">
            <span className="metric-dot dot-pos"></span>
            <span className="metric-text">Positive</span>
          </div>
          <div className="footer-metric">
            <span className="metric-dot dot-neu"></span>
            <span className="metric-text">Neutral</span>
          </div>
          <div className="footer-metric">
            <span className="metric-dot dot-neg"></span>
            <span className="metric-text">Negative</span>
          </div>
        </div>
        <div className="footer-status-text">
          <span>Monitoring social conversations in real time</span>
        </div>
      </div>
    </div>
  );
}
