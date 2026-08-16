import React from 'react';
import { Sparkles, Shield, Activity, BarChart2, Cpu, Globe2 } from 'lucide-react';
import SearchBar from './SearchBar';
import LiveMonitoringVisual from './LiveMonitoringVisual';

export default function Hero({ onSearch, isLoading, currentQuery }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-glow-backdrop"></div>
      <div className="hero-ambient-orb orb-1"></div>
      <div className="hero-ambient-orb orb-2"></div>
      
      <div className="hero-container">
        
        {/* Left Column: Hero Content & Search */}
        <div className="hero-text-content">
          <div className="hero-badge">
            <span className="badge-sparkle-dot"></span>
            <Sparkles size={13} className="badge-sparkle-icon" />
            <span>AI-Powered Social Intelligence</span>
          </div>

          <h1 className="hero-headline">
            Understand what people <br />
            <span className="animated-gradient-text">really think.</span>
          </h1>

          <p className="hero-description">
            Turn public conversations into actionable clarity. Discover sentiment, topic aspects, and genuine opinion patterns around any brand, product, person or topic.
          </p>

          <SearchBar 
            onSearch={onSearch} 
            isLoading={isLoading} 
            currentQuery={currentQuery} 
          />

          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <div className="stat-top">
                <span className="stat-highlight">100%</span>
                <span className="stat-pill-label">Strict Math</span>
              </div>
              <span className="stat-caption">Hare-Niemeyer Balance</span>
            </div>
            
            <div className="stat-divider"></div>
            
            <div className="hero-stat-item">
              <div className="stat-top">
                <Globe2 size={16} className="stat-icon" />
                <span className="stat-highlight">Multilingual</span>
              </div>
              <span className="stat-caption">Indian Dialects & Slang</span>
            </div>
            
            <div className="stat-divider"></div>
            
            <div className="hero-stat-item">
              <div className="stat-top">
                <Cpu size={16} className="stat-icon" />
                <span className="stat-highlight">Dynamic</span>
              </div>
              <span className="stat-caption">Domain Extraction</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Monitoring Visual */}
        <div className="hero-visual-wrapper">
          <LiveMonitoringVisual />
        </div>

      </div>
    </section>
  );
}
