import React, { useState, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, TrendingUp, CornerDownLeft } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading, currentQuery }) {
  const [inputVal, setInputVal] = useState(currentQuery || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (currentQuery) {
      setInputVal(currentQuery);
    }
  }, [currentQuery]);

  const trendingTopics = [
    { label: 'KFC', query: 'KFC', category: 'Food' },
    { label: 'Samsung S23', query: 'Samsung S23', category: 'Tech' },
    { label: 'Tesla', query: 'Tesla', category: 'Auto' },
    { label: 'Pizza', query: 'Pizza', category: 'Food' },
    { label: 'Netflix', query: 'Netflix', category: 'Media' },
    { label: 'BTS', query: 'BTS', category: 'Music' },
    { label: 'Artificial Intelligence', query: 'Artificial Intelligence', category: 'Tech' },
    { label: 'Gaming', query: 'Gaming', category: 'Gaming' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (query && !isLoading) {
      onSearch(query);
    }
  };

  const handleChipClick = (topicQuery) => {
    setInputVal(topicQuery);
    if (!isLoading) {
      onSearch(topicQuery);
    }
  };

  return (
    <div id="search-section" className="search-component-wrapper">
      <form onSubmit={handleSubmit} className="search-form-container">
        <div className={`search-input-box ${isFocused ? 'search-box-focused' : ''}`}>
          <div className="search-icon-wrapper">
            <Search className="search-lead-icon" size={20} />
          </div>
          
          <input
            id="topic-search-input"
            type="text"
            className="search-text-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter a brand, product, person or topic..."
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            aria-label="Search topic or brand"
          />

          <div className="search-box-right">
            {!isLoading && (
              <span className="search-kbd-hint" title="Press Enter to analyze">
                <CornerDownLeft size={11} /> Enter
              </span>
            )}
            
            <button 
              type="submit" 
              className={`search-submit-btn ${isLoading ? 'btn-loading' : ''}`}
              disabled={isLoading || !inputVal.trim()}
              aria-label="Analyze search topic"
            >
              {isLoading ? (
                <span className="btn-spinner"></span>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight size={15} className="btn-arrow" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Trending Topics Row */}
      <div className="trending-chips-container">
        <div className="trending-label">
          <TrendingUp size={13} className="trending-icon" />
          <span>Trending Topics:</span>
        </div>
        <div className="chips-scroller">
          {trendingTopics.map((item, idx) => {
            const isActive = inputVal.toLowerCase() === item.query.toLowerCase();
            return (
              <button
                key={idx}
                type="button"
                className={`topic-chip ${isActive ? 'chip-active' : ''}`}
                onClick={() => handleChipClick(item.query)}
                disabled={isLoading}
              >
                <span className="chip-dot"></span>
                <span className="chip-text">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
