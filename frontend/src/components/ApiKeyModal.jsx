import React, { useEffect } from 'react';
import { X, Key, CheckCircle, AlertCircle, ExternalLink, ShieldCheck, Copy, Terminal } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, healthData }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasYoutube = healthData?.has_youtube_key;
  const hasGemini = healthData?.has_gemini_key;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content glass-panel animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-key-bubble">
              <Key size={18} />
            </div>
            <div>
              <h3 id="modal-title" className="modal-title">API Configuration Status</h3>
              <span className="modal-subhead">System connectivity and key inspection</span>
            </div>
          </div>
          
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <p className="modal-intro">
            Soci-Eye operates with direct API integrations. When keys are not configured in <code className="code-pill">backend/.env</code>, it seamlessly runs on its dynamic topic-specific intelligence engine.
          </p>

          <div className="key-status-cards">
            {/* YouTube API Status */}
            <div className="key-card glass-panel">
              <div className="key-card-info">
                <span className="key-title">YouTube Data API v3</span>
                <span className="key-sub">Retrieves video search results & public comment threads</span>
              </div>
              <div className="key-badge">
                {hasYoutube ? (
                  <span className="badge-configured">
                    <CheckCircle size={13} /> Active
                  </span>
                ) : (
                  <span className="badge-missing">
                    <AlertCircle size={13} /> Dynamic Mode
                  </span>
                )}
              </div>
            </div>

            {/* Gemini API Status */}
            <div className="key-card glass-panel">
              <div className="key-card-info">
                <span className="key-title">Google Gemini API</span>
                <span className="key-sub">Multilingual classification, aspects & insight synthesis</span>
              </div>
              <div className="key-badge">
                {hasGemini ? (
                  <span className="badge-configured">
                    <CheckCircle size={13} /> Active
                  </span>
                ) : (
                  <span className="badge-missing">
                    <AlertCircle size={13} /> Dynamic Mode
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-instructions glass-panel">
            <div className="instructions-header">
              <Terminal size={14} />
              <h4 className="instructions-title">Quick Setup in <code className="code-pill">backend/.env</code>:</h4>
            </div>
            
            <ol className="instructions-list">
              <li>
                Open <code className="code-pill">backend/.env</code> in your editor.
              </li>
              <li>
                Add <code className="code-pill">YOUTUBE_API_KEY=...</code> (<a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="inline-link">Google Cloud Console <ExternalLink size={10} /></a>)
              </li>
              <li>
                Add <code className="code-pill">GEMINI_API_KEY=...</code> (<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="inline-link">Google AI Studio <ExternalLink size={10} /></a>)
              </li>
              <li>Save and restart the backend server.</li>
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="modal-primary-btn">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
