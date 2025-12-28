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
    nav_advisory: "AI Advisory",
    btn_consultation: "Inquiry",
    btn_download_brief: "Download Brief",
    hero_badge: "Institutional Intelligence",
    hero_title: "Empowering Businesses with",
    hero_title_accent: "Intelligent Systems",
    hero_desc: "Exclusive strategic development through high-fidelity engineering. We deploy proprietary AI frameworks to help businesses navigate digital transformation and achieve operational excellence.",
    hero_btn_main: "Start AI Advisory",
    hero_btn_sec: "The Architecture",
    chat_title: "AI Strategic Advisory",
    chat_desc: "Decision support for AI transformation and digital roadmap planning.",
    chat_placeholder: "Describe your business challenge or ask about AI ROI...",
    chat_intro: "Welcome. I am your Strategic Intelligence Partner. How can I help you architect your institutional AI transformation today?",
    chat_system_instruction: "You are an elite Senior Digital Transformation Consultant at 'Business Developers'. Your mission is to help business leaders decide IF, WHERE, and HOW to implement AI. Focus on ROI, operational efficiency, and long-term scalability. Encourage users to think about their data readiness and specific pain points. Be professional, concise, and strategically minded.",
    laila_name: "Business Developer",
    laila_subtitle: "STRATEGIC AI",
    laila_intro: "Greetings. I am the Business Developer assistant. How can I facilitate your institutional growth today?",
    laila_q1: "What is AI Transformation?",
    laila_q2: "How to start a project?",
    laila_q3: "Speak with a guide",
    laila_placeholder: "Write your message here...",
    calc_title: "Development Estimator",
    calc_desc: "Simulate institutional development costs based on project parameters.",
    calc_platform: "Platform Architecture",
    calc_type: "Operational Complexity",
    calc_design: "Design Fidelity",
    calc_features: "Integrated Capabilities",
    calc_total: "Estimated Strategic Investment",
    calc_total_desc: "Based on selected architecture and complexity factors.",
    calc_disclaimer: "These figures represent institutional benchmarks and are subject to official diagnostic audit.",
    metrics_title: "Institutional Impact",
    metrics_1_val: "85%",
    metrics_1_label: "Success Rate",
    metrics_2_val: "75%",
    metrics_2_label: "Faster Market Access",
    metrics_3_val: "60%",
    metrics_3_label: "Cost Efficiency",
    profile_badge: "Company Profile 2024",
    profile_vision: "Vision: To lead digital innovation through strategic AI implementation.",
    profile_mission: "Mission: Empowering global businesses to transform through technology.",
    profile_upload_label: "Upload Institutional Brief",
    profile_upload_hint: "Supported formats: PDF, DOCX (Max 10MB)",
    profile_upload_btn: "Transmit Document",
    profile_upload_success: "Institutional Document Transmitted Successfully",
    profile_upload_error: "Transmission Error. Invalid File Format.",
    profile_upload_reset: "Upload New Document",
    inquiry_title: "Inquire about Capabilities",
    inquiry_name_placeholder: "Institutional Contact Name",
    inquiry_email_placeholder: "Professional Email Address",
    inquiry_service_placeholder: "Select Strategic Capability",
    inquiry_message_placeholder: "Describe your operational requirements...",
    inquiry_btn: "Transmit Inquiry",
    inquiry_success: "Inquiry Transmitted Successfully",
    inquiry_reset: "New Inquiry",
    about_badge: "Institutional Profile",
    about_title: "Architecting the future.",
    about_desc: "We transform theoretical AI into practical, institutional strategic assets.",
    about_content: "Business Developers represents the intersection of capital strategy and machine intelligence, providing the foundation for modern enterprise operations.",
    faq_title: "Strategic Intelligence FAQ",
    faq_q1: "What is AI Institutional Transformation?",
    faq_a1: "It is the comprehensive integration of machine intelligence into core business workflows, shifting from manual processes to data-driven autonomous systems that scale with enterprise growth.",
    faq_q2: "How long does a strategic audit take?",
    faq_a2: "A standard diagnostic audit takes 2 to 4 weeks, depending on the operational complexity and data accessibility of the institution.",
    faq_q3: "What security protocols do you use?",
    faq_a3: "We employ military-grade encryption, zero-trust architecture, and strict compliance with international data privacy standards like GDPR and ISO 27001.",
    faq_q4: "Can AI integrate with legacy systems?",
    faq_a4: "Yes. Our frameworks are engineered to act as an intelligence layer above legacy infrastructure, facilitating seamless data flow without requiring a total system overhaul.",
    faq_q5: "What is the expected ROI of AI?",
    faq_a5: "While metrics vary, institutions typically see a 30-50% increase in operational throughput and a significant reduction in human-error costs within the first 12 months.",
    home_about_section_title: "The Institutional Foundation",
    home_about_history_title: "Our History",
    home_about_history_desc: "Established with the vision to bridge the gap between theoretical machine learning and enterprise-grade operational reality. We have grown from a niche consultancy into a global leader in strategic AI engineering.",
    home_about_mission_title: "Our Mission",
    home_about_mission_desc: "To architect the intelligent infrastructures of the future, enabling global organizations to leverage data as a primary strategic asset for sustainable growth.",
    home_about_values_title: "Core Values",
    home_about_values_desc: "Precision in execution, ethical transparency in AI development, and absolute integrity in institutional data management.",
    contact_title: "Operational Brief",
    form_btn: "Transmit Brief",
    btn_back: "Return to Headquarters",
    footer_desc: "Engineering the future of intelligent systems through geometric precision.",
    footer_copy: "All institutional rights reserved.",
    status_1: "Analyzing brief parameters...",
    success_title: "Confirmed",
    success_msg: "Brief received.",
    success_btn: "New Dialogue",
  },
  ar: {
    brand: "بيزنس ديفلوبرز",
    nav_services: "القدرات",
    nav_packages: "المحفظة",
    nav_about: "المؤسسة",
    nav_contact: "الحوار",
    nav_profile: "ملف الشركة",
    nav_calculator: "حاسبة الأسعار",
    nav_advisory: "استشارات الذكاء الاصطناعي",
    btn_consultation: "استفسار",
    btn_download_brief: "تحميل الملف",
    hero_badge: "ذكاء مؤسسي",
    hero_title: "تمكين الشركات من خلال",
    hero_title_accent: "أنظمة ذكية",
    hero_desc: "تطوير استراتيجي حصري من خلال الهندسة المتقدمة. نقوم بنشر أطر ذكاء اصطناعي خاصة لمساعدة الشركات في التنقل عبر التحول الرقمي وتحقيق التميز التشغيلي.",
    hero_btn_main: "بدء استشارة AI",
    hero_btn_sec: "المعمارية",
    chat_title: "استشارات AI الاستراتيجية",
    chat_desc: "دعم اتخاذ القرار لتحول الذكاء الاصطناعي وتخطيط خارطة الطريق الرقمية.",
    chat_placeholder: "لخص تحديات أعمالك أو اسأل عن عائد استثمار AI...",
    chat_intro: "مرحباً بكم. أنا شريككم للذكاء الاستراتيجي. كيف يمكنني مساعدتكم في هندسة تحول الذكاء الاصطناعي المؤسسي الخاص بكم اليوم؟",
    chat_system_instruction: "أنت مستشار أول للتحول الرقمي في 'بيزنس ديفلوبرز'. مهمتك هي مساعدة قادة الأعمال في اتخاذ القرار بشأن متى وأين وكيف يتم تنفيذ الذكاء الاصطناعي. ركز على العائد على الاستثمار، الكفاءة التشغيلية، والتوسع طويل الأمد. شجع المستخدمين على التفكير في جاهزية بياناتهم ونقاط الألم المحددة لديهم. كن مهنياً، مختصراً، وذا عقلية استراتيجية.",
    laila_name: "مطور الاعمال",
    laila_subtitle: "المساعد الاستراتيجي",
    laila_intro: "مرحباً! أنا مطور الاعمال، مساعدك الرقمي في حي مطوري الأعمال. كيف يمكنني مساعدتك اليوم؟",
    laila_q1: "ما هو التحول الرقمي؟",
    laila_q2: "كيف أبدأ مشروعي؟",
    laila_q3: "تحدث مع خبير",
    laila_placeholder: "اكتب رسالتك هنا...",
    calc_title: "مقدر التطوير",
    calc_desc: "محاكاة تكاليف التطوير المؤسسي بناءً على معايير المشروع.",
    calc_platform: "معمارية المنصة",
    calc_type: "التعقيد التشغيلي",
    calc_design: "دقة التصميم",
    calc_features: "القدرات المتكاملة",
    calc_total: "الاستثمار الاستراتيجي المتوقع",
    calc_total_desc: "بناءً على المعمارية وعوامل التعقيد المختارة.",
    calc_disclaimer: "هذه الأرقام تمثل معايير مؤسسية وتخضع لتدقيق تشخيصي رسمي.",
    metrics_title: "الأثر المؤسسي",
    metrics_1_val: "85%",
    metrics_1_label: "نسبة نجاح المشاريع",
    metrics_2_val: "75%",
    metrics_2_label: "سرعة الوصول للسوق",
    metrics_3_val: "60%",
    metrics_3_label: "توفير التكاليف",
    profile_badge: "الملف التعريفي ٢٠٢٤",
    profile_vision: "الرؤية: قيادة الابتكار الرقمي عبر التنفيذ الاستراتيجي للذكاء الاصطناعي.",
    profile_mission: "الرسالة: تمكين الشركات العالمية من التحول عبر التكنولوجيا.",
    profile_upload_label: "رفع الموجز المؤسسي",
    profile_upload_hint: "الصيغ المدعومة: PDF, DOCX (بحد أقصى 10 ميجابايت)",
    profile_upload_btn: "إرسال المستند",
    profile_upload_success: "تم إرسال المستند المؤسسي بنجاح",
    profile_upload_error: "خطأ في الإرسال. صيغة الملف غير صالحة.",
    profile_upload_reset: "رفع مستند جديد",
    inquiry_title: "الاستفسار عن القدرات",
    inquiry_name_placeholder: "اسم جهة الاتصال المؤسسية",
    inquiry_email_placeholder: "البريد الإلكتروني المهني",
    inquiry_service_placeholder: "اختر القدرة الاستراتيجية",
    inquiry_message_placeholder: "صف متطلباتك التشغيلية...",
    inquiry_btn: "إرسال الاستفسار",
    inquiry_success: "تم إرسال الاستفسار بنجاح",
    inquiry_reset: "استفسار جديد",
    about_badge: "ملف المؤسسة",
    about_title: "هندسة المستقبل.",
    about_desc: "نحول الذكاء الاصطناعي النظري إلى أصول استراتيجية مؤسسية عملية.",
    about_content: "تمثل 'بيزنس ديفلوبرز' نقطة التقاء استراتيجية رأس المال وذكاء الآلة، مما يوفر الأساس لعمليات المؤسسات الحديثة.",
    faq_title: "الأسئلة الاستراتيجية الشائعة",
    faq_q1: "ما هو التحول المؤسسي بالذكاء الاصطناعي؟",
    faq_a1: "هو الدمج الشامل لذكاء الآلة في سير العمل الأساسي للأعمال، والانتقال من العمليات اليدوية إلى الأنظمة الذاتية القائمة على البيانات والتي تتوسع مع نمو المؤسسة.",
    faq_q2: "كم يستغرق التدقيق الاستراتيجي؟",
    faq_a2: "يستغرق التدقيق التشخيصي القياسي من أسبوعين إلى 4 أسابيع، اعتماداً على التعقيد التشغيلي وإمكانية الوصول إلى البيانات في المؤسسة.",
    faq_q3: "ما هي بروتوكولات الأمان التي تستخدمونها؟",
    faq_a3: "نحن نستخدم تشفيراً بمستوى عسكري، ومعمارية 'الثقة الصفرية phosphor'، والالتزام الصارم بمعايير خصوصية البيانات الدولية مثل GDPR و ISO 27001.",
    faq_q4: "هل يمكن للذكاء الاصطناعي التكامل مع الأنظمة القديمة؟",
    faq_a4: "نعم. تم تصميم أطرنا لتعمل كطبقة ذكاء فوق البنية التحتية القديمة، مما يسهل تدفق البيانات بسلاسة دون الحاجة إلى إصلاح شامل للنظام.",
    faq_q5: "ما هو العائد المتوقع على الاستثمار من الذكاء الاصطناعي؟",
    faq_a5: "بينما تختلف المقاييس، ترى المؤسسات عادةً زيادة بنسبة 30-50% في الإنتاجية التشغيلية وانخفاضاً كبيراً في تكاليف الأخطاء البشرية خلال الـ 12 شهراً الأولى.",
    home_about_section_title: "الأساس المؤسسي",
    home_about_history_title: "تاريخنا",
    home_about_history_desc: "تأسسنا برؤية لسد الفجوة بين تعلم الآلة النظري والواقع التشغيلي للمؤسسات. لقد تطورنا من استشارة متخصصة إلى رائد عالمي في هندسة الذكاء الاصطناعي الاستراتيجي.",
    home_about_mission_title: "مهمتنا",
    home_about_mission_desc: "هندسة البنى التحتية الذكية للمستقبل، وتمكين المنظمات العالمية من الاستفادة من البيانات كأصل استراتيجي أساسي للنمو المستدام.",
    home_about_values_title: "قيمنا الأساسية",
    home_about_values_desc: "الدقة في التنفيذ، والشفافية الأخلاقية في تطوير الذكاء الاصطناعي، والنزاهة المطلقة في إدارة البيانات المؤسسية.",
    contact_title: "موجز تشغيلي",
    form_btn: "إرسال الموجز",
    btn_back: "العودة للمقر الرئيسي",
    footer_desc: "هندسة مستقبل الأنظمة الذكية من خلال الدقة الهندسية.",
    footer_copy: "جميع الحقوق المؤسسية محفوظة.",
    status_1: "تحليل معايير الموجز...",
    success_title: "تم التأكيد",
    success_msg: "تم استلام الموجز.",
    success_btn: "حوار جديد",
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  ArrowLeft: ({ lang }: { lang: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  Loader: () => <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  File: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  ChatLauncher: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  ChevronDown: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  History: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Target: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Shield: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
};

// --- Components ---

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div style={{ borderBottom: `1px solid var(--gray-200)`, overflow: 'hidden' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '2rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'inherit', color: 'inherit'
        }}
      >
        <span style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}>{question}</span>
        <div style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
          <Icons.ChevronDown />
        </div>
      </button>
      <div style={{ 
        maxHeight: isOpen ? '500px' : '0', overflow: 'hidden', transition: 'all 0.4s ease',
        opacity: isOpen ? 1 : 0
      }}>
        <p style={{ padding: '0 1rem 2rem', color: 'var(--gray-500)', fontSize: '1rem', lineHeight: 1.8 }}>
          {answer}
        </p>
      </div>
    </div>
  );
}

