import React from 'react';
import { Layers, TrendingUp, Sparkles, MessageCircle } from 'lucide-react';

export default function KeyTopics({ keyTopics }) {
  if (!keyTopics || keyTopics.length === 0) {
    return null;
  }

  // Find max mentions for comparative progress bar
  const maxMentions = Math.max(...keyTopics.map(t => t.mentions || 1), 1);

  const getSentimentBadgeClass = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'badge-topic-pos';
      case 'negative':
        return 'badge-topic-neg';
      default:
        return 'badge-topic-neu';
    }
  };

  return (
    <div className="key-topics-section">
      <div className="section-title-row">
        <div>
          <span className="section-eyebrow">ASPECT EXTRACTION</span>
          <h3 className="section-heading">KEY TOPICS</h3>
        </div>
        <div className="topics-meta-badge">
          <Layers size={13} />
          <span>{keyTopics.length} Dynamic Domains</span>
        </div>
      </div>

      <div className="topics-grid">
        {keyTopics.map((topic, index) => {
          const rank = String(index + 1).padStart(2, '0');
          const badgeClass = getSentimentBadgeClass(topic.sentiment);
          const mentionPct = Math.round((topic.mentions / maxMentions) * 100);

          return (
            <div key={index} className="topic-card glass-panel">
              <div className="topic-card-top">
                <span className="topic-rank">{rank}</span>
                <span className={`topic-sentiment-badge ${badgeClass}`}>
                  {topic.sentiment}
                </span>
              </div>

              <div className="topic-card-body">
                <h4 className="topic-name">{topic.name}</h4>
                
                <div className="topic-mentions-group">
                  <div className="topic-mentions-row">
                    <MessageCircle size={12} className="mentions-icon" />
                    <span className="mentions-count">{topic.mentions} mentions</span>
                  </div>
                  
                  {/* Subtle Relative Volume Indicator */}
                  <div className="topic-volume-track">
                    <div 
                      className={`topic-volume-fill ${topic.sentiment?.toLowerCase() === 'positive' ? 'fill-pos' : topic.sentiment?.toLowerCase() === 'negative' ? 'fill-neg' : 'fill-neu'}`}
                      style={{ width: `${mentionPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
