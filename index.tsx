import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import lottie from 'lottie-web';

// --- Icons ---
const Icons = {
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
  Rocket: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.1 4-1 4-1"/><path d="M12 15v5s3.03-.55 4-2c1.1-1.62 1-4 1-4"/></svg>
  )
};

// --- Components ---

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--gray-200)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>
          <div style={{ width: 32, height: 32, background: 'var(--gradient-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <span style={{ fontSize: '1.25rem' }}>A</span>
          </div>
          <span>AISolutions</span>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 500 }}>Services</a>
          <a onClick={() => scrollToSection('packages')} style={{ cursor: 'pointer', fontWeight: 500 }}>Packages</a>
          <a onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', fontWeight: 500 }}>About</a>
          <a onClick={() => scrollToSection('contact')} className="btn btn-primary">Book Consultation</a>
        </nav>

        {/* Mobile Nav Button */}
        <button 
          style={{ display: window.innerWidth > 768 ? 'none' : 'block', background: 'none', border: 'none', color: 'var(--dark)' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Icons.Menu />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '80px', 
          left: 0, 
          right: 0, 
          background: 'white', 
          padding: '2rem', 
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 500 }}>Services</a>
          <a onClick={() => scrollToSection('packages')} style={{ cursor: 'pointer', fontWeight: 500 }}>Packages</a>
          <a onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', fontWeight: 500 }}>About</a>
          <a onClick={() => scrollToSection('contact')} className="btn btn-primary" style={{ justifyContent: 'center' }}>Book Consultation</a>
        </div>
      )}
    </header>
  );
}

function LottiePlayer({ src, style, speed = 1 }: { src: string, style?: React.CSSProperties, speed?: number }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: src
    });

    anim.setSpeed(speed);

    return () => anim.destroy();
  }, [src, speed]);

  return <div ref={container} style={style} />;
}

