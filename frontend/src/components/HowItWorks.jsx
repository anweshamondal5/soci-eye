import React from 'react';
import { Search, Cpu, BarChart2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Search',
      tagline: 'Enter any topic or brand',
      desc: 'Query any brand, product, person or event. Soci-Eye instantly connects with public video channels and conversation threads.',
      icon: Search,
      accent: '#c084fc'
    },
    {
      num: '02',
      title: 'Analyze',
      tagline: 'Neural processing pipeline',
      desc: 'Our AI filters video noise, translates multilingual text & Indian slang, and dynamically extracts domain aspects.',
      icon: Cpu,
      accent: '#818cf8'
    },
    {
      num: '03',
      title: 'Understand',
      tagline: 'Actionable executive insights',
      desc: 'Review 100% mathematically balanced sentiment metrics, ranked aspect cards, top clean mentions, and AI synthesis.',
      icon: BarChart2,
      accent: '#38bdf8'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="how-container">
        
        <div className="section-header-centered">
          <div className="section-badge-center">
            <span className="section-badge-sparkle">✦</span>
            <span>PIPELINE</span>
          </div>
          <h2 className="section-title-large">How Soci-Eye Works</h2>
          <p className="section-subtitle-text">
            Three streamlined stages transforming raw social signals into verified executive intelligence.
          </p>
        </div>

        <div className="steps-container-wrapper">
          {/* Connecting Visual Flow Line for Desktop */}
          <div className="steps-connecting-flow-line"></div>

          <div className="steps-grid">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="step-card glass-panel">
                  <div className="step-card-ambient" style={{ background: `radial-gradient(circle at top, ${s.accent}15 0%, transparent 70%)` }}></div>
                  
                  <div className="step-card-header">
                    <div className="step-number-bubble" style={{ borderColor: `${s.accent}40`, color: s.accent }}>
                      <span className="step-number">{s.num}</span>
                    </div>

                    <div className="step-icon-bubble" style={{ color: s.accent, backgroundColor: `${s.accent}12` }}>
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="step-card-body">
                    <span className="step-tagline" style={{ color: s.accent }}>{s.tagline}</span>
                    <h3 className="step-card-title">{s.title}</h3>
                    <p className="step-card-desc">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
