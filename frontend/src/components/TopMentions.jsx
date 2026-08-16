import React from 'react';
import { Sparkles, Hash, Terminal } from 'lucide-react';

export default function TopMentions({ topMentions }) {
  if (!topMentions || topMentions.length === 0) {
    return null;
  }

  return (
    <div className="top-mentions-section glass-panel">
      <div className="mentions-header">
        <div className="mentions-title-group">
          <div className="mentions-icon-box">
            <Hash size={16} />
          </div>
          <div>
            <h3 className="section-heading">TOP MENTIONS</h3>
            <span className="mentions-subtitle">Frequently occurring topic terms extracted via NLP tokenization</span>
          </div>
        </div>
        <span className="mentions-pill-badge">Frequency Weighted</span>
      </div>

      <div className="mentions-pills-wrap">
        {topMentions.map((term, index) => {
          // Calculate visual weight tiers
          const isTopTier = index === 0 || index === 1;
          const isMidTier = index === 2 || index === 3;

          return (
            <div 
              key={index} 
              className={`mention-pill ${isTopTier ? 'pill-tier-1' : isMidTier ? 'pill-tier-2' : 'pill-tier-3'}`}
            >
              <span className="mention-index">0{index + 1}</span>
              <span className="mention-text">{term}</span>
              {isTopTier && <span className="mention-star">✦</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
