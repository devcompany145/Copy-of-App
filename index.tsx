import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import lottie from 'lottie-web';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type Language = 'en' | 'ar';

// --- Theme & Language Context ---
const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

const useTheme = () => useContext(ThemeContext);

// --- Translations ---
const translations: Record<Language, Record<string, string>> = {
  en: {
    brand: "AISolutions",
    nav_services: "Services",
    nav_packages: "Packages",
    nav_about: "About",
    nav_contact: "Contact",
    btn_consultation: "Book Consultation",
    hero_badge: "Next Gen AI",
    hero_title: "Empowering Businesses with",
    hero_title_accent: "Intelligent AI Solutions",
    hero_desc: "Your trusted AI provider. Automate operations, enhance customer experience, and unlock data-driven growth with our cutting-edge technology.",
    hero_btn_main: "Book a Free Consultation",
    hero_btn_sec: "Learn More",
    services_title: "Our Services",
    services_desc: "Comprehensive AI solutions designed for modern enterprises.",
    service_1_title: "AI Model Development",
    service_1_desc: "Custom-built models tailored to your business needs—LLMs, classification models, prediction engines, and more.",
    service_2_title: "Business Automation",
    service_2_desc: "Intelligent bots, automated workflows, and smart systems that reduce manual work and increase efficiency.",
    service_3_title: "Predictive Analytics",
    service_3_desc: "Data-driven insights to help you make faster decisions—demand forecasting, customer behavior, churn prediction.",
    service_4_title: "Conversational AI",
    service_4_desc: "Smart virtual assistants and chatbots that offer real-time support and personalized interactions.",
    packages_title: "Ready-Made AI Solutions",
    packages_desc: "Select a package that fits your stage of growth.",
    pkg_1_name: "Startup AI Package",
    pkg_1_target: "Small Businesses",
    pkg_2_name: "Growth AI Package",
    pkg_2_target: "Scaling Companies",
    pkg_3_name: "Enterprise AI Suite",
    pkg_3_target: "Large Organizations",
    pkg_popular: "Most Popular",
    pkg_btn: "Choose Plan",
    about_badge: "About Us",
    about_title: "We accelerate digital transformation.",
    about_desc: "We are a Saudi AI provider specialized in building intelligent, easy-to-use solutions. Our mission is to make advanced AI accessible, practical, and impactful for businesses of all sizes.",
    about_item_1: "Expert engineering team",
    about_item_2: "Certified AI competencies",
    about_item_3: "Proven industry use cases",
    about_item_4: "Strategic partnerships",
    cases_title: "Case Studies",
    case_1_title: "Customer Support Chatbot",
    case_1_res: "Reduced response time by 80%",
    case_2_title: "Automated Internal Workflow",
    case_2_res: "Saved 200+ hours monthly",
    case_3_title: "Predictive Business Model",
    case_3_res: "Improved demand forecast by 35%",
    contact_title: "Start Your AI Journey Today",
    contact_desc: "Fill out the form to receive personalized recommendations and project guidance.",
    form_name: "Name",
    form_email: "Email",
    form_phone: "Phone (Optional)",
    form_company: "Company",
    form_desc: "Project Description",
    form_desc_placeholder: "Briefly describe your business challenge or vision...",
    form_ai_hint: "Our AI engine will perform a preliminary feasibility analysis of your request instantly.",
    form_btn: "Book Consultation",
    success_banner: "Submission Successful",
    success_title: "Triumph!",
    success_msg: "Your vision has been captured. Our strategic engineering team is already reviewing your requirements.",
    success_next_steps: "What happens next? Our team will contact you within 24 hours to schedule your deep-dive consultation.",
    success_btn: "Submit Another Project",
    footer_desc: "Empowering businesses with intelligent, scalable, and secure AI technology.",
    footer_company: "Company",
    footer_legal: "Legal",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_copy: "All rights reserved.",
    status_1: "Parsing project requirements...",
    status_2: "Evaluating AI feasibility...",
    status_3: "Consulting knowledge graphs...",
    status_4: "Generating architectural strategy...",
    status_5: "Finalizing recommendations...",
    status_complete: "Analysis complete!",
    tip_name: "Please enter your full name so we can address you correctly.",
    tip_email: "We'll use this to send you the project analysis and follow-up details.",
    tip_phone: "(Optional) A phone number helps our team reach you for a quick 5-minute discovery call.",
    tip_company: "(Optional) Knowing your company helps us tailor our AI recommendations to your industry.",
    tip_desc: "The more detail you provide, the more accurate our initial AI feasibility analysis will be."
  },
  ar: {
    brand: "حلول الذكاء الاصطناعي",
    nav_services: "الخدمات",
    nav_packages: "الباقات",
    nav_about: "من نحن",
    nav_contact: "اتصل بنا",
    btn_consultation: "احجز استشارة",
    hero_badge: "الجيل القادم من الذكاء الاصطناعي",
    hero_title: "تمكين الشركات من خلال",
    hero_title_accent: "حلول ذكية متطورة",
    hero_desc: "شريكك الموثوق في تقنيات الذكاء الاصطناعي. أتمتة العمليات، تحسين تجربة العملاء، وتحقيق نمو قائم على البيانات بأحدث التقنيات.",
    hero_btn_main: "احجز استشارة مجانية",
    hero_btn_sec: "تعرف علينا",
    services_title: "خدماتنا",
    services_desc: "حلول شاملة للذكاء الاصطناعي مصممة للمؤسسات الحديثة.",
    service_1_title: "تطوير نماذج الذكاء الاصطناعي",
    service_1_desc: "نماذج مخصصة تلبي احتياجات عملك - LLMs، نماذج التصنيف، محركات التنبؤ، وأكثر.",
    service_2_title: "أتمتة الأعمال",
    service_2_desc: "روبوتات ذكية، تدفقات عمل مؤتمتة، وأنظمة ذكية تقلل العمل اليدوي وتزيد الكفاءة.",
    service_3_title: "التحليلات التنبؤية",
    service_3_desc: "رؤى قائمة على البيانات لمساعدتك في اتخاذ قرارات أسرع - توقع الطلب، سلوك العملاء، والتنبؤ بالانسحاب.",
    service_4_title: "الذكاء الاصطناعي المحادثي",
    service_4_desc: "مساعدين افتراضيين وأنظمة دردشة ذكية توفر دعماً فورياً وتفاعلات شخصية.",
    packages_title: "حلول جاهزة",
    packages_desc: "اختر الباقة التي تناسب مرحلة نمو شركتك.",
    pkg_1_name: "باقة الشركات الناشئة",
    pkg_1_target: "للشركات الصغيرة",
    pkg_2_name: "باقة النمو",
    pkg_2_target: "للشركات المتوسطة",
    pkg_3_name: "باقة المؤسسات الكبرى",
    pkg_3_target: "للمنظمات الكبيرة",
    pkg_popular: "الأكثر رواجاً",
    pkg_btn: "اختر الباقة",
    about_badge: "من نحن",
    about_title: "نسرع وتيرة التحول الرقمي.",
    about_desc: "نحن مزود سعودي رائد لخدمات الذكاء الاصطناعي، متخصصون في بناء حلول ذكية وسهلة الاستخدام. مهمتنا هي جعل الذكاء الاصطناعي متاحاً وعملياً ومؤثراً.",
    about_item_1: "فريق هندسي خبير",
    about_item_2: "كفاءات معتمدة عالمياً",
    about_item_3: "قصص نجاح مثبتة",
    about_item_4: "شراكات استراتيجية",
    cases_title: "دراسات الحالة",
    case_1_title: "روبوت خدمة العملاء",
    case_1_res: "تقليل وقت الاستجابة بنسبة 80%",
    case_2_title: "أتمتة تدفقات العمل الداخلية",
    case_2_res: "توفير أكثر من 200 ساعة شهرياً",
    case_3_title: "نموذج الأعمال التنبؤي",
    case_3_res: "تحسين دقة توقع الطلب بنسبة 35%",
    contact_title: "ابدأ رحلتك اليوم",
    contact_desc: "املأ النموذج للحصول على توصيات مخصصة وإرشادات لمشروعك.",
    form_name: "الاسم",
    form_email: "البريد الإلكتروني",
    form_phone: "رقم الهاتف (اختياري)",
    form_company: "الشركة",
    form_desc: "وصف المشروع",
    form_desc_placeholder: "صف بإيجاز تحديات عملك أو رؤيتك للمشروع...",
    form_ai_hint: "سيقوم محرك الذكاء الاصطناعي لدينا بإجراء تحليل أولي لطلبك فوراً.",
    form_btn: "احجز استشارة",
    success_banner: "تم الإرسال بنجاح",
    success_title: "تم النجاح!",
    success_msg: "تم استلام رؤيتك بنجاح. يقوم فريقنا الهندسي الاستراتيجي بمراجعة متطلباتك الآن.",
    success_next_steps: "ما هي الخطوة القادمة؟ سيتواصل معك فريقنا خلال 24 ساعة لترتيب موعد استشارة معمقة.",
    success_btn: "إرسال طلب آخر",
    footer_desc: "تمكين الشركات بتقنيات ذكاء اصطناعي ذكية، قابلة للتوسع وآمنة.",
    footer_company: "الشركة",
    footer_legal: "القانونية",
    footer_privacy: "سياسة الخصوصية",
    footer_terms: "شروط الخدمة",
    footer_copy: "جميع الحقوق محفوظة.",
    status_1: "تحليل متطلبات المشروع...",
    status_2: "تقييم جدوى الذكاء الاصطناعي...",
    status_3: "استشارة قواعد المعرفة...",
    status_4: "توليد الاستراتيجية المعمارية...",
    status_5: "نهائي التوصيات...",
    status_complete: "اكتمل التحليل!",
    tip_name: "يرجى إدخال اسمك الكامل لنتمكن من مخاطبتك بشكل صحيح.",
    tip_email: "سنستخدم هذا لإرسال تحليل المشروع وتفاصيل المتابعة إليك.",
    tip_phone: "(اختياري) يساعد رقم الهاتف فريقنا في الوصول إليك لإجراء مكالمة استكشافية سريعة لمدة 5 دقائق.",
    tip_company: "(اختياري) تساعدنا معرفة شركتك في صياغة توصيات الذكاء الاصطناعي بما يناسب قطاع عملك.",
    tip_desc: "كلما زادت التفاصيل التي تقدمها، كان تحليل الجدوى الأولي للذكاء الاصطناعي أكثر دقة."
  }
};

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
  CheckCircle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  ChevronRight: ({ language }: { language: Language }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }}><path d="m9 18 6-6-6-6"/></svg>
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
  ),
  Globe: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  )
};

