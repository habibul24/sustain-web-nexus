import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const SustainabilitySection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const animatedTexts = [
    "automate in-house ESG Data collation",
    "automate supplier education & reporting", 
    "automate your ESG aggregation & analysis",
    "generate detailed ESG reports"
  ];

  useEffect(() => {
    if (fadeState === 'fade-in') {
      timeoutRef.current = setTimeout(() => setFadeState('fade-out'), 2200);
    } else {
      timeoutRef.current = setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length);
        setFadeState('fade-in');
      }, 600);
    }
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [fadeState]);

  return (
    <section className="py-24" style={{ background: 'linear-gradient(to bottom, #c6e97a, #7fae2e)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          {/* Left Content */}
          <div className="flex-1 flex flex-col justify-center items-start">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-[#29443e] leading-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]" style={{letterSpacing: '-0.04em'}}>
              Green Data
            </h1>
            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-200 mt-2 drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]">
              The only solution you need to
            </h4>
            <div className="h-16 md:h-20 relative mt-2 mb-4 w-full">
              {animatedTexts.map((text, index) => (
                <div
                  key={index}
                  className={`absolute left-0 top-0 w-full font-extrabold transition-opacity duration-500 ${
                    index === currentTextIndex
                      ? fadeState === 'fade-in'
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-10'
                      : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  style={{
                    color: '#29443e',
                    fontWeight: 800,
                    fontSize: '2.2rem',
                    lineHeight: 1.1,
                    textAlign: 'left',
                    textShadow: '0 2px 8px #fff, 0 1px 0 #fff',
                  }}
                >
                  {text}
                </div>
              ))}
            </div>
            <p className="mt-2 text-lg md:text-xl italic text-slate-800 drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]">
              Aggregate, Analyze, and Act on ESG Data & Insights, All in Real-Time.
            </p>
            <div className="mt-8">
              <Button 
                asChild
                className="flex items-center gap-2 text-white text-lg md:text-xl px-8 py-4 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#ffb300', borderColor: '#ffb300' }}
              >
                <Link to="/sign-up">
                <Zap className="w-6 h-6 mr-2" />
                Request a Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Globe and Card */}
          <div className="flex-1 flex items-center justify-center relative mt-12 lg:mt-0 min-w-[340px]">
            {/* SVG Arc Ring - pixel-perfect to original */}
            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0" width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents: 'none'}}>
              <path d="M60 260A140 140 0 1 1 260 60" stroke="#245c36" strokeWidth="16" strokeLinecap="round"/>
              <path d="M260 60A140 140 0 0 1 60 260" stroke="#b6d97a" strokeWidth="16" strokeLinecap="round"/>
              <path d="M60 260A140 140 0 0 1 90 300" stroke="#e3e480" strokeWidth="16" strokeLinecap="round"/>
            </svg>
            {/* Globe Image - NASA Blue Marble Pacific */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg" 
              className="rounded-full relative z-10 w-60 h-60 object-cover animate-spin-slow shadow-lg" 
              style={{ animationDuration: '20s', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}
              alt="Globe"
            />
            {/* Carbon Footprint Card */}
            <div className="bg-white shadow-xl absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-80 sm:w-96 z-20 rounded-2xl p-6 flex flex-col gap-2 border border-slate-100" style={{minWidth: '270px'}}>
              <span className="text-slate-500 text-sm font-semibold">Carbon Footprint</span>
              <span className="text-4xl font-extrabold text-slate-800">3400kg</span>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold text-sm">↓ 40%</span>
                <span className="text-slate-500 text-xs">vs last month</span>
              </div>
              {/* Graph SVG - downward trend */}
              <svg className="w-full h-16 mt-2" viewBox="0 0 260 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="redfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f04438" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#f04438" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polyline points="8,16 38,24 58,22 78,30 98,28 118,36 138,34 158,42 178,40 198,48 218,46 238,56 252,60" fill="none" stroke="#F04438" strokeWidth="3"/>
                <polygon points="8,16 38,24 58,22 78,30 98,28 118,36 138,34 158,42 178,40 198,48 218,46 238,56 252,60 252,64 8,64" fill="url(#redfill)"/>
                <circle cx="252" cy="60" r="7" fill="#fff" stroke="#F04438" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default SustainabilitySection; 