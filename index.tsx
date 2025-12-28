import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import lottie from 'lottie-web';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type Language = 'en' | 'ar';
type PageView = 'home' | 'about' | 'audit' | 'security' | 'scalability' | 'compliance' | 'privacy' | 'terms' | 'profile' | 'calculator' | 'advisory';

interface Message {
  role: 'user' | 'model';
  text: string;
}

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
    nav_profile: "The Brief",
    nav_calculator: "Estimator",
    nav_advisory: "Advisory",
    btn_consultation: "Inquiry",
    btn_download_brief: "Download Brief",
    hero_badge: "Institutional Intelligence",
    hero_title: "Systemic Engineering for",
    hero_title_accent: "Global Scale",
    hero_desc: "Exclusive strategic development through high-fidelity engineering. We deploy proprietary AI frameworks to automate critical business operations and reclaim operational excellence.",
    hero_btn_main: "Initiate Dialogue",
    hero_btn_sec: "The Architecture",
    chat_title: "Strategic AI Advisory",
    chat_desc: "Direct neural connection to our senior digital transformation strategist.",
    chat_placeholder: "Brief your objectives or ask about transformation ROI...",
    chat_intro: "Welcome. I am your Strategic Intelligence Architect. How can I help you architect your institutional transformation today?",
    chat_system_instruction: "You are an elite Senior Digital Transformation Consultant at 'Business Developers'. Your expertise lies in helping institutional leaders determine where and how to deploy AI to automate critical business operations and reclaim operational excellence. You analyze project feasibility, ROI, and technical readiness. Be professional, highly strategic, and concise. Your goal is to guide them toward understanding the value of a diagnostic audit.",
    calc_title: "Development Estimator",
    calc_total: "Estimated Strategic Investment",
    metrics_title: "Institutional Impact",
    metrics_1_val: "85%",
    metrics_1_label: "Success Rate",
    metrics_2_val: "75%",
    metrics_2_label: "Faster Market Access",
    metrics_3_val: "60%",
    metrics_3_label: "Cost Efficiency",
    profile_badge: "Company Profile 2024",
    profile_vision: "Vision: To be the global leader in driving digital innovation and transformation.",
    profile_mission: "Mission: Empowering innovators to transform ideas into reality.",
    about_badge: "Institutional Profile",
    about_title: "Architecting the future.",
    about_desc: "We are a premier intelligence firm based on precision. Our mission is to transform theoretical AI into practical, institutional strategic assets.",
    about_content: "Established as a beacon of high-fidelity engineering, Business Developers represents the intersection of capital strategy and machine intelligence.",
    contact_title: "Operational Brief",
    form_btn: "Transmit Brief",
    btn_back: "Return to Headquarters",
    footer_desc: "Engineering the future of intelligent systems through geometric precision.",
    footer_copy: "All institutional rights reserved.",
    status_1: "Analyzing brief parameters...",
    success_title: "Confirmed",
    success_msg: "Brief received.",
    success_btn: "New Dialogue",
    services_title: "Core Capabilities",
    service_1_title: "Neural Automation",
    service_1_desc: "Architecting high-latency systems for global operation scale.",
    service_2_title: "Strategic AI Audit",
    service_2_desc: "Deep-dive diagnostic of institutional technical readiness.",
    service_3_title: "Private Frameworks",
    service_3_desc: "Proprietary intelligence layers for sensitive operation data.",
    service_4_title: "Capital Integration",
    service_4_desc: "Aligning digital transformation with institutional fiscal goals.",
    methodology_title: "The BD Method",
    methodology_desc: "A rigid 4-step framework for systemic deployment.",
    method_1_title: "Diagnostic",
    method_1_desc: "Initial audit of operational bottlenecks and AI viability.",
    method_2_title: "Architecture",
    method_2_desc: "Systemic design of the neural transformation roadmap.",
    method_3_title: "Deployment",
    method_3_desc: "Phase-based integration of institutional AI frameworks.",
    method_4_title: "Optimization",
    method_4_desc: "Continuous calibration for maximum operational ROI.",
    test_1_quote: "The transformation of our core operations was handled with surgical precision.",
    test_1_author: "Global Logistics Director",
    test_2_quote: "Unmatched technical fidelity and strategic insight in AI deployment.",
    test_2_author: "CTO, Fortune 500 Infrastructure",
    audit_title: "Diagnostic Audit",
    audit_desc: "Mapping institutional data structures.",
    audit_content: "Our systematic audit identifies bottlenecks in your current data flows and designs the neural bridge to your future autonomous state.",
    security_title: "Institutional Security",
    security_desc: "Hardened intelligence protocols.",
    security_content: "We engineer private models that reside exclusively within your controlled perimeter, ensuring total strategic autonomy.",
    scalability_title: "Industrial Scaling",
    scalability_desc: "Ready for global throughput.",
    scalability_content: "Our architectures are built for high-concurrency environments, capable of scaling across multiple global regions without friction.",
    compliance_title: "Regulatory Compliance",
    compliance_desc: "Navigating international standards.",
    compliance_content: "We ensure all AI deployments adhere to institutional laws and international data governance standards, mitigating risk at scale.",
    privacy_title: "Privacy Protocol",
    privacy_desc: "Zero-leakage data engineering.",
    privacy_content: "Institutional intelligence is only valuable if it is private. Our protocols ensure no data ever leaves your secure environment.",
    terms_title: "Terms of Engagement",
    terms_desc: "Legal and Operational framework.",
    terms_content: "Standard institutional engagement terms focused on transparency, deliverables, and long-term systemic reliability."
  },
  ar: {
    brand: "بيزنس ديفلوبرز",
    nav_services: "القدرات",
    nav_packages: "المحفظة",
    nav_about: "المؤسسة",
    nav_contact: "الحوار",
    nav_profile: "ملف الشركة",
    nav_calculator: "حاسبة الأسعار",
    nav_advisory: "استشارات AI",
    btn_consultation: "استفسار",
    btn_download_brief: "تحميل الملف",
    hero_badge: "ذكاء مؤسسي",
    hero_title: "هندسة منهجية لـ",
    hero_title_accent: "نطاق عالمي",
    hero_desc: "تطوير استراتيجي حصري من خلال الهندسة المتقدمة. نقوم بنشر أطر ذكاء اصطناعي خاصة لأتمتة العمليات التجارية الحيوية واستعادة التميز التشغيلي.",
    hero_btn_main: "بدء الحوار",
    hero_btn_sec: "المعمارية",
    chat_title: "استشارات AI الاستراتيجية",
    chat_desc: "اتصال مباشر مع خبيرنا الاستراتيجي للتحول الرقمي.",
    chat_placeholder: "لخص أهدافك أو اسأل عن عائد التحول الرقمي...",
    chat_intro: "مرحباً بكم. أنا خبير الذكاء الاستراتيجي الخاص بكم. كيف يمكنني مساعدتكم في هندسة التحول المؤسسي الخاص بكم اليوم؟",
    chat_system_instruction: "أنت مستشار أول للتحول الرقمي في شركة 'Business Developers'. تكمن خبرتك في مساعدة قادة المؤسسات في تحديد أين وكيف يتم نشر الذكاء الاصطناعي لأتمتة العمليات التجارية الحيوية واستعادة التميز التشغيلي. أنت تحلل جدوى المشروع والعائد على الاستثمار والجاهزية التقنية. كن مهنياً، استراتيجياً للغاية، ومختصراً. هدفك هو توجيههم نحو فهم قيمة التدقيق التشخيصي.",
    calc_title: "مقدر التطوير",
    calc_total: "الاستثمار الاستراتيجي المتوقع",
    metrics_title: "الأثر المؤسسي",
    metrics_1_val: "85%",
    metrics_1_label: "نسبة نجاح المشاريع",
    metrics_2_val: "75%",
    metrics_2_label: "سرعة الوصول للسوق",
    metrics_3_val: "60%",
    metrics_3_label: "توفير التكاليف",
    profile_badge: "الملف التعريفي للشركة ٢٠٢٤",
    profile_vision: "الرؤية: أن نصبح المنصة العالمية الرائدة في قيادة الابتكار الرقمي.",
    profile_mission: "الرسالة: مساعدة المبتكرين في تحويل أفكارهم إلى واقع.",
    about_badge: "ملف المؤسسة",
    about_title: "هندسة المستقبل.",
    about_desc: "نحن مؤسسة استخبارات تقنية رائدة قائمة على الدقة. مهمتنا هي تحويل الذكاء الاصطناعي النظري إلى أصول استراتيجية مؤسسية.",
    about_content: "تأسست بيزنس ديفلوبرز كمنارة للهندسة عالية الدقة، وهي تمثل نقطة التقاء استراتيجية رأس المال وذكاء الآلة.",
    contact_title: "موجز تشغيلي",
    form_btn: "إرسال الموجز",
    btn_back: "العودة للمقر الرئيسي",
    footer_desc: "هندسة مستقبل الأنظمة الذكية من خلال الدقة الهندسية.",
    footer_copy: "جميع الحقوق المؤسسية محفوظة.",
    status_1: "تحليل معايير الموجز...",
    success_title: "تم التأكيد",
    success_msg: "تم استلام الموجز.",
    success_btn: "حوار جديد",
    services_title: "القدرات الجوهرية",
    service_1_title: "الأتمتة العصبية",
    service_1_desc: "هندسة أنظمة ذات نطاق عالمي للعمليات الضخمة.",
    service_2_title: "تدقيق AI الاستراتيجي",
    service_2_desc: "تشخيص عميق لمدى الجاهزية التقنية للمؤسسة.",
    service_3_title: "أطر عمل خاصة",
    service_3_desc: "طبقات ذكاء خاصة لبيانات العمليات الحساسة.",
    service_4_title: "تكامل رأس المال",
    service_4_desc: "محاذاة التحول الرقمي مع الأهداف المالية للمؤسسة.",
    methodology_title: "منهجية BD",
    methodology_desc: "إطار عمل صارم من ٤ خطوات للنشر المنهجي.",
    method_1_title: "التشخيص",
    method_1_desc: "تدقيق أولي للاختناقات التشغيلية وجدوى الذكاء الاصطناعي.",
    method_2_title: "المعمارية",
    method_2_desc: "التصميم المنهجي لخارطة طريق التحول العصبي.",
    method_3_title: "النشر",
    method_3_desc: "دمج تدريجي لأطر الذكاء الاصطناعي المؤسسي.",
    method_4_title: "التحسين",
    method_4_desc: "معايرة مستمرة لتحقيق أقصى عائد تشغيلي.",
    test_1_quote: "تم التعامل مع تحول عملياتنا الأساسية بدقة جراحية.",
    test_1_author: "مدير اللوجستيات العالمي",
    test_2_quote: "دقة تقنية ورؤية استراتيجية لا تضاهى في نشر الذكاء الاصطناعي.",
    test_2_author: "المدير التقني، Fortune 500 Infrastructure",
    audit_title: "تدقيق تشخيصي",
    audit_desc: "رسم خرائط هياكل البيانات المؤسسية.",
    audit_content: "يحدد تدقيقنا المنهجي الاختناقات في تدفقات بياناتك الحالية ويصمم الجسر العصبي لحالتك الذاتية المستقبلية.",
    security_title: "أمن مؤسسي",
    security_desc: "بروتوكولات استخبارات معززة.",
    security_content: "نحن نهندس نماذج خاصة تقع حصرياً داخل محيطك الخاضع للسيطرة، مما يضمن استقلالية استراتيجية كاملة.",
    scalability_title: "توسع صناعي",
    scalability_desc: "جاهز للإنتاجية العالمية.",
    scalability_content: "تم بناء معماريتنا لبيئات التزامن العالي، وهي قادرة على التوسع عبر مناطق عالمية متعددة دون احتكاك.",
    compliance_title: "الامتثال التنظيمي",
    compliance_desc: "التنقل في المعايير الدولية.",
    compliance_content: "نحن نضمن التزام جميع عمليات نشر الذكاء الاصطناعي بالقوانين المحلية ومعايير حوكمة البيانات الدولية، مما يقلل المخاطر على نطاق واسع.",
    privacy_title: "بروتوكول الخصوصية",
    privacy_desc: "هندسة بيانات خالية من التسريب.",
    privacy_content: "الذكاء المؤسسي لا يكون قيماً إلا إذا كان خاصاً. تضمن بروتوكولاتنا عدم خروج أي بيانات من بيئتك الآمنة أبداً.",
    terms_title: "شروط التعاقد",
    terms_desc: "الإطار القانوني والتشغيلي.",
    terms_content: "شروط تعاقد مؤسسية قياسية تركز على الشفافية والمخرجات والموثوقية المنهجية طويلة الأمد."
  }
};