function ServiceInquiryForm() {
  const { t, language } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 2000));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="card" style={{ maxWidth: '800px', margin: '4rem auto 0', textAlign: 'center', border: '2px solid var(--primary)', animation: 'popIn 0.5s ease forwards' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <Icons.Check />
        </div>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{t('inquiry_success')}</h2>
        <button onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', service: '', message: '' }); }} className="btn btn-outline">
          {t('inquiry_reset')}
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '4rem auto 0', borderTop: '8px solid var(--primary)' }}>
      <h3 style={{ fontSize: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>{t('inquiry_title')}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="grid grid-2" style={{ gap: '1.5rem' }}>
          <input 
            className="input-field" 
            placeholder={t('inquiry_name_placeholder')} 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            required
            disabled={status === 'loading'}
          />
          <input 
            type="email" 
            className="input-field" 
            placeholder={t('inquiry_email_placeholder')} 
            value={formData.email} 
            onChange={e => setFormData({ ...formData, email: e.target.value })} 
            required
            disabled={status === 'loading'}
          />
        </div>
        <select 
          className="input-field" 
          style={{ appearance: 'none' }}
          value={formData.service} 
          onChange={e => setFormData({ ...formData, service: e.target.value })}
          disabled={status === 'loading'}
        >
          <option value="">{t('inquiry_service_placeholder')}</option>
          <option value="transformation">Institutional Transformation</option>
          <option value="neural">Neural Architecture</option>
          <option value="security">Strategic Security</option>
          <option value="automation">Process Automation</option>
        </select>
        <textarea 
          className="input-field" 
          rows={5} 
          placeholder={t('inquiry_message_placeholder')} 
          value={formData.message} 
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          required
          disabled={status === 'loading'}
        />
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.5rem' }} disabled={status === 'loading'}>
          {status === 'loading' ? <Icons.Loader /> : t('inquiry_btn')}
        </button>
      </form>
    </div>
  );
}

