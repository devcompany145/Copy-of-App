import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import lottie from 'lottie-web';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type Language = 'en' | 'ar';
type PageView = 'home' | 'about' | 'audit' | 'security' | 'scalability' | 'compliance' | 'privacy' | 'terms';

// --- Theme & Language Context ---
const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  t: (key: string) => string;
}>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  language: 'en',
  setLanguage: () => {},
  activePage: 'home',
  setActivePage: () => {},
  t: (key) => key,
});

const useTheme = () => useContext(ThemeContext);

// --- Translations ---
const translations: Record<Language, Record<string, string>> = {
  en: {
    brand: "BUSINESS DEVELOPERS",
    nav_services: "Capabilities",
    nav_packages: "Portfolio",
    nav_about: "Institutional",
    nav_contact: "Dialogue",
    btn_consultation: "Inquiry",
    hero_badge: "Institutional Intelligence",
    hero_title: "Systemic Engineering for",
    hero_title_accent: "Global Scale",
    hero_desc: "Exclusive strategic development through sovereign engineering. We deploy proprietary AI frameworks to automate critical business operations and reclaim operational excellence.",
    hero_btn_main: "Initiate Dialogue",
    hero_btn_sec: "The Architecture",
    services_title: "Core Expertise",
    services_desc: "A systematic approach to artificial intelligence for the most ambitious global organizations.",
    service_1_title: "Strategic Architecture",
    service_1_desc: "Bespoke intelligence models engineered to integrate with high-security institutional data systems.",
    service_2_title: "Autonomous Logistics",
    service_2_desc: "Sophisticated decision-making layers that eliminate friction and optimize total production throughput.",
    service_3_title: "Asset Intelligence",
    service_3_desc: "High-fidelity predictive analytics for demand forecasting and complex portfolio risk mitigation.",
    service_4_title: "Experience Nodes",
    service_4_desc: "Elite conversational frameworks providing hyper-personalized engagement for institutional clients.",
    packages_title: "Engagement Models",
    packages_desc: "Structured tiers for organizations prioritizing high-fidelity intelligence deployment.",
    pkg_1_name: "Innovation Tier",
    pkg_1_target: "Agile Entities",
    pkg_2_name: "Strategic Growth",
    pkg_2_target: "Market Leaders",
    pkg_3_name: "Sovereign Tier",
    pkg_3_target: "Global Institutions",
    pkg_popular: "Institutional Standard",
    pkg_btn: "Request Access",
    about_badge: "Institutional Profile",
    about_title: "Architecting the future.",
    about_desc: "We are a premier intelligence firm based on precision. Our mission is to transform theoretical AI into practical, sovereign strategic assets.",
    about_content: "Established as a beacon of high-fidelity engineering, Business Developers represents the intersection of capital strategy and machine intelligence. We operate on a global scale, providing the architectural foundation for the next century of enterprise operations. Our guild consists of senior architects, security specialists, and strategic partners dedicated to data sovereignty.",
    audit_title: "Feasibility Audit",
    audit_desc: "The Protocol for Technical Validation",
    audit_content: "Every engagement begins with a rigorous multi-stage audit. We evaluate existing data infrastructure, computational readiness, and strategic alignment. Our reports provide a clear path from legacy operations to total AI autonomy, backed by deep technical verification.",
    security_title: "Sovereign Security",
    security_desc: "Zero-Knowledge & Data Sovereignty",
    security_content: "We implement sovereign security protocols that ensure your proprietary intelligence remains yours. Our frameworks prioritize localized hosting, encrypted neural pathways, and institutional-grade access control. Security is not a feature; it is our foundation.",
    scalability_title: "Industrial Scalability",
    scalability_desc: "High-Load Resilience",
    scalability_content: "Our systems are built to withstand the rigors of global institutional demand. From petabyte-scale data ingestion to millisecond latency inference, we engineer for resilience. Scaling intelligence means scaling your entire competitive advantage without compromise.",
    compliance_title: "Institutional Compliance",
    compliance_desc: "Regulatory & Ethical Alignment",
    compliance_content: "Business Developers operates within the highest standards of international regulatory frameworks. We ensure all AI deployments are transparent, auditable, and compliant with regional data protection laws and institutional governance standards.",
    privacy_title: "Privacy Protocol",
    privacy_desc: "Proprietary Data Protection",
    privacy_content: "Your data is your most valuable asset. Our Privacy Protocol guarantees that no client information is used for external model training. We deploy air-gapped systems and advanced encryption to maintain the absolute confidentiality of your strategic brief.",
    terms_title: "Terms of Engagement",
    terms_desc: "Contractual Standards",
    terms_content: "Engagement with Business Developers is governed by a strict framework of professional ethics and technical standards. We provide clear deliverables, transparent timelines, and guaranteed uptime protocols for all sovereign AI clusters.",
    contact_title: "Operational Brief",
    contact_desc: "Brief our senior architecture team on your strategic objectives to begin the feasibility audit.",
    form_btn: "Transmit Brief",
    btn_back: "Return to Headquarters",
    footer_desc: "Engineering the future of intelligent systems through geometric precision and high-contrast technology.",
    footer_company: "Institution",
    footer_legal: "Compliance",
    footer_copy: "All institutional rights reserved.",
    status_1: "Analyzing brief parameters...",
    status_2: "Validating technical feasibility...",
    status_3: "Referencing global benchmarks...",
    status_4: "Synthesizing response...",
    status_5: "Finalizing audit...",
  },
  ar: {
    brand: "بيزنس ديفلوبرز",
    nav_services: "القدرات",
    nav_packages: "المحفظة",
    nav_about: "المؤسسة",
    nav_contact: "الحوار",
    btn_consultation: "استفسار",
    hero_badge: "ذكاء مؤسسي",
    hero_title: "هندسة منهجية لـ",
    hero_title_accent: "نطاق عالمي",
    hero_desc: "تطوير استراتيجي حصري من خلال الهندسة السيادية. نقوم بنشر أطر ذكاء اصطناعي خاصة لأتمتة العمليات التجارية الحيوية واستعادة التميز التشغيلي.",
    hero_btn_main: "بدء الحوار",
    hero_btn_sec: "المعمارية",
    services_title: "الخبرات الجوهرية",
    services_desc: "نهج منهجي للذكاء الاصطناعي لأكثر المنظمات العالمية طموحاً.",
    service_1_title: "المعمارية الاستراتيجية",
    service_1_desc: "نماذج ذكاء مصممة خصيصاً للتكامل مع أنظمة البيانات المؤسسية عالية الأمن.",
    service_2_title: "اللوجستيات المستقلة",
    service_2_desc: "طبقات اتخاذ قرار متطورة تقضي على الاحتكاك وتحسن إجمالي إنتاجية العمليات.",
    service_3_title: "ذكاء الأصول",
    service_3_desc: "تحليلات تنبؤية عالية الدقة لتوقع الطلب وتخفيف مخاطر المحافظ المعقدة.",
    service_4_title: "عقد التجربة",
    service_4_desc: "أطر عمل محادثة نخبوية توفر مشاركة فائقة التخصيص لعملاء المؤسسات.",
    packages_title: "نماذج المشاركة",
    packages_desc: "فئات مهيكلة للمنظمات التي تعطي الأولوية لنشر الذكاء عالي الدقة.",
    pkg_1_name: "فئة الابتكار",
    pkg_1_target: "للكيانات المرنة",
    pkg_2_name: "النمو الاستراتيجي",
    pkg_2_target: "لقادة السوق",
    pkg_3_name: "الفئة السيادية",
    pkg_3_target: "للمؤسسات العالمية",
    pkg_popular: "المعيار المؤسسي",
    pkg_btn: "طلب الدخول",
    about_badge: "ملف المؤسسة",
    about_title: "هندسة المستقبل.",
    about_desc: "نحن مؤسسة استخبارات تقنية رائدة قائمة على الدقة. مهمتنا هي تحويل الذكاء الاصطناعي النظري إلى أصول استراتيجية سيادية.",
    about_content: "تأسست بيزنس ديفلوبرز كمنارة للهندسة عالية الدقة، وهي تمثل نقطة التقاء استراتيجية رأس المال وذكاء الآلة. نحن نعمل على نطاق عالمي، ونوفر الأساس المعماري للقرن القادم من العمليات المؤسسية. تضم نقابتنا كبار المهندسين المعماريين والمتخصصين في الأمن والشركاء الاستراتيجيين المخصصين لسيادة البيانات.",
    audit_title: "تدقيق الجدوى",
    audit_desc: "بروتوكول التحقق الفني",
    audit_content: "يبدأ كل تعاون بتدقيق صارم متعدد المراحل. نقوم بتقييم البنية التحتية الحالية للبيانات، والجاهزية الحسابية، والمواءمة الاستراتيجية. توفر تقاريرنا مساراً واضحاً من العمليات التقليدية إلى الاستقلالية الكاملة للذكاء الاصطناعي، مدعومة بتحقق فني عميق.",
    security_title: "الأمن السيادي",
    security_desc: "المعرفة الصفرية وسيادة البيانات",
    security_content: "نحن نطبق بروتوكولات أمنية سيادية تضمن بقاء ذكائك الخاص ملكاً لك. تعطي أطر عملنا الأولوية للاستضافة المحلية، والمسارات العصبية المشفرة، والتحكم في الوصول على مستوى المؤسسات. الأمن ليس ميزة؛ بل هو أساسنا.",
    scalability_title: "القابلية للتوسع الصناعي",
    scalability_desc: "المرونة تحت الأحمال العالية",
    scalability_content: "أنظمتنا مبنية لتتحمل ضغوط الطلب المؤسسي العالمي. من استيعاب البيانات بمقياس بيتابايت إلى الاستدلال بزمن وصول يقاس بالمللي ثانية، نحن نهندس من أجل المرونة. توسيع الذكاء يعني توسيع ميزتك التنافسية بالكامل دون مساومة.",
    compliance_title: "الامتثال المؤسسي",
    compliance_desc: "المواءمة التنظيمية والأخلاقية",
    compliance_content: "تعمل بيزنس ديفلوبرز ضمن أعلى معايير الأطر التنظيمية الدولية. نحن نضمن أن جميع عمليات نشر الذكاء الاصطناعي شفافة وقابلة للتدقيق ومتوافقة مع قوانين حماية البيانات الإقليمية ومعايير الحوكمة المؤسسية.",
    privacy_title: "بروتوكول الخصوصية",
    privacy_desc: "حماية البيانات المملوكة",
    privacy_content: "بياناتك هي أثمن أصولك. يضمن بروتوكول الخصوصية لدينا عدم استخدام أي معلومات للعملاء لتدريب نماذج خارجية. نحن ننشر أنظمة معزولة وتشفيرًا متقدمًا للحفاظ على السرية المطلقة لموجزك الاستراتيجي.",
    terms_title: "شروط التعاقد",
    terms_desc: "المعايير التعاقدية",
    terms_content: "تخضع المشاركة مع بيزنس ديفلوبرز لإطار صارم من الأخلاقيات المهنية والمعايير الفنية. نحن نقدم مخرجات واضحة وجداول زمنية شفافة وبروتوكولات وقت تشغيل مضمونة لجميع مجموعات الذكاء الاصطناعي السيادية.",
    contact_title: "موجز تشغيلي",
    contact_desc: "أطلع فريقنا المعماري على أهدافك الاستراتيجية لبدء تدقيق الجدوى.",
    form_btn: "إرسال الموجز",
    btn_back: "العودة للمقر الرئيسي",
    footer_desc: "هندسة مستقبل الأنظمة الذكية من خلال الدقة الهندسية والتكنولوجيا عالية التباين.",
    footer_company: "المؤسسة",
    footer_legal: "الامتثال",
    footer_copy: "جميع الحقوق المؤسسية محفوظة.",
    status_1: "تحليل معايير الموجز...",
    status_2: "التحقق من الجدوى الفنية...",
    status_3: "مراجعة المقاييس العالمية...",
    status_4: "توليف الرد...",
    status_5: "نهائي التدقيق...",
  }
};