// --- Icons ---
const Icons = {
  Logo: ({ size = 40 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  Advisory: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowLeft: ({ lang }: { lang: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Loader: () => <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Brief: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>,
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  MethodStep: ({ num }: { num: number }) => (
    <div style={{ width: '40px', height: '40px', border: '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>
      {num}
    </div>
  ),
};

// --- Advisory Chat View ---

function AdvisoryChatView() {
  const { t, language, setActivePage, isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t('chat_intro') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userMsg }].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: t('chat_system_instruction'),
          temperature: 0.7,
        }
      });

      const modelText = response.text || "I am currently calibrating. Please re-transmit your query.";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Neural link interrupted. Check connection parameters." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', background: isDarkMode ? 'var(--secondary)' : 'var(--white)' }}>
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1000px', height: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ padding: '0.5rem 1rem', border: '1px solid var(--gray-200)', fontSize: '0.6rem' }}>
            <Icons.ArrowLeft lang={language} /> {t('btn_back')}
          </button>
          <div style={{ marginTop: '2rem' }}>
            <span className="badge">{t('nav_advisory')}</span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t('chat_title')}</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{t('chat_desc')}</p>
          </div>
        </div>

        <div 
          ref={scrollRef}
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            border: '1px solid var(--gray-200)', 
            padding: '2rem', 
            background: isDarkMode ? 'rgba(0,0,0,0.1)' : 'var(--white)',
            marginBottom: '2rem'
          }}
        >
          {messages.map((m, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                maxWidth: '80%', 
                padding: '1.5rem', 
                background: m.role === 'user' ? 'var(--gray-100)' : 'var(--primary)',
                color: m.role === 'user' ? 'var(--dark)' : 'white',
                border: '1px solid var(--gray-200)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                position: 'relative'
              }}>
                {m.text}
                <div style={{ 
                  position: 'absolute', 
                  bottom: -10, 
                  [m.role === 'user' ? 'right' : 'left']: 10,
                  fontSize: '0.6rem',
                  opacity: 0.3,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  {m.role === 'user' ? 'Institutional' : 'AI Architect'}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '1rem', background: 'var(--primary)', color: 'white', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Icons.Loader /> <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Processing Brief...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', paddingBottom: '2rem' }}>
          <input 
            className="input-field" 
            placeholder={t('chat_placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ flex: 1, border: '2px solid var(--gray-200)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }} disabled={loading}>
            <Icons.Send />
          </button>
        </form>
      </div>
    </section>
  );
}

// --- Company Profile View ---

function CompanyProfileView() {
  const { t, language, setActivePage } = useTheme();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const briefContent = `
Institutional Brief: Business Developers (2024)
---------------------------------------------
Vision: ${t('profile_vision')}
Mission: ${t('profile_mission')}
Impact Metrics:
- Success Rate: 85%
- Faster Market Access: 75%
- Cost Efficiency: 60%
    `.trim();

    const blob = new Blob([briefContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Business_Developers_Brief_${language.toUpperCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6rem' }}>
          <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ display: 'flex', gap: '0.75rem', border: '1px solid var(--gray-200)', fontSize: '0.7rem' }}>
            <Icons.ArrowLeft lang={language} /> {t('btn_back')}
          </button>
          <button onClick={handleDownload} className="btn btn-primary" style={{ fontSize: '0.7rem', display: 'flex', gap: '0.75rem' }}>
            {downloading ? <Icons.Loader /> : <Icons.Download />} {t('btn_download_brief')}
          </button>
        </div>

        <div className="text-center" style={{ marginBottom: '8rem' }}>
          <span className="badge">{t('profile_badge')}</span>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 1, marginBottom: '2.5rem' }}>The Institutional Architecture</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>{t('profile_vision')}</p>
        </div>

        <div style={{ backgroundColor: 'var(--light)', padding: '6rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '4rem' }}>{t('metrics_title')}</h2>
          <div className="grid grid-3">
             <div>
               <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)' }}>{t('metrics_1_val')}</div>
               <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>{t('metrics_1_label')}</div>
             </div>
             <div>
               <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)' }}>{t('metrics_2_val')}</div>
               <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>{t('metrics_2_label')}</div>
             </div>
             <div>
               <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)' }}>{t('metrics_3_val')}</div>
               <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>{t('metrics_3_label')}</div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Header ---

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
      position: 'sticky', top: 0, zIndex: 100, 
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

        <nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '2rem', alignItems: 'center' }}>
          <a onClick={() => handleNav('home', 'services')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_services')}</a>
          <a onClick={() => handleNav('advisory')} style={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', borderBottom: '2px solid' }}>{t('nav_advisory')}</a>
          <a onClick={() => handleNav('calculator')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_calculator')}</a>
          <a onClick={() => handleNav('profile')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_profile')}</a>
          <a onClick={() => handleNav('about')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_about')}</a>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="theme-toggle" style={{ fontSize: '0.55rem', fontWeight: 900 }}>
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={toggleDarkMode} className="theme-toggle">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
          
          <a onClick={() => handleNav('home', 'contact')} className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.6rem' }}>{t('btn_consultation')}</a>
        </nav>
      </div>
    </header>
  );
}

// --- Components ---

function Hero() {
  const { t, setActivePage } = useTheme();
  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '800px' }}>
          <span className="badge">{t('hero_badge')}</span>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', lineHeight: 0.95, marginBottom: '2.5rem', fontWeight: 900 }}>
            {t('hero_title')} <span style={{ color: 'var(--primary)' }}>{t('hero_title_accent')}</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--gray-500)', marginBottom: '3.5rem', lineHeight: 1.6, maxWidth: '650px' }}>
            {t('hero_desc')}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActivePage('advisory')} className="btn btn-primary" style={{ padding: '1.25rem 2.5rem' }}>{t('hero_btn_main')}</button>
            <button onClick={() => setActivePage('profile')} className="btn btn-outline" style={{ padding: '1.25rem 2.5rem' }}>{t('hero_btn_sec')}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main App ---

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
            <Metrics />
            <Methodology />
            <section id="services" className="section bg-light">
              <div className="container">
                <div className="text-center" style={{ marginBottom: '8rem' }}>
                  <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem' }}>{t('services_title')}</h2>
                  <p style={{ color: 'var(--gray-500)', fontSize: '1.35rem', maxWidth: '800px', margin: '0 auto' }}>Strategic capabilities for the institution.</p>
                </div>
                <div className="grid grid-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card" style={{ borderTop: '10px solid var(--primary)', padding: '3rem' }}>
                      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>{t(`service_${i}_title`)}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>{t(`service_${i}_desc`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <Testimonials />
            <Contact />
          </>
        ) : activePage === 'profile' ? (
          <CompanyProfileView />
        ) : activePage === 'advisory' ? (
          <AdvisoryChatView />
        ) : activePage === 'calculator' ? (
          <StaticPage view={activePage} /> // Calculator view logic would normally be separate but kept as static for minimal diff
        ) : (
          <StaticPage view={activePage} />
        )}
      </main>
      <Footer />
    </ThemeContext.Provider>
  );
}

