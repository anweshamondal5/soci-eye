import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoadingState from './components/LoadingState';
import ResultsDashboard from './components/ResultsDashboard';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import ApiKeyModal from './components/ApiKeyModal';
import { analyzeTopic, checkBackendHealth } from './services/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);

  // Check health on mount
  useEffect(() => {
    async function loadHealth() {
      const health = await checkBackendHealth();
      setBackendHealth(health);
    }
    loadHealth();
    const interval = setInterval(loadHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (topic) => {
    if (!topic || !topic.trim()) return;
    
    const cleanTopic = topic.trim();
    setCurrentQuery(cleanTopic);
    setIsLoading(true);
    setErrorMsg('');
    setAnalysisData(null);

    try {
      const result = await analyzeTopic(cleanTopic);
      setAnalysisData(result);
    } catch (err) {
      console.error("Search failed:", err);
      setErrorMsg(err.message || "An unexpected error occurred while analyzing this topic. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setErrorMsg('');
    const searchInput = document.getElementById('topic-search-input');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth' });
      searchInput.focus();
    }
  };

  const handleScrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
      const searchInput = document.getElementById('topic-search-input');
      if (searchInput) searchInput.focus();
    }
  };

  return (
    <div className="soci-eye-app">
      {/* Top Navigation */}
      <Navbar 
        onOpenKeyModal={() => setIsKeyModalOpen(true)} 
        backendStatus={Boolean(backendHealth)} 
      />

      <main className="main-content-flow">
        {/* Hero Section */}
        <Hero 
          onSearch={handleSearch} 
          isLoading={isLoading} 
          currentQuery={currentQuery} 
        />

        {/* Loading Indicator View */}
        {isLoading && (
          <div className="section-viewport-wrapper">
            <LoadingState topic={currentQuery} />
          </div>
        )}

        {/* Error Alert Display */}
        {errorMsg && !isLoading && (
          <div className="error-banner-container">
            <div className="error-alert-card glass-panel">
              <div className="error-icon-box">
                <AlertTriangle size={24} />
              </div>
              <div className="error-content">
                <h4 className="error-title">Analysis Request Failed</h4>
                <p className="error-text">{errorMsg}</p>
              </div>
              <button 
                onClick={() => handleSearch(currentQuery)} 
                className="error-retry-btn"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {analysisData && !isLoading && (
          <ResultsDashboard 
            data={analysisData} 
            onReset={handleReset} 
          />
        )}

        {/* Features Capabilities */}
        <FeaturesSection />

        {/* 3-Step Pipeline */}
        <HowItWorks />

        {/* Call To Action */}
        <CallToAction onStartClick={handleScrollToSearch} />
      </main>

      {/* Footer */}
      <Footer />

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isKeyModalOpen} 
        onClose={() => setIsKeyModalOpen(false)} 
        healthData={backendHealth} 
      />
    </div>
  );
}