// --- Views ---

function AboutView() {
  const { t, language, setActivePage, isDarkMode } = useTheme();

  return (
    <section className="section" style={{ background: isDarkMode ? 'var(--secondary)' : 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ marginBottom: '4rem', fontSize: '0.7rem' }}>
          <Icons.ArrowLeft lang={language} /> {t('btn_back')}
        </button>

        <div style={{ marginBottom: '8rem' }}>
          <span className="badge">{t('about_badge')}</span>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginBottom: '2.5rem' }}>{t('about_title')}</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.4rem', maxWidth: '800px', marginBottom: '4rem' }}>{t('about_desc')}</p>
          <div style={{ height: '1px', background: 'var(--gray-200)', width: '100%' }}></div>
        </div>

        <div className="grid grid-2" style={{ gap: '6rem', marginBottom: '10rem' }}>
          <div>
            <h3 style={{ marginBottom: '2rem' }}>Institutional Foundation</h3>
            <p style={{ lineHeight: 2, color: 'var(--gray-500)' }}>{t('about_content')}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2.5rem', background: 'var(--primary)', color: 'white' }}>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Vision</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t('profile_vision')}</p>
            </div>
            <div className="card" style={{ padding: '2.5rem', border: '2px solid var(--primary)' }}>
              <h4 style={{ marginBottom: '1rem' }}>Mission</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{t('profile_mission')}</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '8rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>{t('faq_title')}</h2>
          <div style={{ borderTop: `1px solid var(--gray-200)` }}>
            <FAQItem question={t('faq_q1')} answer={t('faq_a1')} />
            <FAQItem question={t('faq_q2')} answer={t('faq_a2')} />
            <FAQItem question={t('faq_q3')} answer={t('faq_a3')} />
            <FAQItem question={t('faq_q4')} answer={t('faq_a4')} />
            <FAQItem question={t('faq_q5')} answer={t('faq_a5')} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingChat() {
  const { t, language, isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t('laila_intro') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (text?: string) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

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
          systemInstruction: `You are the 'Business Developer' Assistant (مطور الاعمال) for 'Business Developers'. You help businesses explore AI transformation and digital solutions. Be friendly, professional, and strategic. Your goal is to guide clients toward high-value digital services. Language: ${language}.`,
          temperature: 0.7,
        }
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Communication timeout." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Link error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="floating-launcher"
        style={{
          position: 'fixed', bottom: '30px', [language === 'ar' ? 'left' : 'right']: '30px',
          width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#007bff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,123,255,0.4)', zIndex: 9999, border: 'none', transition: 'all 0.3s ease'
        }}
      >
        <Icons.ChatLauncher />
      </button>
    );
  }

  return (
    <div 
      className="floating-chat-modal"
      style={{
        position: 'fixed', bottom: '30px', [language === 'ar' ? 'left' : 'right']: '30px',
        width: '400px', maxWidth: '90vw', height: '600px', maxHeight: '80vh',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 12px 48px rgba(0,0,0,0.2)', zIndex: 9999,
        border: isDarkMode ? '1px solid #333' : '1px solid #eee'
      }}
    >
      <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Icons.X /></button>
           <div style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
             <h4 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>{t('laila_name')}</h4>
             <span style={{ fontSize: '0.65rem', color: '#007bff', fontWeight: 900, letterSpacing: '0.1em' }}>{t('laila_subtitle')}</span>
           </div>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.ChatLauncher />
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: isDarkMode ? '#1a1a1a' : '#f8f9fa' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
            <div style={{ 
              maxWidth: '85%', padding: '1rem 1.25rem', borderRadius: '18px',
              background: m.role === 'user' ? '#ffffff' : '#002b45',
              color: m.role === 'user' ? '#1a1a1a' : '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              fontSize: '0.9rem', lineHeight: 1.5,
              border: m.role === 'user' ? '1px solid #eee' : 'none'
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '0.75rem 1.25rem', borderRadius: '18px', background: '#002b45', color: 'white' }}>
              <Icons.Loader />
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '1rem', background: isDarkMode ? '#1a1a1a' : '#ffffff', borderTop: isDarkMode ? '1px solid #333' : '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[t('laila_q1'), t('laila_q2'), t('laila_q3')].map((q, idx) => (
            <button key={idx} onClick={() => handleSend(q)} style={{ 
              padding: '0.5rem 1rem', borderRadius: '12px', background: '#f0f2f5', 
              border: 'none', fontSize: '0.75rem', cursor: 'pointer', color: '#65676b'
            }}>
              {q}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f0f2f5', borderRadius: '12px', padding: '0.5rem' }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('laila_placeholder')}
            style={{ 
              flex: 1, background: 'transparent', border: 'none', padding: '0.5rem',
              outline: 'none', fontSize: '0.9rem', color: '#1a1a1a'
            }}
          />
          <button 
            onClick={() => handleSend()}
            style={{ 
              width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#007bff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
            }}
          >
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Views ---

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
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Communication timeout." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Neural link interrupted." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ height: 'calc(100vh - 110px)', background: isDarkMode ? 'var(--secondary)' : 'var(--white)', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1000px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}>
            <Icons.ArrowLeft lang={language} /> {t('btn_back')}
          </button>
          <div style={{ marginTop: '2rem' }}>
            <span className="badge">{t('nav_advisory')}</span>
            <h1 style={{ fontSize: '2.5rem' }}>{t('chat_title')}</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{t('chat_desc')}</p>
          </div>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--gray-200)', padding: '2rem', marginBottom: '2rem', background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'var(--white)' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ 
                maxWidth: '80%', padding: '1.5rem', background: m.role === 'user' ? 'var(--gray-100)' : 'var(--primary)', 
                color: m.role === 'user' ? 'var(--dark)' : 'white', border: '1px solid var(--gray-200)', fontSize: '0.95rem', lineHeight: 1.6 
              }}>
                {m.text}
                <div style={{ marginTop: '0.5rem', fontSize: '0.6rem', opacity: 0.4, textTransform: 'uppercase' }}>
                  {m.role === 'user' ? 'Institutional' : 'AI Strategist'}
                </div>
              </div>
            </div>
          ))}
          {loading && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '1rem', background: 'var(--primary)', color: 'white', width: 'fit-content' }}><Icons.Loader /> <span style={{ fontSize: '0.7rem' }}>Analysing...</span></div>}
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', paddingBottom: '2rem' }}>
          <input className="input-field" placeholder={t('chat_placeholder')} value={input} onChange={e => setInput(e.target.value)} disabled={loading} style={{ flex: 1 }} />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }} disabled={loading}><Icons.Send /></button>
        </form>
      </div>
    </section>
  );
}