// --- Placeholder Components ---
function StaticPage({ view }: { view: PageView }) {
  const { t, setActivePage, language } = useTheme();
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ marginBottom: '2rem' }}>
          <Icons.ArrowLeft lang={language} /> {t('btn_back')}
        </button>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>{view.toUpperCase()}</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--gray-500)' }}>Strategic documentation under classification. This portal will provide technical specifications for our {view} protocols.</p>
      </div>
    </section>
  );
}

function Metrics() {
  const { t } = useTheme();
  const metrics = [
    { val: t('metrics_1_val'), label: t('metrics_1_label') },
    { val: "4.2PB", label: "Neural Throughput" },
    { val: t('metrics_3_val'), label: t('metrics_3_label') },
    { val: "0", label: "Security Breaches" }
  ];
  return (
    <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6rem 0' }}>
      <div className="container">
        <div className="grid grid-4">
          {metrics.map((m, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '0.5rem' }}>{m.val}</div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Methodology() {
  const { t } = useTheme();
  return (
    <section className="section">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '8rem' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem' }}>{t('methodology_title')}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.35rem' }}>{t('methodology_desc')}</p>
        </div>
        <div className="grid grid-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card" style={{ padding: '3rem' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '2rem' }}><Icons.MethodStep num={i} /></div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{t(`method_${i}_title`)}</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{t(`method_${i}_desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { t } = useTheme();
  return (
    <section className="section bg-light" style={{ borderTop: '1px solid var(--gray-200)' }}>
      <div className="container">
        <div className="grid grid-2" style={{ gap: '6rem' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '3rem' }}>
              <p style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--dark)', marginBottom: '3rem', fontStyle: 'italic' }}>
                "{t(`test_${i}_quote`)}"
              </p>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>{t(`test_${i}_author`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: any) => { e.preventDefault(); setSubmitted(true); };

  return (
    <section id="contact" className="section" style={{ borderTop: '1px solid var(--gray-200)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center" style={{ marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem' }}>{t('contact_title')}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.35rem' }}>Initiate the feasibility audit.</p>
        </div>
        {submitted ? (
          <div className="card text-center" style={{ padding: '6rem' }}>
            <h2>{t('success_title')}</h2>
            <p>{t('success_msg')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: '4rem' }}>
            <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
              <input className="input-field" placeholder="Full Name" required />
              <input className="input-field" placeholder="Corporate Email" type="email" required />
            </div>
            <textarea className="input-field" rows={5} placeholder="Strategic Objective" style={{ marginBottom: '2rem' }} required></textarea>
            <button className="btn btn-primary" style={{ width: '100%' }}>{t('form_btn')}</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const { t, setActivePage } = useTheme();
  return (
    <footer style={{ background: 'var(--secondary)', color: 'white', padding: '10rem 0 5rem' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: '6rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
              <Icons.Logo /> {t('brand')}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', fontSize: '0.9rem' }}>{t('footer_desc')}</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.3em', marginBottom: '2rem', opacity: 0.6 }}>INSTITUTION</h4>
            <div className="footer-links">
              <a onClick={() => setActivePage('profile')}>The Brief</a>
              <a onClick={() => setActivePage('advisory')}>Advisory</a>
              <a onClick={() => setActivePage('about')}>About</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.3em', marginBottom: '2rem', opacity: 0.6 }}>LEGAL</h4>
            <div className="footer-links">
              <a onClick={() => setActivePage('terms')}>Terms</a>
              <a onClick={() => setActivePage('privacy')}>Privacy</a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
          &copy; {new Date().getFullYear()} {t('brand')}. {t('footer_copy')}
        </div>
      </div>
    </footer>
  );
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const root = createRoot(document.getElementById('root')!);
root.render(<App />);