// --- Helper Components ---

function FieldTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const { language, isDarkMode } = useTheme();

  return (
    <div 
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div style={{ color: 'var(--gray-500)', cursor: 'help', display: 'flex', alignItems: 'center' }}>
        <Icons.Info />
      </div>
      {visible && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: language === 'ar' ? 'auto' : '50%',
          right: language === 'ar' ? '50%' : 'auto',
          transform: language === 'ar' ? 'translateX(50%)' : 'translateX(-50%)',
          marginBottom: '8px',
          width: 'max-content',
          maxWidth: '220px',
          backgroundColor: isDarkMode ? 'var(--gray-800)' : '#0f172a',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          lineHeight: '1.4',
          zIndex: 100,
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'start'
        }}>
          {text}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: `${isDarkMode ? 'var(--gray-800)' : '#0f172a'} transparent transparent transparent`
          }} />
        </div>
      )}
    </div>
  );
}

// --- Helper Functions ---
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function analyzeProject(description: string, lang: Language, retries = 3): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = lang === 'ar' 
    ? `تصرف كمستشار استراتيجي للذكاء الاصطناعي لشركة "حلول الذكاء الاصطناعي". قدم عميل محتمل وصف المشروع هذا: "${description}". اكتب رداً قصيراً ومهنياً من جملتين يقر باحتياجاتهم ويقترح تقنيتين (مثل RAG أو رؤية الحاسوب). اجعل الرد باللغة العربية.`
    : `Act as an AI business strategist for "AISolutions". A potential client provided this project description: "${description}". Write a concise, professional 2-sentence response acknowledging their specific need and suggesting 1-2 AI technologies (like RAG, Computer Vision, or LLM fine-tuning) that would solve it. Keep it encouraging and high-level.`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || (lang === 'ar' ? "شكراً لمشاركتنا رؤيتك. فريقنا متحمس لاستكشاف كيف يمكن للذكاء الاصطناعي تطوير أعمالك." : "Thank you for sharing your vision. Our team is excited to explore how advanced AI models can transform your business workflows.");
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await sleep(1000 * Math.pow(2, i));
    }
  }
  return lang === 'ar' ? "يقوم فريقنا بمراجعة متطلبات مشروعك وسنتواصل معك قريباً." : "Our team is reviewing your project requirements and will reach out with a tailored strategy soon.";
}