function PriceCalculatorView() {
  const { t, language, setActivePage, isDarkMode } = useTheme();
  const [platform, setPlatform] = useState(PLATFORMS[0].id);
  const [complexity, setComplexity] = useState(COMPLEXITY[0].id);
  const [design, setDesign] = useState(DESIGN[0].id);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const calculatePrice = () => {
    const pPrice = PLATFORMS.find(p => p.id === platform)?.price || 0;
    const dPrice = DESIGN.find(d => d.id === design)?.price || 0;
    const fPrice = FEATURES.filter(f => selectedFeatures.includes(f.id)).reduce((acc, f) => acc + f.price, 0);
    const multiplier = COMPLEXITY.find(c => c.id === complexity)?.multiplier || 1;
    return Math.round((pPrice + dPrice + fPrice) * multiplier);
  };

  return (
    <section className="section" style={{ background: isDarkMode ? 'var(--secondary)' : 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ marginBottom: '4rem', padding: '0.75rem 1.5rem', display: 'flex', gap: '1rem' }}>
          <Icons.ArrowLeft lang={language} /> {t('btn_back')}
        </button>

        <div className="text-center" style={{ marginBottom: '6rem' }}>
          <span className="badge">{t('nav_calculator')}</span>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>{t('calc_title')}</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.2rem' }}>{t('calc_desc')}</p>
        </div>

        <div className="grid grid-2" style={{ gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>{t('calc_platform')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p.id)} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderColor: platform === p.id ? 'var(--primary)' : 'var(--gray-200)', background: platform === p.id ? 'rgba(0,43,69,0.05)' : 'transparent', cursor: 'pointer' }}>
                    <span>{language === 'en' ? p.label_en : p.label_ar}</span>
                    {platform === p.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>{t('calc_type')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {COMPLEXITY.map(c => (
                  <button key={c.id} onClick={() => setComplexity(c.id)} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderColor: complexity === c.id ? 'var(--primary)' : 'var(--gray-200)', background: complexity === c.id ? 'rgba(0,43,69,0.05)' : 'transparent', cursor: 'pointer' }}>
                    <span>{language === 'en' ? c.label_en : c.label_ar}</span>
                    {complexity === c.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>{t('calc_design')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {DESIGN.map(d => (
                  <button key={d.id} onClick={() => setDesign(d.id)} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderColor: design === d.id ? 'var(--primary)' : 'var(--gray-200)', background: design === d.id ? 'rgba(0,43,69,0.05)' : 'transparent', cursor: 'pointer' }}>
                    <span>{language === 'en' ? d.label_en : d.label_ar}</span>
                    {design === d.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>{t('calc_features')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {FEATURES.map(f => (
                  <button key={f.id} onClick={() => {
                    setSelectedFeatures(prev => prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id]);
                  }} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: selectedFeatures.includes(f.id) ? 'var(--primary)' : 'var(--gray-200)', background: selectedFeatures.includes(f.id) ? 'rgba(0,43,69,0.05)' : 'transparent', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <span style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>{language === 'en' ? f.label_en : f.label_ar}</span>
                    {selectedFeatures.includes(f.id) && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '4rem 3rem', textAlign: 'center', height: 'fit-content', position: 'sticky', top: '150px' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', opacity: 0.6, marginBottom: '2rem' }}>{t('calc_total')}</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>${calculatePrice().toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>USD</span></div>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '2rem', fontStyle: 'italic' }}>{t('calc_total_desc')}</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, lineHeight: 1.6, marginBottom: '2.5rem' }}>{t('calc_disclaimer')}</p>
            <button onClick={() => setActivePage('advisory')} className="btn btn-outline" style={{ width: '100%', color: 'white', borderColor: 'white' }}>Connect with Advisory</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanyProfileView() {
  const { t, language, setActivePage, isDarkMode } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (uploadSuccess && lottieContainerRef.current) {
      const anim = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'https://lottie.host/855b46e3-82a1-432a-9f5e-141a02196658/K2Z3JdE07S.json'
      });
      return () => anim.destroy();
    }
  }, [uploadSuccess]);

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise(r => setTimeout(r, 1500));
    const brief = `Institutional Brief 2024\n\nVision: ${t('profile_vision')}\nMission: ${t('profile_mission')}`;
    const blob = new Blob([brief], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Institutional_Brief_${language.toUpperCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadSuccess(false);
      } else {
        alert(t('profile_upload_error'));
        e.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 2000));
    setUploading(false);
    setUploadSuccess(true);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="section" style={{ background: isDarkMode ? 'var(--secondary)' : 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6rem' }}>
          <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ fontSize: '0.7rem' }}>
            <Icons.ArrowLeft lang={language} /> {t('btn_back')}
          </button>
          <button onClick={handleDownload} className="btn btn-primary" style={{ fontSize: '0.7rem' }}>
            {downloading ? <Icons.Loader /> : <Icons.Download />} {t('btn_download_brief')}
          </button>
        </div>

        <div className="text-center" style={{ marginBottom: '8rem' }}>
          <span className="badge">{t('profile_badge')}</span>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginBottom: '2.5rem' }}>Strategic Architecture</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto' }}>{t('profile_vision')}</p>
        </div>

        <div className="card" style={{ border: '1px dashed var(--primary)', background: isDarkMode ? 'rgba(0,43,69,0.2)' : 'rgba(0,43,69,0.02)', padding: '5rem 2rem', textAlign: 'center' }}>
          {!uploadSuccess ? (
            <>
              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Icons.File />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>{t('profile_upload_label')}</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '3rem' }}>{t('profile_upload_hint')}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <input 
                  type="file" 
                  accept=".pdf,.docx" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }} 
                />
                
                {!selectedFile ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="btn btn-outline"
                    style={{ padding: '1rem 3rem' }}
                  >
                    Select Document
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
                    <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--primary)', background: 'var(--white)' }}>
                      <Icons.File />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedFile.name}
                      </span>
                    </div>
                    <button 
                      onClick={handleUpload} 
                      disabled={uploading}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      {uploading ? <Icons.Loader /> : <Icons.Upload />} {t('profile_upload_btn')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ animation: 'popIn 0.5s ease forwards' }} role="status" aria-live="polite">
              <div ref={lottieContainerRef} style={{ width: '240px', height: '240px', margin: '0 auto 2rem' }} aria-label="Upload successful"></div>
              <button 
                onClick={() => {
                  setUploadSuccess(false);
                  setSelectedFile(null);
                }} 
                className="btn btn-outline"
              >
                {t('profile_upload_reset')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// --- Main Components ---

function AboutUsSection({ id }: { id?: string }) {
  const { t } = useTheme();
  return (
    <section className="section bg-light" id={id}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '6rem' }}>
          <span className="badge">{t('home_about_section_title')}</span>
          <h2 style={{ fontSize: '3.5rem' }}>{t('about_title')}</h2>
        </div>
        <div className="grid grid-3">
          <div className="card" style={{ borderTop: '8px solid var(--primary)', padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}><Icons.History /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('home_about_history_title')}</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.7 }}>{t('home_about_history_desc')}</p>
          </div>
          <div className="card" style={{ borderTop: '8px solid var(--primary)', padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}><Icons.Target /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('home_about_mission_title')}</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.7 }}>{t('home_about_mission_desc')}</p>
          </div>
          <div className="card" style={{ borderTop: '8px solid var(--primary)', padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}><Icons.Shield /></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('home_about_values_title')}</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.7 }}>{t('home_about_values_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NavLink({ onClick, label, tooltip }: { onClick: () => void; label: string; tooltip: string }) {
  return (
    <div className="tooltip-wrapper">
      <a 
        onClick={onClick} 
        style={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}
      >
        {label}
      </a>
      <span className="nav-tooltip">{tooltip}</span>
    </div>
  );
}

function Header() {
  const { isDarkMode, toggleDarkMode, language, setLanguage, activePage, setActivePage, t } = useTheme();
  
  const handleNav = (p: PageView) => { 
    setActivePage(p); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleAnchorNav = (id: string) => {
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: isDarkMode ? '#001a2a' : '#fcfcfc', borderBottom: '1px solid var(--gray-200)', height: '110px', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontWeight: 900, cursor: 'pointer', color: 'var(--primary)' }} onClick={() => handleNav('home')}>
          <Icons.Logo /> <span>{t('brand')}</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <NavLink onClick={() => handleAnchorNav('capabilities-section')} label={t('nav_services')} tooltip={t('nav_services')} />
          <NavLink onClick={() => handleNav('about')} label={t('nav_about')} tooltip={t('nav_about')} />
          <div className="tooltip-wrapper">
            <a 
              onClick={() => handleNav('advisory')} 
              style={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid' }}
            >
              {t('nav_advisory')}
            </a>
            <span className="nav-tooltip">{t('nav_advisory')}</span>
          </div>
          <NavLink onClick={() => handleNav('calculator')} label={t('nav_calculator')} tooltip={t('nav_calculator')} />
          <NavLink onClick={() => handleNav('profile')} label={t('nav_profile')} tooltip={t('nav_profile')} />
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="theme-toggle" style={{ fontSize: '0.6rem' }}>{language.toUpperCase()}</button>
            <button onClick={toggleDarkMode} className="theme-toggle">{isDarkMode ? <Icons.Sun /> : <Icons.Moon />}</button>
          </div>
          <a onClick={() => handleNav('advisory')} className="btn btn-prominent" style={{ 
            padding: '0.8rem 2.2rem', 
            fontSize: '0.75rem',
            fontWeight: '900'
          }}>
            {t('hero_btn_main')}
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const { t, setActivePage } = useTheme();
  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '850px' }}>
          <span className="badge">{t('hero_badge')}</span>
          <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', lineHeight: 0.95, marginBottom: '2.5rem', fontWeight: 900 }}>
            {t('hero_title')} <span style={{ color: 'var(--primary)' }}>{t('hero_title_accent')}</span>
          </h1>
          <p style={{ fontSize: '1.3rem', color: 'var(--gray-500)', marginBottom: '4rem', lineHeight: 1.6, maxWidth: '700px' }}>{t('hero_desc')}</p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActivePage('advisory')} className="btn btn-prominent" style={{ padding: '1.5rem 3rem' }}>{t('hero_btn_main')}</button>
            <button onClick={() => setActivePage('profile')} className="btn btn-outline" style={{ padding: '1.5rem 3rem' }}>{t('hero_btn_sec')}</button>
          </div>
        </div>
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
    { val: "0", label: "Breach Incidents" }
  ];
  return (
    <section style={{ background: 'var(--primary)', color: 'white', padding: '6rem 0' }}>
      <div className="container">
        <div className="grid grid-4">
          {metrics.map((m, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{m.val}</div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
            <AboutUsSection id="institutional-summary" />
            <section className="section" id="capabilities-section">
              <div className="container">
                <div className="text-center" style={{ marginBottom: '8rem' }}>
                  <h2 style={{ fontSize: '3.5rem' }}>Core Strategic Services</h2>
                </div>
                <div className="grid grid-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card" style={{ borderTop: '10px solid var(--primary)' }}>
                      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Capability {i}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>Comprehensive institutional development tailored to your enterprise scaling needs.</p>
                    </div>
                  ))}
                </div>
                <ServiceInquiryForm />
              </div>
            </section>
          </>
        ) : activePage === 'profile' ? (
          <CompanyProfileView />
        ) : activePage === 'calculator' ? (
          <PriceCalculatorView />
        ) : activePage === 'advisory' ? (
          <AdvisoryChatView />
        ) : activePage === 'about' ? (
          <AboutView />
        ) : (
          <div className="section"><div className="container"><h1>Under Construction</h1></div></div>
        )}
      </main>
      <FloatingChat />
      <footer style={{ background: 'var(--secondary)', color: 'white', padding: '10rem 0 5rem' }}>
        <div className="container">
          <div className="grid grid-4" style={{ marginBottom: '6rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}><Icons.Logo /> {t('brand')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', fontSize: '0.95rem' }}>Engineering the future of intelligent systems through geometric precision.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '2.5rem' }}>PORTFOLIO</h4>
              <div className="footer-links">
                <a onClick={() => setActivePage('about')}>Institutional Profile</a>
                <a onClick={() => setActivePage('advisory')}>AI Advisory</a>
                <a onClick={() => setActivePage('calculator')}>Pricing Estimator</a>
                <a onClick={() => setActivePage('profile')}>Institutional Brief</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '2.5rem' }}>COMPLIANCE</h4>
              <div className="footer-links">
                <a href="#">Security Protocol</a>
                <a href="#">Privacy Framework</a>
                <a href="#">Terms of Engagement</a>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>&copy; 2024 {t('brand')}. All institutional rights reserved.</div>
        </div>
      </footer>
    </ThemeContext.Provider>
  );
}