function Hero() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section" style={{ padding: '6rem 0', background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.05) 0%, transparent 50%)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Animated Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.03, overflow: 'hidden', pointerEvents: 'none' }}>
         <LottiePlayer 
            src="https://lottie.host/e8c89487-2592-42e8-89c7-50b9222c83c2/5Y6S6C6q6r.json"
            style={{ width: '120%', height: '120%', transform: 'translate(-10%, -10%)', filter: 'blur(8px) hue-rotate(45deg)' }}
            speed={0.2}
         />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <span className="badge">Next Gen AI</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>
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
            {/* Main Hero Animation */}
            <LottiePlayer 
              src="https://lottie.host/e8c89487-2592-42e8-89c7-50b9222c83c2/5Y6S6C6q6r.json" 
              style={{ width: '100%', maxWidth: '500px', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(79, 70, 229, 0.15))' }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: <Icons.Brain />,
      title: 'AI Model Development',
      desc: 'Custom-built models tailored to your business needs—LLMs, classification models, prediction engines, and more.'
    },
    {
      icon: <Icons.Cpu />,
      title: 'Business Automation',
      desc: 'Intelligent bots, automated workflows, and smart systems that reduce manual work and increase efficiency.'
    },
    {
      icon: <Icons.LineChart />,
      title: 'Predictive Analytics',
      desc: 'Data-driven insights to help you make faster decisions—demand forecasting, customer behavior, churn prediction.'
    },
    {
      icon: <Icons.MessageSquare />,
      title: 'Conversational AI',
      desc: 'Smart virtual assistants and chatbots that offer real-time support and personalized interactions.'
    }
  ];

  return (
    <section id="services" className="section bg-light">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Our Services</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>Comprehensive AI solutions designed for modern enterprises.</p>
        </div>
        <div className="grid grid-4">
          {services.map((s, i) => (
            <div key={i} className="card">
              <div className="service-icon" style={{ color: 'var(--primary)', marginBottom: '1.5rem', background: 'var(--gray-100)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{s.title}</h3>
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
    {
      name: 'Startup AI Package',
      target: 'Small Businesses',
      features: ['Basic chatbot', 'Data summary tools', 'Monthly insights dashboard'],
      color: '#4f46e5'
    },
    {
      name: 'Growth AI Package',
      target: 'Scaling Companies',
      features: ['Advanced conversational agent', 'Automated workflows', 'Custom analytics dashboards'],
      featured: true,
      color: '#7c3aed'
    },
    {
      name: 'Enterprise AI Suite',
      target: 'Large Organizations',
      features: ['Fully customized AI models', 'System integrations', 'High-security & compliance'],
      color: '#2563eb'
    }
  ];

  return (
    <section id="packages" className="section">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Ready-Made AI Solutions</h2>
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
                <div style={{ 
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', 
                  background: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', 
                  borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{p.name}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>For {p.target}</p>
              </div>
              <ul className="feature-list" style={{ listStyle: 'none', marginBottom: '2rem' }}>
                {p.features.map((f, fi) => (
                  <li key={fi}>
                    <Icons.Check />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutAndCases() {
  return (
    <div id="about">
      {/* About Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <span className="badge">About Us</span>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem' }}>We accelerate digital transformation.</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)', marginBottom: '2rem' }}>
                We are a Saudi AI provider specialized in building intelligent, easy-to-use solutions. 
                Our mission is to make advanced AI accessible, practical, and impactful for businesses of all sizes.
              </p>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                {['Expert engineering team', 'Certified AI competencies', 'Proven industry use cases', 'Strategic partnerships'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                    <div style={{ color: 'var(--primary)' }}><Icons.ShieldCheck /></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: 'var(--radius)', 
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--gray-200)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Case Studies</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { title: 'Customer Support Chatbot', res: 'Reduced response time by 80%' },
                  { title: 'Automated Internal Workflow', res: 'Saved 200+ hours monthly' },
                  { title: 'Predictive Business Model', res: 'Improved demand forecast by 35%' }
                ].map((c, i) => (
                  <div key={i} style={{ paddingBottom: i !== 2 ? '1.5rem' : 0, borderBottom: i !== 2 ? '1px solid var(--gray-100)' : 'none' }}>
                    <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{c.title}</h4>
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
  const [formState, setFormState] = useState({
    name: '', email: '', phone: '', company: '', description: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send data to backend here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Start Your AI Journey Today</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>
            Fill out the form to receive personalized recommendations and project guidance.
          </p>
        </div>
        
        {submitted ? (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Thank You!</h3>
            <p style={{ color: 'var(--gray-500)' }}>We have received your request and will contact you shortly.</p>
            <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card">
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <label>Name</label>
                <input required name="name" className="input-field" type="text" placeholder="John Doe" value={formState.name} onChange={handleChange} />
              </div>
              <div>
                <label>Email</label>
                <input required name="email" className="input-field" type="email" placeholder="john@company.com" value={formState.email} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <label>Phone</label>
                <input name="phone" className="input-field" type="tel" placeholder="+1 (555) 000-0000" value={formState.phone} onChange={handleChange} />
              </div>
              <div>
                <label>Company</label>
                <input name="company" className="input-field" type="text" placeholder="Your Company Ltd" value={formState.company} onChange={handleChange} />
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label>Project Description</label>
              <textarea required name="description" className="input-field" rows={4} placeholder="Tell us about your needs..." value={formState.description} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.125rem' }}>
              Get Started <span style={{ marginLeft: '0.5rem' }}><Icons.ChevronRight /></span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', color: 'white', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: '4rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 24, height: 24, background: 'var(--gradient-primary)', borderRadius: '4px' }}></div>
              AISolutions
            </h3>
            <p style={{ color: 'var(--gray-500)', maxWidth: '300px' }}>
              Empowering businesses with intelligent, scalable, and secure AI technology.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--gray-500)' }}>
              <a href="#" style={{ color: 'var(--gray-200)' }}>About Us</a>
              <a href="#" style={{ color: 'var(--gray-200)' }}>Services</a>
              <a href="#" style={{ color: 'var(--gray-200)' }}>Case Studies</a>
              <a href="#" style={{ color: 'var(--gray-200)' }}>Contact</a>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--gray-500)' }}>
              <a href="#" style={{ color: 'var(--gray-200)' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'var(--gray-200)' }}>Terms of Service</a>
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

function App() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Packages />
      <AboutAndCases />
      <Contact />
      <Footer />
    </>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);