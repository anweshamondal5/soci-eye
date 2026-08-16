import React, { useState, useEffect } from 'react';
import { Loader2, Search, Cpu, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoadingState({ topic }) {
  const steps = [
    { title: 'Scanning public conversations...', icon: Search, desc: 'Querying YouTube Data API for relevant discussions' },
    { title: 'Filtering relevance & noise...', icon: Cpu, desc: 'Eliminating creator noise, spam and generic feedback' },
    { title: 'Analyzing multilingual sentiment...', icon: BarChart3, desc: 'Evaluating English, Hindi, Hinglish, slang & context' },
    { title: 'Finding key topics & aspects...', icon: Sparkles, desc: 'Extracting dynamic domains without filler words' },
    { title: 'Synthesizing AI insights...', icon: CheckCircle2, desc: 'Grounding insights strictly in verified metrics' }
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="loading-state-container glass-panel">
      <div className="loading-core-visual">
        <div className="loading-pulse-ring ring-1"></div>
        <div className="loading-pulse-ring ring-2"></div>
        <div className="loading-spinner-box">
          <Loader2 className="loading-spinner-icon" size={38} />
        </div>
      </div>

      <div className="loading-header">
        <span className="loading-badge">ANALYSIS IN PROGRESS</span>
        <h3 className="loading-title">Analyzing conversations for "{topic}"</h3>
        <p className="loading-subtitle">Soci-Eye is processing public social signals through the AI pipeline.</p>
      </div>

      {/* Progress Steps */}
      <div className="loading-steps-list">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;
          const isUpcoming = idx > currentStepIdx;

          return (
            <div 
              key={idx} 
              className={`loading-step-row ${isCurrent ? 'step-active' : ''} ${isDone ? 'step-done' : ''} ${isUpcoming ? 'step-pending' : ''}`}
            >
              <div className="step-status-icon">
                {isDone ? (
                  <CheckCircle2 size={18} className="icon-done" />
                ) : isCurrent ? (
                  <span className="step-ping-dot"></span>
                ) : (
                  <span className="step-idle-dot"></span>
                )}
              </div>

              <div className="step-details">
                <span className="step-title-text">{step.title}</span>
                <span className="step-desc-text">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
