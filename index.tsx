import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import lottie from 'lottie-web';
import { GoogleGenAI } from "@google/genai";

// --- Theme Context ---
const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

const useTheme = () => useContext(ThemeContext);

// --- Icons ---
const Icons = {
  Logo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
      <path d="M11 21L16 11L21 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 16H18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="16" r="10" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5"/>
          <stop offset="1" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  Brain: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.97 14.716A4 4 0 0 1 16 18"/></svg>
  ),
  Cpu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
  ),
  LineChart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  ),
  MessageSquare: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  ChevronRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  ShieldCheck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  AlertCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Loader: () => (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  )
};

// --- Helper Functions ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function analyzeProject(description: string, retries = 3): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as an AI business strategist for "AISolutions". 
        A potential client provided this project description: "${description}". 
        Write a concise, professional 2-sentence response acknowledging their specific need and suggesting 1-2 AI technologies (like RAG, Computer Vision, or LLM fine-tuning) that would solve it. Keep it encouraging and high-level.`,
      });
      return response.text || "Thank you for sharing your vision. Our team is excited to explore how advanced AI models can transform your business workflows.";
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await sleep(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
  return "Our team is reviewing your project requirements and will reach out with a tailored strategy soon.";
}

// --- Components ---

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(8px)', 
      borderBottom: '1px solid var(--gray-200)',
      transition: 'background-color var(--transition-speed)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '1.5rem', cursor: 'pointer' }} 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Icons.Logo />
          <span style={{ color: 'var(--dark)', letterSpacing: '-0.03em' }}>AISolutions</span>
        </div>

        <nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>Services</a>
          <a onClick={() => scrollToSection('packages')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>Packages</a>
          <a onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>About</a>
          
          <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle Theme">
            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          
          <a onClick={() => scrollToSection('contact')} className="btn btn-primary">Book Consultation</a>
        </nav>

        <div style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', gap: '1rem', alignItems: 'center' }}>
          <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle Theme">
            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--dark)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icons.Menu />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '80px', 
          left: 0, right: 0, 
          background: 'var(--white)', 
          padding: '2rem', 
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          transition: 'background-color var(--transition-speed)'
        }}>
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>Services</a>
          <a onClick={() => scrollToSection('packages')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>Packages</a>
          <a onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>About</a>
          <a onClick={() => scrollToSection('contact')} className="btn btn-primary" style={{ justifyContent: 'center' }}>Book Consultation</a>
        </div>
      )}
    </header>
  );
}

function LottiePlayer({ src, style, speed = 1, loop = true }: { src: string, style?: React.CSSProperties, speed?: number, loop?: boolean }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: loop,
      autoplay: true,
      path: src
    });

    anim.setSpeed(speed);

    return () => anim.destroy();
  }, [src, speed, loop]);

  return <div ref={container} style={style} />;
}

function Hero() {
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToServices = () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  const { isDarkMode } = useTheme();

  return (
    <section className="section" style={{ padding: '6rem 0', background: isDarkMode ? 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 70%)' : 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.05) 0%, transparent 50%)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: isDarkMode ? 0.05 : 0.03, overflow: 'hidden', pointerEvents: 'none' }}>
         <LottiePlayer 
            src="https://lottie.host/e8c89487-2592-42e8-89c7-50b9222c83c2/5Y6S6C6q6r.json"
            style={{ width: '120%', height: '120%', transform: 'translate(-10%, -10%)', filter: 'blur(8px) hue-rotate(45deg)' }}
            speed={0.2}
         />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '2rem' }}>
          <div>
            <span className="badge">Next Gen AI</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--dark)' }}>
              Empowering Businesses with <br/>
              <span className="text-gradient">Intelligent AI Solutions</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)', maxWidth: '600px', margin: '0 0 2.5rem' }}>
              Your trusted AI provider. Automate operations, enhance customer experience, and unlock data-driven growth with our cutting-edge technology.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={scrollToContact} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Book a Free Consultation
              </button>
              <button onClick={scrollToServices} className="btn btn-outline learn-more-btn" style={{ padding: '1rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Learn More <Icons.ChevronRight />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', animation: 'float 6s ease-in-out infinite' }}>
            <LottiePlayer 
              src="https://lottie.host/e8c89487-2592-42e8-89c7-50b9222c83c2/5Y6S6C6q6r.json" 
              style={{ width: '100%', maxWidth: '500px', height: 'auto', filter: isDarkMode ? 'drop-shadow(0 20px 30px rgba(79, 70, 229, 0.4))' : 'drop-shadow(0 20px 30px rgba(79, 70, 229, 0.15))' }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { icon: <Icons.Brain />, title: 'AI Model Development', desc: 'Custom-built models tailored to your business needs—LLMs, classification models, prediction engines, and more.' },
    { icon: <Icons.Cpu />, title: 'Business Automation', desc: 'Intelligent bots, automated workflows, and smart systems that reduce manual work and increase efficiency.' },
    { icon: <Icons.LineChart />, title: 'Predictive Analytics', desc: 'Data-driven insights to help you make faster decisions—demand forecasting, customer behavior, churn prediction.' },
    { icon: <Icons.MessageSquare />, title: 'Conversational AI', desc: 'Smart virtual assistants and chatbots that offer real-time support and personalized interactions.' }
  ];

  return (
    <section id="services" className="section bg-light">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--dark)' }}>Our Services</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>Comprehensive AI solutions designed for modern enterprises.</p>
        </div>
        <div className="grid grid-4">
          {services.map((s, i) => (
            <div key={i} className="card">
              <div className="service-icon" style={{ color: 'var(--primary)', marginBottom: '1.5rem', background: 'rgba(79, 70, 229, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--dark)' }}>{s.title}</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages() {
  const packages = [
    { name: 'Startup AI Package', target: 'Small Businesses', features: ['Basic chatbot', 'Data summary tools', 'Monthly insights dashboard'], color: '#4f46e5' },
    { name: 'Growth AI Package', target: 'Scaling Companies', features: ['Advanced conversational agent', 'Automated workflows', 'Custom analytics dashboards'], featured: true, color: '#7c3aed' },
    { name: 'Enterprise AI Suite', target: 'Large Organizations', features: ['Fully customized AI models', 'System integrations', 'High-security & compliance'], color: '#2563eb' }
  ];

  return (
    <section id="packages" className="section">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--dark)' }}>Ready-Made AI Solutions</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>Select a package that fits your stage of growth.</p>
        </div>
        <div className="grid grid-3">
          {packages.map((p, i) => (
            <div key={i} className="card" style={{ 
              position: 'relative', 
              borderColor: p.featured ? 'var(--primary)' : 'var(--gray-200)',
              borderWidth: p.featured ? '2px' : '1px',
              transform: p.featured ? 'scale(1.05)' : 'none',
              zIndex: p.featured ? 10 : 1
            }}>
              {p.featured && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Most Popular</div>
              )}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>{p.name}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>For {p.target}</p>
              </div>
              <ul className="feature-list" style={{ listStyle: 'none', marginBottom: '2rem' }}>
                {p.features.map((f, fi) => <li key={fi}><Icons.Check />{f}</li>)}
              </ul>
              <button className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutAndCases() {
  const { isDarkMode } = useTheme();
  return (
    <div id="about">
      <section className="section bg-light">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <span className="badge">About Us</span>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', color: 'var(--dark)' }}>We accelerate digital transformation.</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)', marginBottom: '2rem' }}>
                We are a Saudi AI provider specialized in building intelligent, easy-to-use solutions. Our mission is to make advanced AI accessible, practical, and impactful for businesses of all sizes.
              </p>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                {['Expert engineering team', 'Certified AI competencies', 'Proven industry use cases', 'Strategic partnerships'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--dark)' }}>
                    <div style={{ color: 'var(--primary)' }}><Icons.ShieldCheck /></div>{item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-200)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--dark)' }}>Case Studies</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { title: 'Customer Support Chatbot', res: 'Reduced response time by 80%' },
                  { title: 'Automated Internal Workflow', res: 'Saved 200+ hours monthly' },
                  { title: 'Predictive Business Model', res: 'Improved demand forecast by 35%' }
                ].map((c, i) => (
                  <div key={i} style={{ paddingBottom: i !== 2 ? '1.5rem' : 0, borderBottom: i !== 2 ? '1px solid var(--gray-100)' : 'none' }}>
                    <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--dark)' }}>{c.title}</h4>
                    <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>{c.res}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', company: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Initializing analysis...');
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { isDarkMode } = useTheme();

  const statusMessages = [
    'Parsing project requirements...',
    'Evaluating AI feasibility...',
    'Consulting knowledge graphs...',
    'Generating architectural strategy...',
    'Finalizing recommendations...',
  ];

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (value && !/^[\d\s+\-()]{7,15}$/.test(value)) return 'Please enter a valid phone number';
        return '';
      case 'description':
        if (!value.trim()) return 'Project description is required';
        if (value.trim().length < 10) return 'Please provide more detail (minimum 10 characters)';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (touched[name] || errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const isFormValid = () => {
    const currentErrors = {
      name: validateField('name', formState.name),
      email: validateField('email', formState.email),
      phone: validateField('phone', formState.phone),
      description: validateField('description', formState.description),
    };
    return !Object.values(currentErrors).some(err => err !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    
    if (!isFormValid()) {
      const allTouched = Object.keys(formState).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
      return;
    }

    setIsSubmitting(true);
    setLoadingProgress(5);
    setLoadingStatus(statusMessages[0]);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        const step = Math.floor(prev / 20);
        setLoadingStatus(statusMessages[step] || statusMessages[statusMessages.length - 1]);
        return prev + (100 - prev) * 0.1;
      });
    }, 600);

    try {
      const analysis = await analyzeProject(formState.description);
      setAiAnalysis(analysis);
      setLoadingProgress(100);
      setLoadingStatus('Analysis complete!');
      await sleep(600); // Give user a moment to see the completion
      setSubmitted(true);
    } catch (error: any) {
      console.error("Form submission failed:", error);
      setApiError("We encountered a technical issue processing your AI analysis request. Please try again or contact us directly at support@aisolutions.com.");
    } finally {
      clearInterval(progressInterval);
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormState({ name: '', email: '', phone: '', company: '', description: '' });
    setErrors({});
    setTouched({});
    setApiError(null);
    setAiAnalysis(null);
    setLoadingProgress(0);
  };

  const getFieldError = (name: string) => touched[name] && errors[name];

  return (
    <section id="contact" className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--dark)' }}>Start Your AI Journey Today</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>
            Fill out the form to receive personalized recommendations and project guidance.
          </p>
        </div>
        
        {submitted ? (
          <div className="card text-center" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'slideDown 0.5s ease-out' }}>
            <div style={{ width: '300px', height: '220px', marginBottom: '1rem', overflow: 'hidden' }}>
               <LottiePlayer 
                  src="https://lottie.host/c5a17621-e374-4b53-90d1-05367615998f/qNfL5L3M6F.json" 
                  loop={false} 
                  speed={1}
               />
            </div>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="text-gradient">Triumph!</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem', maxWidth: '500px', lineHeight: 1.6 }}>
              Your vision has been captured. Our strategic engineering team is already reviewing your requirements and will reach out to schedule your deep-dive consultation within 24 hours.
            </p>
            <button className="btn btn-outline" style={{ marginTop: '3rem', padding: '0.75rem 2.5rem' }} onClick={resetForm}>
              Submit Another Project
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ opacity: isSubmitting ? 0.9 : 1, transition: 'opacity 0.2s, background-color var(--transition-speed)' }}>
            {apiError && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem' }}>
                <Icons.AlertCircle />
                <div style={{ flex: 1 }}>
                  <strong>Error processing request</strong>
                  <p style={{ marginTop: '0.25rem' }}>{apiError}</p>
                  <button type="button" onClick={handleSubmit} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, textDecoration: 'underline', padding: 0, marginTop: '0.5rem', cursor: 'pointer' }}>Retry Submission</button>
                </div>
              </div>
            )}
            
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--gray-800)' }}>Name</label>
                <input 
                  required 
                  disabled={isSubmitting}
                  name="name" 
                  className={`input-field ${getFieldError('name') ? 'error' : ''}`} 
                  type="text" 
                  placeholder="John Doe" 
                  value={formState.name} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getFieldError('name') && <span className="error-message">{errors.name}</span>}
              </div>
              <div>
                <label style={{ color: 'var(--gray-800)' }}>Email</label>
                <input 
                  required 
                  disabled={isSubmitting}
                  name="email" 
                  className={`input-field ${getFieldError('email') ? 'error' : ''}`} 
                  type="email" 
                  placeholder="john@company.com" 
                  value={formState.email} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getFieldError('email') && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--gray-800)' }}>Phone (Optional)</label>
                <input 
                  disabled={isSubmitting}
                  name="phone" 
                  className={`input-field ${getFieldError('phone') ? 'error' : ''}`} 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={formState.phone} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getFieldError('phone') && <span className="error-message">{errors.phone}</span>}
              </div>
              <div>
                <label style={{ color: 'var(--gray-800)' }}>Company</label>
                <input 
                  disabled={isSubmitting}
                  name="company" 
                  className="input-field" 
                  type="text" 
                  placeholder="Your Company Ltd" 
                  value={formState.company} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ color: 'var(--gray-800)' }}>Project Description</label>
              <textarea 
                required 
                disabled={isSubmitting}
                name="description" 
                className={`input-field ${getFieldError('description') ? 'error' : ''}`} 
                rows={4} 
                placeholder="Briefly describe your business challenge or vision..." 
                value={formState.description} 
                onChange={handleChange}
                onBlur={handleBlur}
              ></textarea>
              {getFieldError('description') && <span className="error-message">{errors.description}</span>}
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>Our AI engine will perform a preliminary feasibility analysis of your request instantly.</p>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                fontSize: '1.125rem', 
                gap: '0.75rem', 
                position: 'relative', 
                overflow: 'hidden',
                minHeight: '56px'
              }}
              disabled={isSubmitting || (!isFormValid() && Object.keys(touched).length > 0)}
            >
              {isSubmitting && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  height: '4px', 
                  background: 'rgba(255, 255, 255, 0.4)', 
                  width: `${loadingProgress}%`,
                  transition: 'width 0.4s ease-out',
                  zIndex: 2
                }} />
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 3 }}>
                {isSubmitting ? (
                  <>
                    <Icons.Loader /> {loadingStatus}
                  </>
                ) : (
                  <>
                    Book Consultation <Icons.ChevronRight />
                  </>
                )}
              </div>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', color: 'var(--white)', padding: '4rem 0 2rem', transition: 'background-color var(--transition-speed), color var(--transition-speed)' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: '4rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}>
              <div style={{ width: 24, height: 24, background: 'var(--gradient-primary)', borderRadius: '4px' }}></div>
              AISolutions
            </h3>
            <p style={{ color: 'var(--gray-500)', maxWidth: '300px' }}>
              Empowering businesses with intelligent, scalable, and secure AI technology.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', color: 'inherit' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--gray-500)' }}>
              <a href="#" style={{ color: 'inherit' }}>About Us</a>
              <a href="#" style={{ color: 'inherit' }}>Services</a>
              <a href="#" style={{ color: 'inherit' }}>Case Studies</a>
              <a href="#" style={{ color: 'inherit' }}>Contact</a>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', color: 'inherit' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--gray-500)' }}>
              <a href="#" style={{ color: 'inherit' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'inherit' }}>Terms of Service</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--gray-800)', paddingTop: '2rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} AISolutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Hero />
      <Services />
      <Packages />
      <AboutAndCases />
      <Contact />
      <Footer />
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);