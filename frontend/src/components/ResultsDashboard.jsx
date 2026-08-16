import React, { useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Download, ShieldCheck, Activity, Share2 } from 'lucide-react';
import AIInsightCard from './AIInsightCard';
import SentimentCards from './SentimentCards';
import KeyTopics from './KeyTopics';
import TopMentions from './TopMentions';
import ConversationExplorer from './ConversationExplorer';

export default function ResultsDashboard({ data, onReset }) {
  const dashboardRef = useRef(null);

  useEffect(() => {
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  if (!data || !data.analysis) return null;

  const { topic, analysis, source } = data;
  const {
    positive = 0,
    neutral = 0,
    negative = 0,
    posts_analyzed = 0,
    key_topics = [],
    top_mentions = [],
    insight = '',
    posts = []
  } = analysis;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `soci-eye-${topic.toLowerCase().replace(/\s+/g, '-')}-intelligence.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section ref={dashboardRef} id="results-dashboard" className="results-dashboard-section animate-fade-in-up">
      <div className="dashboard-container">
        
        {/* Header Executive Banner */}
        <div className="results-header-banner glass-panel">
          <div className="results-header-left">
            <div className="analysis-status-pill">
              <span className="pill-dot-active"></span>
              <CheckCircle2 size={13} className="pill-check-icon" />
              <span>ANALYSIS COMPLETE</span>
            </div>
            
            <h2 className="dashboard-topic-title">
              Social Intelligence for <span className="topic-highlight">"{topic}"</span>
            </h2>
            
            <p className="dashboard-topic-sub">
              Synthesized public discussions retrieved, filtered for relevance, and categorized across domain aspects.
            </p>
          </div>

          <div className="results-header-actions">
            <button onClick={handleExportJSON} className="action-btn-outline" title="Export structured JSON dataset">
              <Download size={14} />
              <span>Export JSON</span>
            </button>
            <button onClick={onReset} className="action-btn-outline action-btn-refresh" title="Perform a new analysis">
              <RotateCcw size={14} />
              <span>New Search</span>
            </button>
          </div>
        </div>

        {/* 1. Primary AI Executive Synthesis - The Core "Answer" Moment */}
        <AIInsightCard insight={insight} topic={topic} />

        {/* 2. Overall Sentiment & Activity Visualization */}
        <SentimentCards
          positive={positive}
          neutral={neutral}
          negative={negative}
          postsAnalyzed={posts_analyzed}
        />

        {/* 3. Key Topics (Aspect Domains) */}
        <KeyTopics keyTopics={key_topics} />

        {/* 4. Top Mentions (NLP Tokenization) */}
        <TopMentions topMentions={top_mentions} />

        {/* 5. Analyzed Conversations Explorer with 6-card curated view & smooth pagination */}
        <ConversationExplorer posts={posts} topic={topic} />

      </div>
    </section>
  );
}