// --- Components ---

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode, language, setLanguage, t } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
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
          <span style={{ color: 'var(--dark)', letterSpacing: '-0.03em' }}>{t('brand')}</span>
        </div>

        <nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>{t('nav_services')}</a>
          <a onClick={() => scrollToSection('packages')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>{t('nav_packages')}</a>
          <a onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>{t('nav_about')}</a>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={toggleLanguage} className="theme-toggle" aria-label="Toggle Language" style={{ width: 'auto', padding: '0 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle Theme">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
          
          <a onClick={() => scrollToSection('contact')} className="btn btn-primary">{t('btn_consultation')}</a>
        </nav>

        <div style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', gap: '1rem', alignItems: 'center' }}>
           <button onClick={toggleLanguage} className="theme-toggle" aria-label="Toggle Language" style={{ width: 'auto', padding: '0 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
              {language === 'en' ? 'AR' : 'EN'}
            </button>
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
          <a onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>{t('nav_services')}</a>
          <a onClick={() => scrollToSection('packages')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>{t('nav_packages')}</a>
          <a onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--dark)' }}>{t('nav_about')}</a>
          <a onClick={() => scrollToSection('contact')} className="btn btn-primary" style={{ justifyContent: 'center' }}>{t('btn_consultation')}</a>
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
  const { isDarkMode, language, t } = useTheme();

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
            <span className="badge">{t('hero_badge')}</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--dark)' }}>
              {t('hero_title')} <br/>
              <span className="text-gradient">{t('hero_title_accent')}</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)', maxWidth: '600px', margin: '0 0 2.5rem' }}>
              {t('hero_desc')}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={scrollToContact} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                {t('hero_btn_main')}
              </button>
              <button onClick={scrollToServices} className="btn btn-outline learn-more-btn" style={{ padding: '1rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {t('hero_btn_sec')} <Icons.ChevronRight language={language} />
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
  const { t } = useTheme();
  const services = [
    { icon: <Icons.Brain />, title: t('service_1_title'), desc: t('service_1_desc') },
    { icon: <Icons.Cpu />, title: t('service_2_title'), desc: t('service_2_desc') },
    { icon: <Icons.LineChart />, title: t('service_3_title'), desc: t('service_3_desc') },
    { icon: <Icons.MessageSquare />, title: t('service_4_title'), desc: t('service_4_desc') }
  ];

  return (
    <section id="services" className="section bg-light">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--dark)' }}>{t('services_title')}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>{t('services_desc')}</p>
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
  const { t } = useTheme();
  const packages = [
    { name: t('pkg_1_name'), target: t('pkg_1_target'), features: ['Basic chatbot', 'Data summary tools', 'Monthly insights dashboard'], color: '#4f46e5' },
    { name: t('pkg_2_name'), target: t('pkg_2_target'), features: ['Advanced conversational agent', 'Automated workflows', 'Custom analytics dashboards'], featured: true, color: '#7c3aed' },
    { name: t('pkg_3_name'), target: t('pkg_3_target'), features: ['Fully customized AI models', 'System integrations', 'High-security & compliance'], color: '#2563eb' }
  ];

  return (
    <section id="packages" className="section">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--dark)' }}>{t('packages_title')}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>{t('packages_desc')}</p>
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
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('pkg_popular')}</div>
              )}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>{p.name}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>{p.target}</p>
              </div>
              <ul className="feature-list" style={{ listStyle: 'none', marginBottom: '2rem' }}>
                {p.features.map((f, fi) => <li key={fi}><Icons.Check />{f}</li>)}
              </ul>
              <button className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>{t('pkg_btn')}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutAndCases() {
  const { isDarkMode, t } = useTheme();
  return (
    <div id="about">
      <section className="section bg-light">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <span className="badge">{t('about_badge')}</span>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', color: 'var(--dark)' }}>{t('about_title')}</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--gray-500)', marginBottom: '2rem' }}>{t('about_desc')}</p>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                {[t('about_item_1'), t('about_item_2'), t('about_item_3'), t('about_item_4')].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--dark)' }}>
                    <div style={{ color: 'var(--primary)' }}><Icons.ShieldCheck /></div>{item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-200)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--dark)' }}>{t('cases_title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { title: t('case_1_title'), res: t('case_1_res') },
                  { title: t('case_2_title'), res: t('case_2_res') },
                  { title: t('case_3_title'), res: t('case_3_res') }
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
  const { language, t, isDarkMode } = useTheme();
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', company: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(t('status_1'));
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const statusMessages = [t('status_1'), t('status_2'), t('status_3'), t('status_4'), t('status_5')];

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name': return !value.trim() ? (language === 'ar' ? 'الاسم مطلوب' : 'Name is required') : '';
      case 'email': return !value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? (language === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email') : '';
      case 'description': return !value.trim() || value.trim().length < 10 ? (language === 'ar' ? 'يرجى تقديم تفاصيل أكثر' : 'Please provide more detail') : '';
      default: return '';
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
  };

  const isFormValid = () => !validateField('name', formState.name) && !validateField('email', formState.email) && !validateField('description', formState.description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setIsSubmitting(true);
    setLoadingProgress(5);
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        const step = Math.floor(prev / 20);
        setLoadingStatus(statusMessages[step] || statusMessages[statusMessages.length - 1]);
        return prev + 5;
      });
    }, 400);

    try {
      await analyzeProject(formState.description, language);
      setLoadingProgress(100);
      setLoadingStatus(t('status_complete'));
      await sleep(600);
      setSubmitted(true);
    } catch (error) {
      setApiError(language === 'ar' ? "حدث خطأ فني، يرجى المحاولة لاحقاً." : "Technical error, please try again later.");
    } finally {
      clearInterval(progressInterval);
      setIsSubmitting(false);
    }
  };

  const LabelWithTooltip = ({ label, tooltipKey }: { label: string, tooltipKey: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
      <label style={{ margin: 0 }}>{label}</label>
      <FieldTooltip text={t(tooltipKey)} />
    </div>
  );

  return (
    <section id="contact" className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--dark)' }}>{t('contact_title')}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>{t('contact_desc')}</p>
        </div>
        
        {submitted ? (
          <div className="card text-center success-card" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <div style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.1)', 
              color: '#16a34a', 
              padding: '0.5rem 1.5rem', 
              borderRadius: '9999px', 
              fontSize: '0.875rem', 
              fontWeight: '700', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '2rem'
            }}>
              <Icons.CheckCircle /> {t('success_banner')}
            </div>
            <div style={{ width: '300px', height: '300px', marginBottom: '0.5rem', overflow: 'hidden', animation: 'pulse 3s infinite ease-in-out' }}>
               <LottiePlayer src="https://lottie.host/f8b44455-6b5c-448a-81f1-3d71241f3e5c/S4h1uP7D1C.json" loop={false} speed={1.2} />
            </div>
            
            <h3 style={{ fontSize: '2.75rem', marginBottom: '1rem' }} className="text-gradient">{t('success_title')}</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem', fontWeight: 500, maxWidth: '500px', lineHeight: '1.6', marginBottom: '1.5rem' }}>{t('success_msg')}</p>
            
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.1)' : '#f5f3ff',
              borderLeft: language === 'en' ? '4px solid var(--primary)' : 'none',
              borderRight: language === 'ar' ? '4px solid var(--primary)' : 'none',
              padding: '1.25rem',
              borderRadius: '8px',
              maxWidth: '550px',
              width: '100%',
              marginBottom: '2rem',
              textAlign: language === 'ar' ? 'right' : 'left'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                {language === 'ar' ? 'الخطوات القادمة' : 'Next Steps'}
              </h4>
              <p style={{ color: 'var(--dark)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t('success_next_steps')}
              </p>
            </div>

            <button className="btn btn-primary" style={{ padding: '1rem 3.5rem', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' }} onClick={() => setSubmitted(false)}>{t('success_btn')}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ opacity: isSubmitting ? 0.9 : 1 }}>
            {apiError && <div className="error-message" style={{ marginBottom: '1.5rem', color: 'var(--error)' }}>{apiError}</div>}
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <LabelWithTooltip label={t('form_name')} tooltipKey="tip_name" />
                <input required disabled={isSubmitting} name="name" className="input-field" type="text" value={formState.name} onChange={handleChange} onBlur={handleBlur} />
              </div>
              <div>
                <LabelWithTooltip label={t('form_email')} tooltipKey="tip_email" />
                <input required disabled={isSubmitting} name="email" className="input-field" type="email" value={formState.email} onChange={handleChange} onBlur={handleBlur} />
              </div>
            </div>
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <LabelWithTooltip label={t('form_phone')} tooltipKey="tip_phone" />
                <input disabled={isSubmitting} name="phone" className="input-field" type="tel" value={formState.phone} onChange={handleChange} />
              </div>
              <div>
                <LabelWithTooltip label={t('form_company')} tooltipKey="tip_company" />
                <input disabled={isSubmitting} name="company" className="input-field" type="text" value={formState.company} onChange={handleChange} />
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <LabelWithTooltip label={t('form_desc')} tooltipKey="tip_desc" />
              <textarea required disabled={isSubmitting} name="description" className="input-field" rows={4} placeholder={t('form_desc_placeholder')} value={formState.description} onChange={handleChange} onBlur={handleBlur}></textarea>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>{t('form_ai_hint')}</p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.125rem', minHeight: '56px' }} disabled={isSubmitting}>
              {isSubmitting ? <><Icons.Loader /> {loadingStatus}</> : t('form_btn')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTheme();
  return (
    <footer style={{ background: 'var(--dark)', color: 'var(--white)', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: '4rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}>
              <div style={{ width: 24, height: 24, background: 'var(--gradient-primary)', borderRadius: '4px' }}></div>{t('brand')}
            </h3>
            <p style={{ color: 'var(--gray-500)', maxWidth: '300px' }}>{t('footer_desc')}</p>
          </div>
          <div><h4>{t('footer_company')}</h4><div className="footer-links"><a href="#">{t('nav_about')}</a><a href="#">{t('nav_services')}</a><a href="#">{t('cases_title')}</a></div></div>
          <div><h4>{t('footer_legal')}</h4><div className="footer-links"><a href="#">{t('footer_privacy')}</a><a href="#">{t('footer_terms')}</a></div></div>
        </div>
        <div style={{ borderTop: '1px solid var(--gray-800)', paddingTop: '2rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} {t('brand')}. {t('footer_copy')}
        </div>
      </div>
    </footer>
  );
}

function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const t = (key: string) => translations[language][key] || key;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, language, setLanguage, t }}>
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