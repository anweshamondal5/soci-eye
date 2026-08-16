import React, { useState, useEffect } from 'react';
import { Eye, Activity, Sparkles, KeyRound, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenKeyModal, backendStatus }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section tracking
      const sections = ['hero', 'features', 'how-it-works', 'about'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Identity */}
        <a href="#" className="navbar-logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
          <div className="logo-icon-wrapper">
            <Eye className="logo-icon" size={20} />
            <span className="logo-pulse-dot"></span>
          </div>
          <div className="logo-text-group">
            <span className="logo-title">
              Soci<span className="logo-hyphen">-</span><span className="logo-highlight">Eye</span>
            </span>
            <span className="logo-badge">INTELLIGENCE</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          <button 
            onClick={() => scrollToSection('hero')} 
            className={`nav-link ${activeSection === 'hero' ? 'nav-link-active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className={`nav-link ${activeSection === 'features' ? 'nav-link-active' : ''}`}
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className={`nav-link ${activeSection === 'how-it-works' ? 'nav-link-active' : ''}`}
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className={`nav-link ${activeSection === 'about' ? 'nav-link-active' : ''}`}
          >
            About
          </button>
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Live Engine Indicator */}
          <div 
            className="status-pill" 
            title={backendStatus ? "FastAPI + AI Engine Connected" : "Connecting to backend..."}
          >
            <span className={`status-dot ${backendStatus ? 'status-online' : 'status-pending'}`}></span>
            <span className="status-label">{backendStatus ? 'Live System' : 'Connecting'}</span>
          </div>

          <button 
            className="api-key-btn" 
            onClick={onOpenKeyModal}
            title="Inspect API Key Configuration"
            aria-label="API Keys Configuration"
          >
            <KeyRound size={14} />
            <span>API Keys</span>
          </button>

          <button 
            onClick={() => scrollToSection('search-section')} 
            className="navbar-cta-btn"
          >
            <span>Start Analyzing</span>
            <ArrowRight size={14} className="cta-arrow" />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu glass-panel animate-fade-in-up">
          <button onClick={() => scrollToSection('hero')} className="mobile-nav-link">Home</button>
          <button onClick={() => scrollToSection('features')} className="mobile-nav-link">Features</button>
          <button onClick={() => scrollToSection('how-it-works')} className="mobile-nav-link">How It Works</button>
          <button onClick={() => scrollToSection('about')} className="mobile-nav-link">About</button>
          <div className="mobile-nav-divider"></div>
          <button onClick={() => { setMobileMenuOpen(false); onOpenKeyModal(); }} className="mobile-nav-link">
            <KeyRound size={15} /> Configure API Keys
          </button>
        </div>
      )}
    </header>
  );
}
