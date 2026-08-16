import React from 'react';
import { Eye, Github, Twitter, Linkedin, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="about" className="footer-section">
      <div className="footer-container">
        
        <div className="footer-main-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Eye size={18} />
              </div>
              <span className="logo-title">
                Soci<span className="logo-hyphen">-</span><span className="logo-highlight">Eye</span>
              </span>
            </div>
            
            <p className="footer-tagline">"Understand what people really think."</p>
            
            <p className="footer-desc">
              Soci-Eye is an AI-powered social intelligence platform that analyzes public online conversations to understand sentiment, emerging topics, public opinion, and discussion patterns around any subject.
            </p>
          </div>

          {/* Quick Platform Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-nav-list">
              <li><a href="#hero">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">Pipeline</a></li>
              <li><a href="#search-section">Search Topic</a></li>
            </ul>
          </div>

          {/* Core Capabilities */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Intelligence</h4>
            <ul className="footer-nav-list">
              <li><a href="#features">Multilingual Sentiment</a></li>
              <li><a href="#features">Relevance Guard</a></li>
              <li><a href="#features">Aspect Clustering</a></li>
              <li><a href="#features">Gemini Synthesis</a></li>
            </ul>
          </div>

          {/* Stack & Architecture */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Architecture</h4>
            <ul className="footer-nav-list">
              <li><span>FastAPI & Python 3.13</span></li>
              <li><span>React 18 & Vite</span></li>
              <li><span>Google Gemini API</span></li>
              <li><span>YouTube Data API v3</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {currentYear} Soci-Eye. Engineered for portfolio excellence and real social intelligence.
          </p>
          
          <div className="footer-status-pill">
            <span className="status-dot status-online"></span>
            <span>API Engine v1.0 Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
