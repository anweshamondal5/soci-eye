import React, { useState } from 'react';
import { MessageSquare, ExternalLink, ThumbsUp, Minus, ThumbsDown, Filter, Video, User, ChevronDown, ChevronUp, Search, ShieldCheck } from 'lucide-react';

export default function ConversationExplorer({ posts, topic }) {
  const [filterSentiment, setFilterSentiment] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  if (!posts || posts.length === 0) return null;

  const filteredPosts = posts.filter((item) => {
    const matchesSentiment = 
      filterSentiment === 'ALL' || item.sentiment.toUpperCase() === filterSentiment;
    
    const matchesSearch = 
      !searchFilter ||
      item.comment.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.aspect.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.channel.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesSentiment && matchesSearch;
  });

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = filteredPosts.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredPosts.length));
  };

  const handleShowLess = () => {
    setVisibleCount(6);
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return (
          <span className="conv-badge badge-pos">
            <ThumbsUp size={11} />
            <span>Positive</span>
          </span>
        );
      case 'Negative':
        return (
          <span className="conv-badge badge-neg">
            <ThumbsDown size={11} />
            <span>Negative</span>
          </span>
        );
      default:
        return (
          <span className="conv-badge badge-neu">
            <Minus size={11} />
            <span>Neutral</span>
          </span>
        );
    }
  };

  const getCardBorderClass = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'conv-card-pos';
      case 'negative':
        return 'conv-card-neg';
      default:
        return 'conv-card-neu';
    }
  };

  return (
    <div className="conversations-section">
      <div className="conv-section-header">
        <div>
          <span className="section-eyebrow">RAW SOCIAL SIGNALS</span>
          <h3 className="section-heading">ANALYZED CONVERSATIONS</h3>
          <p className="conv-subtitle">
            Filtered and verified public comments evaluating <strong className="topic-accent">"{topic}"</strong>
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="conv-controls-bar">
          {/* Sentiment Filter Tabs */}
          <div className="sentiment-filter-tabs glass-panel">
            <button 
              className={`filter-tab ${filterSentiment === 'ALL' ? 'tab-active' : ''}`}
              onClick={() => { setFilterSentiment('ALL'); setVisibleCount(6); }}
            >
              All ({posts.length})
            </button>
            <button 
              className={`filter-tab ${filterSentiment === 'POSITIVE' ? 'tab-active tab-pos' : ''}`}
              onClick={() => { setFilterSentiment('POSITIVE'); setVisibleCount(6); }}
            >
              Positive
            </button>
            <button 
              className={`filter-tab ${filterSentiment === 'NEUTRAL' ? 'tab-active tab-neu' : ''}`}
              onClick={() => { setFilterSentiment('NEUTRAL'); setVisibleCount(6); }}
            >
              Neutral
            </button>
            <button 
              className={`filter-tab ${filterSentiment === 'NEGATIVE' ? 'tab-active tab-neg' : ''}`}
              onClick={() => { setFilterSentiment('NEGATIVE'); setVisibleCount(6); }}
            >
              Negative
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="conv-search-box glass-panel">
            <Search size={13} className="conv-search-icon" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchFilter}
              onChange={(e) => { setSearchFilter(e.target.value); setVisibleCount(6); }}
              className="conv-search-input"
              aria-label="Filter comments"
            />
          </div>
        </div>
      </div>

      {/* Conversations Grid (Structured & Non-repetitive) */}
      <div className="conversations-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-conv-results glass-panel">
            <MessageSquare size={32} className="no-results-icon" />
            <p className="no-results-title">No conversations match your filter</p>
            <p className="no-results-sub">Try changing the sentiment filter or clearing the search box.</p>
          </div>
        ) : (
          displayedPosts.map((item, idx) => (
            <div key={item.id || idx} className={`conv-card glass-panel ${getCardBorderClass(item.sentiment)}`}>
              <div className="conv-card-top">
                <div className="conv-badges-group">
                  {getSentimentBadge(item.sentiment)}
                  {item.aspect && (
                    <span className="conv-aspect-pill">
                      {item.aspect}
                    </span>
                  )}
                </div>

                {item.video_url && (
                  <a 
                    href={item.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="conv-yt-link"
                    title="Open verified YouTube source"
                  >
                    <span>Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Comment Quote Content */}
              <p className="conv-text">"{item.comment}"</p>

              {/* AI Reason Rationale */}
              {item.reason && (
                <div className="conv-reason-box">
                  <span className="reason-label">Classification:</span>
                  <span className="reason-text">{item.reason}</span>
                </div>
              )}

              {/* Video & Channel Metadata Footer */}
              <div className="conv-meta-footer">
                <div className="conv-channel-info" title={item.channel}>
                  <User size={12} className="meta-icon" />
                  <span className="channel-name">{item.channel || 'Verified User'}</span>
                </div>
                {item.video_title && (
                  <div className="conv-video-title" title={item.video_title}>
                    <Video size={12} className="meta-icon" />
                    <span>{item.video_title}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination / View More Action */}
      {filteredPosts.length > 6 && (
        <div className="conv-pagination-wrap">
          {hasMore ? (
            <button onClick={handleShowMore} className="view-more-conv-btn glass-panel">
              <span>View More Conversations ({filteredPosts.length - visibleCount} remaining)</span>
              <ChevronDown size={16} />
            </button>
          ) : (
            <button onClick={handleShowLess} className="view-more-conv-btn glass-panel">
              <span>Show Fewer Conversations</span>
              <ChevronUp size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