// --- Icons ---
const Icons = {
  Logo: () => (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="45" width="4" height="35" fill="currentColor" />
      <rect x="35" y="35" width="4" height="45" fill="currentColor" />
      <rect x="45" y="40" width="4" height="40" fill="currentColor" />
      <rect x="55" y="30" width="4" height="50" fill="currentColor" />
      <rect x="65" y="45" width="4" height="35" fill="currentColor" />
      <circle cx="50" cy="20" r="5" fill="currentColor" />
      <circle cx="62" cy="15" r="3" fill="currentColor" />
      <path d="M30 60L40 50L50 55L70 40" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  ),
  Loader: () => (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  ),
  ArrowLeft: ({ lang }: { lang: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  )
};

// --- Components ---

function Header() {
  const { isDarkMode, toggleDarkMode, language, setLanguage, setActivePage, t } = useTheme();

  const handleNav = (page: PageView, sectionId?: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'home' && sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 50, 
      backgroundColor: isDarkMode ? 'rgba(0,26,42,0.98)' : 'rgba(252,252,252,0.98)', 
      borderBottom: '1px solid var(--gray-200)', transition: 'all var(--transition-speed)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '110px' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.3em', color: 'var(--primary)' }} 
          onClick={() => handleNav('home')}
        >
          <Icons.Logo />
          <span style={{ color: 'var(--dark)' }}>{t('brand')}</span>
        </div>

        <nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '3.5rem', alignItems: 'center' }}>
          <a onClick={() => handleNav('home', 'services')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_services')}</a>
          <a onClick={() => handleNav('home', 'packages')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_packages')}</a>
          <a onClick={() => handleNav('about')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_about')}</a>
          
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="theme-toggle" style={{ fontSize: '0.65rem', fontWeight: 900 }}>
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={toggleDarkMode} className="theme-toggle">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
          
          <a onClick={() => handleNav('home', 'contact')} className="btn btn-primary">{t('btn_consultation')}</a>
        </nav>
      </div>
    </header>
  );
}

function StaticPage({ view }: { view: PageView }) {
  const { t, setActivePage, language } = useTheme();
  
  const contentMap: Record<PageView, { title: string, desc: string, content: string }> = {
    home: { title: '', desc: '', content: '' },
    about: { title: t('about_badge'), desc: t('about_title'), content: t('about_content') },
    audit: { title: t('audit_title'), desc: t('audit_desc'), content: t('audit_content') },
    security: { title: t('security_title'), desc: t('security_desc'), content: t('security_content') },
    scalability: { title: t('scalability_title'), desc: t('scalability_desc'), content: t('scalability_content') },
    compliance: { title: t('compliance_title'), desc: t('compliance_desc'), content: t('compliance_content') },
    privacy: { title: t('privacy_title'), desc: t('privacy_desc'), content: t('privacy_content') },
    terms: { title: t('terms_title'), desc: t('terms_desc'), content: t('terms_content') }
  };

  const { title, desc, content } = contentMap[view];

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <button 
          onClick={() => { setActivePage('home'); window.scrollTo(0, 0); }} 
          className="btn btn-outline" 
          style={{ marginBottom: '4rem', padding: '0.75rem 1.5rem', display: 'flex', gap: '1rem', border: '1px solid var(--gray-200)' }}
        >
          <Icons.ArrowLeft lang={language} /> {t('btn_back')}
        </button>
        <span className="badge">{title}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '2.5rem', lineHeight: 1.1, color: 'var(--dark)' }}>{desc}</h1>
        <div style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--gray-500)', borderLeft: language === 'en' ? '4px solid var(--primary)' : 'none', borderRight: language === 'ar' ? '4px solid var(--primary)' : 'none', padding: '0 2rem' }}>
          {content}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const { isDarkMode, t } = useTheme();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const anim = lottie.loadAnimation({ container: container.current, renderer: 'svg', loop: true, autoplay: true, path: "https://lottie.host/e8c89487-2592-42e8-89c7-50b9222c83c2/5Y6S6C6q6r.json" });
    return () => anim.destroy();
  }, []);

  return (
    <section className="section" style={{ padding: '12rem 0', background: isDarkMode ? '#001a2a' : '#fcfcfc', overflow: 'hidden', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="badge">{t('hero_badge')}</span>
            <h1 style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', marginBottom: '3rem', fontWeight: 900, lineHeight: 0.95, color: 'var(--dark)' }}>
              {t('hero_title')} <br/>
              <span style={{ borderBottom: '8px solid var(--primary)' }}>{t('hero_title_accent')}</span>
            </h1>
            <p style={{ fontSize: '1.45rem', color: 'var(--gray-500)', maxWidth: '680px', margin: '0 0 5rem', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.5 }}>
              {t('hero_desc')}
            </p>
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary" style={{ minWidth: '260px', height: '65px' }}>
                {t('hero_btn_main')}
              </button>
              <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-outline" style={{ minWidth: '260px', height: '65px' }}>
                {t('hero_btn_sec')}
              </button>
            </div>
          </div>
          <div ref={container} style={{ width: '100%', maxWidth: '650px', opacity: 0.95, filter: 'contrast(1.1) brightness(0.9)' }} />
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { language, t } = useTheme();
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', company: '', budget: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(t('status_1'));
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const msgs = [t('status_1'), t('status_2'), t('status_3'), t('status_4'), t('status_5')];
    for (const m of msgs) {
      setLoadingStatus(m);
      await sleep(1000);
    }
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="section bg-light" style={{ borderTop: '1px solid var(--gray-200)' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="text-center" style={{ marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem', color: 'var(--dark)' }}>{t('contact_title')}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.35rem' }}>{t('contact_desc')}</p>
        </div>
        
        {submitted ? (
          <div className="card text-center success-card" style={{ padding: '8rem 4rem', animation: 'popIn 0.5s ease' }}>
            <h3 style={{ fontSize: '4rem', marginBottom: '2.5rem' }}>{t('success_title')}</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.45rem', marginBottom: '5rem', maxWidth: '700px', margin: '0 auto 5rem', lineHeight: 1.7 }}>{t('success_msg')}</p>
            <button className="btn btn-primary" onClick={() => setSubmitted(false)}>{t('success_btn')}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ border: '2px solid var(--gray-200)', padding: '6rem' }}>
            <div className="grid grid-2" style={{ marginBottom: '4rem' }}>
              <input required className="input-field" placeholder={t('form_name')} />
              <input required className="input-field" type="email" placeholder={t('form_email')} />
            </div>
            <textarea required className="input-field" rows={7} placeholder={t('form_desc_placeholder')}></textarea>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '80px', marginTop: '4rem' }} disabled={isSubmitting}>
              {isSubmitting ? <Icons.Loader /> : t('form_btn')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const { t, setActivePage } = useTheme();
  
  const handlePage = (p: PageView) => {
    setActivePage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: 'var(--secondary)', color: 'white', padding: '10rem 0 5rem' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: '10rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'inherit', letterSpacing: '0.5em' }}>
              <Icons.Logo /> {t('brand')}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '450px', fontSize: '1rem', lineHeight: '1.9' }}>{t('footer_desc')}</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.3em', marginBottom: '2.5rem' }}>{t('footer_company')}</h4>
            <div className="footer-links">
              <a onClick={() => handlePage('about')}>{t('nav_about')}</a>
              <a onClick={() => handlePage('audit')}>Audit</a>
              <a onClick={() => handlePage('security')}>Security</a>
              <a onClick={() => handlePage('scalability')}>Scalability</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.3em', marginBottom: '2.5rem' }}>{t('footer_legal')}</h4>
            <div className="footer-links">
              <a onClick={() => handlePage('compliance')}>{t('compliance_title')}</a>
              <a onClick={() => handlePage('privacy')}>Privacy Protocol</a>
              <a onClick={() => handlePage('terms')}>Terms of Engagement</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', letterSpacing: '0.25em' }}>
          &copy; {new Date().getFullYear()} {t('brand')}. {t('footer_copy')}
        </div>
      </div>
    </footer>
  );
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');
  const [activePage, setActivePage] = useState<PageView>('home');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', language);
  }, [language]);

  const t = (key: string) => translations[language][key] || key;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode: () => setIsDarkMode(!isDarkMode), language, setLanguage, activePage, setActivePage, t }}>
      <Header />
      <main>
        {activePage === 'home' ? (
          <>
            <Hero />
            <section id="services" className="section bg-light" style={{ borderTop: '1px solid var(--gray-200)' }}>
              <div className="container">
                <div className="text-center" style={{ marginBottom: '8rem' }}>
                  <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem' }}>{t('services_title')}</h2>
                  <p style={{ color: 'var(--gray-500)', fontSize: '1.35rem', maxWidth: '800px', margin: '0 auto' }}>{t('services_desc')}</p>
                </div>
                <div className="grid grid-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card" style={{ borderTop: '8px solid var(--primary)' }}>
                      <h3 style={{ marginBottom: '1.75rem', fontSize: '1.25rem' }}>{t(`service_${i}_title`)}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>{t(`service_${i}_desc`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section id="packages" className="section">
              <div className="container">
                <div className="text-center" style={{ marginBottom: '8rem' }}>
                  <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem' }}>{t('packages_title')}</h2>
                </div>
                <div className="grid grid-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="card" style={{ transform: i === 2 ? 'scale(1.08)' : 'none', border: i === 2 ? '3px solid var(--primary)' : '1px solid var(--gray-200)' }}>
                      <h3 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{t(`pkg_${i}_name`)}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '3rem' }}>{t(`pkg_${i}_target`)}</p>
                      <button className="btn btn-primary" style={{ width: '100%' }}>{t('pkg_btn')}</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <Contact />
          </>
        ) : (
          <StaticPage view={activePage} />
        )}
      </main>
      <Footer />
    </ThemeContext.Provider>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);