const PLATFORMS = [
  { id: 'ios', label_en: 'iOS Architecture', label_ar: 'معمارية iOS', price: 15000 },
  { id: 'android', label_en: 'Android Architecture', label_ar: 'معمارية Android', price: 15000 },
  { id: 'both', label_en: 'Unified Platform (Cross)', label_ar: 'منصة موحدة', price: 28000 }
];
const COMPLEXITY = [
  { id: 'mvp', label_en: 'Institutional MVP', label_ar: 'الحد الأدنى للمنتج', multiplier: 1.0 },
  { id: 'standard', label_en: 'Operational Standard', label_ar: 'المعيار التشغيلي', multiplier: 1.8 },
  { id: 'complex', label_en: 'Enterprise Integrated', label_ar: 'المؤسسة المتكاملة', multiplier: 3.5 }
];
const DESIGN = [
  { id: 'basic', label_en: 'Systemic (Standard)', label_ar: 'منهجي (قياسي)', price: 5000 },
  { id: 'premium', label_en: 'Institutional (High-Fid)', label_ar: 'مؤسسي (عالي الدقة)', price: 12000 }
];
const FEATURES = [
  { id: 'analytics', label_en: 'Advanced Analytics', label_ar: 'تحليلات متقدمة', price: 4000 },
  { id: 'predictive_intel', label_en: 'Predictive Intelligence', label_ar: 'ذكاء تنبؤي', price: 8000 },
  { id: 'security', label_en: 'Enhanced Security', label_ar: 'أمن معزز', price: 6000 },
  { id: 'automation', label_en: 'Process Automation', label_ar: 'أتمتة العمليات', price: 7500 },
  { id: 'custom_api', label_en: 'Custom API Layer', label_ar: 'طبقة API مخصصة', price: 5000 }
];

const root = createRoot(document.getElementById('root')!);
root.render(<App />);