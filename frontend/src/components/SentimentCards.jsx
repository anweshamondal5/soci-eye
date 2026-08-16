import React, { useState } from 'react';
import { ThumbsUp, Minus, ThumbsDown, Activity, Info, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export default function SentimentCards({ positive, neutral, negative, postsAnalyzed }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <div className="sentiment-section-wrapper">
      <div className="section-title-row">
        <div>
          <span className="section-eyebrow">DISTRIBUTION ANALYSIS</span>
          <h3 className="section-heading">OVERALL SENTIMENT</h3>
        </div>
        <div className="analyzed-badge glass-panel">
          <Activity size={13} className="analyzed-icon" />
          <span>{postsAnalyzed} Posts Verified</span>
        </div>
      </div>

      {/* 3 Main Sentiment Cards */}
      <div className="sentiment-cards-grid">
        {/* Positive */}
        <div className="sentiment-card card-positive glass-panel">
          <div className="card-top">
            <div className="sentiment-icon-bubble bubble-pos">
              <ThumbsUp size={18} />
            </div>
            <span className="sentiment-tag tag-pos">Positive</span>
          </div>

          <div className="sentiment-value-group">
            <div className="sentiment-number-row">
              <span className="sentiment-percentage">{positive}%</span>
            </div>
            <span className="sentiment-sublabel">Favorable public perception</span>
          </div>

          <div className="sentiment-bar-track">
            <div className="sentiment-bar-fill bar-fill-pos" style={{ width: `${positive}%` }}></div>
          </div>

          <div className="sentiment-card-caption">
            Based on verified product satisfaction & praise
          </div>
        </div>

        {/* Neutral */}
        <div className="sentiment-card card-neutral glass-panel">
          <div className="card-top">
            <div className="sentiment-icon-bubble bubble-neu">
              <Minus size={18} />
            </div>
            <span className="sentiment-tag tag-neu">Neutral</span>
          </div>

          <div className="sentiment-value-group">
            <div className="sentiment-number-row">
              <span className="sentiment-percentage">{neutral}%</span>
            </div>
            <span className="sentiment-sublabel">Objective inquiries & questions</span>
          </div>

          <div className="sentiment-bar-track">
            <div className="sentiment-bar-fill bar-fill-neu" style={{ width: `${neutral}%` }}></div>
          </div>

          <div className="sentiment-card-caption">
            Informational queries, pricing & comparisons
          </div>
        </div>

        {/* Negative */}
        <div className="sentiment-card card-negative glass-panel">
          <div className="card-top">
            <div className="sentiment-icon-bubble bubble-neg">
              <ThumbsDown size={18} />
            </div>
            <span className="sentiment-tag tag-neg">Negative</span>
          </div>

          <div className="sentiment-value-group">
            <div className="sentiment-number-row">
              <span className="sentiment-percentage">{negative}%</span>
            </div>
            <span className="sentiment-sublabel">Critical friction & concerns</span>
          </div>

          <div className="sentiment-bar-track">
            <div className="sentiment-bar-fill bar-fill-neg" style={{ width: `${negative}%` }}></div>
          </div>

          <div className="sentiment-card-caption">
            Complaints, bugs, service friction & pricing
          </div>
        </div>
      </div>

      {/* Segmented Sentiment Activity Visualization */}
      <div className="sentiment-activity-panel glass-panel">
        <div className="activity-panel-header">
          <div className="activity-title-group">
            <div className="activity-badge-row">
              <BarChart3 size={15} className="activity-icon" />
              <span className="activity-title">SENTIMENT ACTIVITY</span>
            </div>
            <span className="activity-subtitle">Cumulative breakdown across verified public conversation sample</span>
          </div>

          <div className="activity-notice">
            <Info size={13} />
            <span>Recent Activity Observation</span>
          </div>
        </div>

        {/* Interactive Segmented Bar */}
        <div className="segmented-bar-container">
          <div 
            className="segment segment-pos" 
            style={{ width: `${positive}%` }}
            onMouseEnter={() => setActiveTooltip('pos')}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {positive > 8 && <span>{positive}%</span>}
          </div>
          <div 
            className="segment segment-neu" 
            style={{ width: `${neutral}%` }}
            onMouseEnter={() => setActiveTooltip('neu')}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {neutral > 8 && <span>{neutral}%</span>}
          </div>
          <div 
            className="segment segment-neg" 
            style={{ width: `${negative}%` }}
            onMouseEnter={() => setActiveTooltip('neg')}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {negative > 8 && <span>{negative}%</span>}
          </div>
        </div>

        {/* Legend & Longitudinal Notice */}
        <div className="activity-legend">
          <div className={`legend-item ${activeTooltip === 'pos' ? 'legend-active' : ''}`}>
            <span className="legend-dot dot-pos"></span>
            <span className="legend-name">Positive</span>
            <span className="legend-val">{positive}%</span>
          </div>
          
          <div className={`legend-item ${activeTooltip === 'neu' ? 'legend-active' : ''}`}>
            <span className="legend-dot dot-neu"></span>
            <span className="legend-name">Neutral</span>
            <span className="legend-val">{neutral}%</span>
          </div>
          
          <div className={`legend-item ${activeTooltip === 'neg' ? 'legend-active' : ''}`}>
            <span className="legend-dot dot-neg"></span>
            <span className="legend-name">Negative</span>
            <span className="legend-val">{negative}%</span>
          </div>

          <div className="legend-meta">
            <span>Historical trends appear as Soci-Eye collects longitudinal observations.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
