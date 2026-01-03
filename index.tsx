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
  heroImage: string | null;
}>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  language: 'en',
  setLanguage: () => {},
  activePage: 'home',
  setActivePage: () => {},
  t: (key) => key,
  heroImage: null,
});

const useTheme = () => useContext(ThemeContext);

// --- Translations ---
const translations: Record<Language, Record<string, string>> = {
  en: {
    brand: "AISOLUTIONS",
    nav_services: "Capabilities",
    nav_audit: "Audit",
    nav_security: "Security",
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
    hero_subtitle: "The benchmark in proprietary machine intelligence and high-fidelity strategic engineering.",
    hero_desc: "Exclusive strategic development through high-fidelity engineering. We deploy proprietary AI frameworks to help businesses navigate digital transformation and achieve operational excellence.",
    hero_btn_main: "Start AI Advisory",
    hero_btn_sec: "The Architecture",
    chat_title: "AI Strategic Advisory",
    chat_desc: "Decision support for AI transformation and digital roadmap planning.",
    chat_placeholder: "Describe your business challenge or ask about AI ROI...",
    chat_intro: "Welcome. I am your Strategic Intelligence Partner. How can I help you architect your institutional AI transformation today?",
    chat_system_instruction: "You are an elite Senior Digital Transformation Consultant at 'AISolutions'. Your mission is to help business leaders decide IF, WHERE, and HOW to implement AI. Focus on ROI, operational efficiency, and long-term scalability. Encourage users to think about their data readiness and specific pain points. Be professional, concise, and strategically minded.",
    laila_name: "AISolutions Assistant",
    laila_subtitle: "STRATEGIC AI",
    laila_intro: "Greetings. I am your AISolutions digital advisor. How can I facilitate your institutional growth today?",
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
    inquiry_copy_btn: "Copy Strategic Assessment",
    inquiry_copy_success: "Assessment Copied",
    about_badge: "Institutional Profile",
    about_title: "Architecting the future.",
    about_desc: "We transform theoretical AI into practical, institutional strategic assets.",
    about_content: "AISolutions represents the intersection of capital strategy and machine intelligence, providing the foundation for modern enterprise operations.",
    audit_badge: "Strategic Audit",
    audit_title: "Diagnostic Integrity.",
    audit_desc: "Deep-spectrum auditing for institutional intelligence systems.",
    audit_content: "Our diagnostic process is engineered to surface operational friction points and data silos that inhibit growth. We provide a rigorous assessment of current machine learning deployments and legacy architectures to ensure your institutional foundation is ready for the next generation of AI integration.",
    security_badge: "Strategic Security",
    security_title: "Impenetrable Defense.",
    security_desc: "Military-grade neural safeguards for institutional data assets.",
    security_content: "Our security protocols are built on a foundation of zero-trust architecture and real-time adversarial monitoring. We deploy proprietary encryption layers and neural intrusion detection systems that evolve alongside emerging threats. AISolutions ensures that your most sensitive strategic data remains isolated and protected against both classical and quantum-era cyber risks.",
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
    brand: "إيه آي سوليوشنز",
    nav_services: "القدرات",
    nav_audit: "التدقيق",
    nav_security: "الأمن",
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
    hero_subtitle: "المعيار في ذكاء الآلة الخاص والهندسة الاستراتيجية عالية الدقة.",
    hero_desc: "تطوير استراتيجي حصري من خلال الهندسة المتقدمة. نقوم بنشر أطر ذكاء اصطناعي خاصة لمساعدة الشركات في التنقل عبر التحول الرقمي وتحقيق التميز التشغيلي.",
    hero_btn_main: "بدء استشارة AI",
    hero_btn_sec: "المعمارية",
    chat_title: "استشارات AI الاستراتيجية",
    chat_desc: "دعم اتخاذ القرار لتحول الذكاء الاصطناعي وتخطيط خارطة الطريق الرقمية.",
    chat_placeholder: "لخص تحديات أعمالك أو اسأل عن عائد استثمار AI...",
    chat_intro: "مرحباً بكم. أنا شريككم للذكاء الاستراتيجي من إيه آي سوليوشنز. كيف يمكنني مساعدتكم في هندسة تحول الذكاء الاصطناعي المؤسسي الخاص بكم اليوم؟",
    chat_system_instruction: "أنت مستشار أول للتحول الرقمي في 'إيه آي سوليوشنز'. مهمتك هي مساعدة قادة الأعمال في اتخاذ القرار بشأن متى وأين وكيف يتم تنفيذ الذكاء الاصطناعي. ركز على العائد على الاستثمار، الكفاءة التشغيلية، والتوسع طويل الأمد. شجع المستخدمين على التفكير في جاهزية بياناتهم ونقاط الألم المحددة لديهم. كن مهنياً، مختصراً، وذا عقلية استراتيجية.",
    laila_name: "مساعد إيه آي سوليوشنز",
    laila_subtitle: "المساعد الاستراتيجي",
    laila_intro: "مرحباً! أنا مساعدك الرقمي من إيه آي سوليوشنز. كيف يمكنني مساعدتك اليوم؟",
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
    inquiry_copy_btn: "نسخ التقييم الاستراتيجي",
    inquiry_copy_success: "تم نسخ التقييم",
    about_badge: "ملف المؤسسة",
    about_title: "هندسة المستقبل.",
    about_desc: "نحول الذكاء الاصطناعي النظري إلى أصول استراتيجية مؤسسية عملية.",
    about_content: "تمثل 'إيه آي سوليوشنز' نقطة التقاء استراتيجية رأس المال وذكاء الآلة، مما يوفر الأساس لعمليات المؤسسات الحديثة.",
    audit_badge: "التدقيق الاستراتيجي",
    audit_title: "نزاهة التشخيص.",
    audit_desc: "تدقيق شامل لأنظمة الذكاء المؤسسي.",
    audit_content: "تم تصميم عملية التشخيص لدينا للكشف عن نقاط الاحتكاال التشغيلي وصوامع البيانات التي تعيق النمو. نحن نقدم تقييماً صارماً لعمليات تعلم الآلة الحالية والمعماريات القديمة لضمان جاهزية مؤسستك للجيل القادم من تكامل الذكاء الاصطناعي.",
    security_badge: "الأمن الاستراتيجي",
    security_title: "دفاع لا يمكن اختراقه.",
    security_desc: "ضمانات عصبية بمستوى عسكري لأصول البيانات المؤسسية.",
    security_content: "تعتمد بروتوكولات الأمان لدينا على أساس معمارية الثقة الصفرية والمراقبة المستمرة للتهديدات. نحن ننشر طبقات تشفير خاصة وأنظمة كشف التسلل العصبي التي تتطور جنباً إلى جنب مع التهديدات الناشئة. تضمن إيه آي سوليوشنز بقاء بياناتك الاستراتيجية الأكثر حساسية معزولة ومحمية ضد المخاطر السيبرانية الكلاسيكية وفي عصر الكوآنتوم.",
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
    home_about_values_title: "القيم الأساسية",
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
  Logo: ({ size = 32 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M50 15V85" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
      <circle cx="50" cy="35" r="8" fill="currentColor"/>
      <circle cx="35" cy="50" r="4" fill="currentColor"/>
      <circle cx="65" cy="50" r="4" fill="currentColor"/>
      <path d="M35 50L50 35L65 50" stroke="currentColor" strokeWidth="2"/>
      <path d="M50 35L50 65" stroke="currentColor" strokeWidth="2"/>
      <rect x="44" y="65" width="12" height="12" rx="2" fill="currentColor"/>
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
  Copy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
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
  Shield: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Lightbulb: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M9 21h6"/><path d="M9 18h6"/><path d="M10 15c-3.33 0-5-1.67-5-5 0-3.87 3.13-7 7-7s7 3.13 7 7c0 3.33-1.67 5-5 5"/><path d="M12 21v1"/></svg>,
  Cpu: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>,
  Network: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>,
  Activity: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
};

// --- View Components ---

function SecurityView() {
  const { t, language, setActivePage, isDarkMode } = useTheme();

  return (
    <section className="section" style={{ background: isDarkMode ? 'var(--secondary)' : 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <button 
          onClick={() => setActivePage('home')} 
          className="btn btn-outline" 
          style={{ marginBottom: '4rem', fontSize: '0.7rem' }}
          aria-label={t('btn_back')}
        >
          <Icons.ArrowLeft lang={language} /> {t('btn_back')}
        </button>

        <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center', color: 'var(--primary)' }}>
            <Icons.Shield />
          </div>
          <span className="badge">{t('security_badge')}</span>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginBottom: '2.5rem' }}>{t('security_title')}</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 4rem' }}>{t('security_desc')}</p>
          <div style={{ height: '1px', background: 'var(--gray-200)', width: '100%' }}></div>
        </div>

        <div className="card" style={{ padding: '5rem', borderLeft: '10px solid var(--primary)', animation: 'popIn 0.6s ease forwards' }}>
          <p style={{ fontSize: '1.25rem', lineHeight: 2, color: isDarkMode ? 'white' : 'var(--primary)' }}>
            {t('security_content')}
          </p>
        </div>

        <div style={{ marginTop: '6rem', textAlign: 'center' }}>
          <button onClick={() => setActivePage('advisory')} className="btn btn-prominent" style={{ padding: '1.5rem 4rem' }} aria-label="Initiate Security Protocol Advisory">
            Initiate Security Protocol
          </button>
        </div>
      </div>
    </section>
  );
}

function AuditView() {
  const { t, language, setActivePage, isDarkMode } = useTheme();

  return (
    <section className="section" style={{ background: isDarkMode ? 'var(--secondary)' : 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <button 
          onClick={() => setActivePage('home')} 
          className="btn btn-outline" 
          style={{ marginBottom: '4rem', fontSize: '0.7rem' }}
          aria-label={t('btn_back')}
        >
          <Icons.ArrowLeft lang={language} /> {t('btn_back')}
        </button>

        <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center', color: 'var(--primary)' }}>
            <Icons.Activity />
          </div>
          <span className="badge">{t('audit_badge')}</span>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginBottom: '2.5rem' }}>{t('audit_title')}</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 4rem' }}>{t('audit_desc')}</p>
          <div style={{ height: '1px', background: 'var(--gray-200)', width: '100%' }}></div>
        </div>

        <div className="card" style={{ padding: '5rem', borderLeft: '10px solid var(--primary)', animation: 'popIn 0.6s ease forwards' }}>
          <p style={{ fontSize: '1.25rem', lineHeight: 2, color: isDarkMode ? 'white' : 'var(--primary)' }}>
            {t('audit_content')}
          </p>
        </div>

        <div style={{ marginTop: '6rem', textAlign: 'center' }}>
          <button onClick={() => setActivePage('advisory')} className="btn btn-prominent" style={{ padding: '1.5rem 4rem' }} aria-label="Book AI Strategic Diagnostic Review">
            Book Diagnostic Review
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutView() {
  const { t, language, setActivePage, isDarkMode } = useTheme();

  return (
    <section className="section" style={{ background: isDarkMode ? 'var(--secondary)' : 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <button 
          onClick={() => setActivePage('home')} 
          className="btn btn-outline" 
          style={{ marginBottom: '4rem', fontSize: '0.7rem' }}
          aria-label={t('btn_back')}
        >
          <Icons.ArrowLeft lang={language} /> {t('btn_back')}
        </button>

        <div style={{ marginBottom: '6rem' }}>
          <span className="badge">{t('about_badge')}</span>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginBottom: '2.5rem' }}>{t('about_title')}</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.4rem', maxWidth: '800px', marginBottom: '4rem' }}>{t('about_desc')}</p>
          <div style={{ height: '1px', background: 'var(--gray-200)', width: '100%' }}></div>
        </div>

        {/* Modular Sections */}
        <HistorySection />
        <MissionSection />
        <ValuesSection />

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

function HistorySection() {
  const { t, isDarkMode } = useTheme();
  return (
    <div style={{ marginBottom: '8rem', animation: 'popIn 0.6s ease forwards' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem' }}>
        {t('home_about_history_title')}
      </h2>
      <div style={{ display: 'grid', gap: '3rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)', minWidth: '80px' }}>2018</div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Incubation</h4>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.8 }}>
              AISolutions was conceived in Zurich as a boutique data strategy firm focusing on high-frequency trading and predictive risk modeling.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)', minWidth: '80px' }}>2021</div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Neural Expansion</h4>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.8 }}>
              We pivoted toward full-spectrum machine intelligence, building proprietary large-scale neural frameworks for institutional supply chain optimization.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)', minWidth: '80px' }}>2024</div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Global Leadership</h4>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.8 }}>
              Today, we operate as a leading institutional advisor, managing digital transformation for Fortune 500 enterprises across three continents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionSection() {
  const { t, isDarkMode } = useTheme();
  return (
    <div style={{ 
      marginBottom: '8rem', 
      padding: '5rem 3rem', 
      background: isDarkMode ? 'rgba(0,43,69,0.3)' : 'var(--light)', 
      textAlign: 'center',
      borderLeft: '10px solid var(--primary)',
      animation: 'popIn 0.8s ease forwards'
    }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{t('home_about_mission_title')}</h2>
      <p style={{ 
        fontSize: '1.8rem', 
        fontWeight: 300, 
        color: isDarkMode ? 'white' : 'var(--primary)', 
        maxWidth: '900px', 
        margin: '0 auto', 
        lineHeight: 1.4,
        fontStyle: 'italic'
      }}>
        "{t('home_about_mission_desc')}"
      </p>
    </div>
  );
}

function ValuesSection() {
  const { t } = useTheme();
  const values = [
    { icon: <Icons.Target />, title: "Precision", desc: "Absolute mathematical accuracy in every algorithm we deploy." },
    { icon: <Icons.Shield />, title: "Integrity", desc: "Unwavering ethical standards in data governance and privacy." },
    { icon: <Icons.Lightbulb />, title: "Innovation", desc: "Aggressive pursuit of next-generation machine intelligence." }
  ];

  return (
    <div style={{ marginBottom: '8rem', animation: 'popIn 1s ease forwards' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem', textAlign: 'center' }}>{t('home_about_values_title')}</h2>
      <div className="grid grid-3" style={{ gap: '3rem' }}>
        {values.map((v, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '4rem 2rem', borderTop: '5px solid var(--primary)' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>{v.icon}</div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{v.title}</h3>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.7 }}>{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        aria-expanded={isOpen}
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
  const { t, language, isDarkMode } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [analysis, setAnalysis] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'success' && lottieContainerRef.current) {
      const anim = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'https://lottie.host/855b46e3-82a1-432a-9f5e-141a02196658/K2Z3JdE07S.json'
      });
      return () => anim.destroy();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('loading');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Generate a professional institutional strategic assessment for this business inquiry: Name: ${formData.name}, Service: ${formData.service || 'General Consulting'}, Message: ${formData.message}. Focus on high-level ROI potential, operational alignment, and technical feasibility. Language: ${language}. Keep it concise, under 150 words.` }] }],
        config: {
          systemInstruction: "You are a Senior Strategic AI Consultant. Your goal is to provide a brief, professional initial assessment of business inquiries to demonstrate value immediately."
        }
      });
      setAnalysis(response.text || "Assessment pending diagnostic audit.");
      setStatus('success');
    } catch (error) {
      console.error(error);
      setAnalysis("Strategic analysis failed. Our team will contact you directly.");
      setStatus('success');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  if (status === 'success') {
    return (
      <div className="card" style={{ maxWidth: '850px', margin: '4rem auto 0', textAlign: 'center', border: '2px solid var(--primary)', animation: 'popIn 0.5s ease forwards' }}>
        <div ref={lottieContainerRef} style={{ width: '200px', height: '200px', margin: '0 auto' }}></div>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{t('inquiry_success')}</h2>
        
        <div style={{ 
          marginTop: '2rem', 
          marginBottom: '3rem', 
          padding: '2rem', 
          background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'var(--gray-100)', 
          textAlign: 'left',
          borderLeft: '4px solid var(--primary)',
          fontSize: '0.9rem',
          lineHeight: 1.8,
          color: isDarkMode ? 'white' : 'var(--dark)'
        }}>
          <h4 style={{ fontSize: '0.7rem', marginBottom: '1rem', color: 'var(--primary)', opacity: 0.8 }}>STRATEGIC INITIAL ASSESSMENT:</h4>
          {analysis}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={copyToClipboard} className="btn btn-outline" style={{ minWidth: '280px' }} aria-label="Copy assessment text to clipboard">
            {copyFeedback ? <Icons.Check /> : <Icons.Copy />} {copyFeedback ? t('inquiry_copy_success') : t('inquiry_copy_btn')}
          </button>
          <button onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', service: '', message: '' }); }} className="btn btn-primary" aria-label="Start a new business inquiry dialogue">
            {t('inquiry_reset')}
          </button>
        </div>
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
            aria-label="Your name or organization contact name"
          />
          <input 
            type="email" 
            className="input-field" 
            placeholder={t('inquiry_email_placeholder')} 
            value={formData.email} 
            onChange={e => setFormData({ ...formData, email: e.target.value })} 
            required
            disabled={status === 'loading'}
            aria-label="Professional email address"
          />
        </div>
        <select 
          className="input-field" 
          style={{ appearance: 'none' }}
          value={formData.service} 
          onChange={e => setFormData({ ...formData, service: e.target.value })}
          disabled={status === 'loading'}
          aria-label="Select the strategic capability you are inquiring about"
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
          aria-label="Detailed operational requirements"
        />
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.5rem' }} disabled={status === 'loading'}>
          {status === 'loading' ? <Icons.Loader /> : t('inquiry_btn')}
        </button>
      </form>
    </div>
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
          systemInstruction: `You are the AISolutions Assistant for 'AISolutions'. You help businesses explore AI transformation and digital solutions. Be friendly, professional, and strategic. Your goal is to guide clients toward high-value digital services. Language: ${language}.`,
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
        aria-label="Open strategic AI assistant chat"
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
      role="dialog"
      aria-label="AI Assistant Conversation Window"
    >
      <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }} aria-label="Close assistant chat"><Icons.X /></button>
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
            aria-label="Assistant message input"
          />
          <button 
            onClick={() => handleSend()}
            style={{ 
              width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#007bff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
            }}
            aria-label="Send message"
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
          <button 
            onClick={() => setActivePage('home')} 
            className="btn btn-outline" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}
            aria-label={t('btn_back')}
          >
            <Icons.ArrowLeft lang={language} /> {t('btn_back')}
          </button>
          <div style={{ marginTop: '2rem' }}>
            <span className="badge">{t('nav_advisory')}</span>
            <h1 style={{ fontSize: '2.5rem' }}>{t('chat_title')}</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{t('chat_desc')}</p>
          </div>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--gray-200)', padding: '2rem', marginBottom: '2rem', background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'var(--white)' }} role="log" aria-live="polite">
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
          <input className="input-field" placeholder={t('chat_placeholder')} value={input} onChange={e => setInput(e.target.value)} disabled={loading} style={{ flex: 1 }} aria-label="Advisor query input" />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }} disabled={loading} aria-label="Submit query"><Icons.Send /></button>
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
        <button 
          onClick={() => setActivePage('home')} 
          className="btn btn-outline" 
          style={{ marginBottom: '4rem', padding: '0.75rem 1.5rem', display: 'flex', gap: '1rem' }}
          aria-label={t('btn_back')}
        >
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} role="radiogroup" aria-label={t('calc_platform')}>
                {PLATFORMS.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => setPlatform(p.id)} 
                    className="card" 
                    style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderColor: platform === p.id ? 'var(--primary)' : 'var(--gray-200)', background: platform === p.id ? 'rgba(0,43,69,0.05)' : 'transparent', cursor: 'pointer' }}
                    aria-checked={platform === p.id}
                    role="radio"
                  >
                    <span>{language === 'en' ? p.label_en : p.label_ar}</span>
                    {platform === p.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>{t('calc_type')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} role="radiogroup" aria-label={t('calc_type')}>
                {COMPLEXITY.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setComplexity(c.id)} 
                    className="card" 
                    style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderColor: complexity === c.id ? 'var(--primary)' : 'var(--gray-200)', background: complexity === c.id ? 'rgba(0,43,69,0.05)' : 'transparent', cursor: 'pointer' }}
                    aria-checked={complexity === c.id}
                    role="radio"
                  >
                    <span>{language === 'en' ? c.label_en : c.label_ar}</span>
                    {complexity === c.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>{t('calc_design')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} role="radiogroup" aria-label={t('calc_design')}>
                {DESIGN.map(d => (
                  <button 
                    key={d.id} 
                    onClick={() => setDesign(d.id)} 
                    className="card" 
                    style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderColor: design === d.id ? 'var(--primary)' : 'var(--gray-200)', background: design === d.id ? 'rgba(0,43,69,0.05)' : 'transparent', cursor: 'pointer' }}
                    aria-checked={design === d.id}
                    role="radio"
                  >
                    <span>{language === 'en' ? d.label_en : d.label_ar}</span>
                    {design === d.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block' }}>{t('calc_features')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} role="group" aria-label={t('calc_features')}>
                {FEATURES.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => {
                      setSelectedFeatures(prev => prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id]);
                    }} 
                    className="card" 
                    style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: selectedFeatures.includes(f.id) ? 'var(--primary)' : 'var(--gray-200)', background: selectedFeatures.includes(f.id) ? 'rgba(0,43,69,0.05)' : 'transparent', cursor: 'pointer', fontSize: '0.8rem' }}
                    aria-pressed={selectedFeatures.includes(f.id)}
                  >
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
            <button onClick={() => setActivePage('advisory')} className="btn btn-outline" style={{ width: '100%', color: 'white', borderColor: 'white' }} aria-label="Connect with AI Advisory to finalize investment roadmap">Connect with Advisory</button>
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
          <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ fontSize: '0.7rem' }} aria-label={t('btn_back')}>
            <Icons.ArrowLeft lang={language} /> {t('btn_back')}
          </button>
          <button onClick={handleDownload} className="btn btn-primary" style={{ fontSize: '0.7rem' }} aria-label="Download Institutional Brief as text file">
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
                  aria-label="Upload document file"
                />
                
                {!selectedFile ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="btn btn-outline"
                    style={{ padding: '1rem 3rem' }}
                    aria-label="Open file picker to select institutional brief"
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
                      aria-label="Submit selected document for transmission"
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
                aria-label="Reset uploader to transmit another document"
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

function NavLink({ onClick, label, tooltip, ariaLabel }: { onClick: () => void; label: string; tooltip: string; ariaLabel: string }) {
  return (
    <div className="tooltip-wrapper">
      <a 
        onClick={onClick} 
        style={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}
        aria-label={ariaLabel}
        role="link"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter') onClick(); }}
      >
        {label}
      </a>
      <span className="nav-tooltip" aria-hidden="true">{tooltip}</span>
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
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: isDarkMode ? 'rgba(0, 26, 42, 0.95)' : 'rgba(252, 252, 252, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--gray-200)', height: '110px', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, cursor: 'pointer', color: 'var(--primary)' }} 
          onClick={() => handleNav('home')}
          aria-label={`${t('brand')} Home Page`}
          role="link"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter') handleNav('home'); }}
        >
          <Icons.Logo size={36} /> <span>{t('brand')}</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} aria-label="Main navigation menu">
          <NavLink onClick={() => handleAnchorNav('capabilities-section')} label={t('nav_services')} tooltip={t('nav_services')} ariaLabel="View Strategic AI Capabilities" />
          <NavLink onClick={() => handleNav('audit')} label={t('nav_audit')} tooltip={t('nav_audit')} ariaLabel="View Strategic Audit Services" />
          <NavLink onClick={() => handleNav('security')} label={t('nav_security')} tooltip={t('nav_security')} ariaLabel="View Strategic Security Services" />
          <NavLink onClick={() => handleNav('about')} label={t('nav_about')} tooltip={t('nav_about')} ariaLabel="View Institutional Profile" />
          <div className="tooltip-wrapper">
            <a 
              onClick={() => handleNav('advisory')} 
              style={{ cursor: 'pointer', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '2px solid' }}
              aria-label="Open AI Strategic Advisory Chat"
              role="link"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') handleNav('advisory'); }}
            >
              {t('nav_advisory')}
            </a>
            <span className="nav-tooltip" aria-hidden="true">{t('nav_advisory')}</span>
          </div>
          <NavLink onClick={() => handleNav('calculator')} label={t('nav_calculator')} tooltip={t('nav_calculator')} ariaLabel="Open Investment Roadmap Estimator" />
          <NavLink onClick={() => handleNav('profile')} label={t('nav_profile')} tooltip={t('nav_profile')} ariaLabel="View Institutional Brief" />
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} 
              className="theme-toggle" 
              style={{ fontSize: '0.6rem' }}
              aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'} language`}
            >
              {language.toUpperCase()}
            </button>
            <button 
              onClick={toggleDarkMode} 
              className="theme-toggle"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} color theme`}
            >
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
          <a 
            onClick={() => handleNav('advisory')} 
            className="btn btn-prominent" 
            style={{ 
              padding: '0.8rem 2.2rem', 
              fontSize: '0.75rem',
              fontWeight: '900'
            }}
            aria-label="Start interactive Strategic AI Advisory session"
          >
            {t('hero_btn_main')}
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const { t, setActivePage, heroImage, isDarkMode } = useTheme();
  const heroStyle: React.CSSProperties = {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: heroImage 
      ? `linear-gradient(rgba(0, 43, 69, ${isDarkMode ? '0.8' : '0.6'}), rgba(0, 43, 69, ${isDarkMode ? '0.9' : '0.7'})), url(${heroImage})` 
      : 'var(--white)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background 1s ease-in-out',
    color: heroImage ? '#fff' : 'var(--dark)'
  };

  return (
    <section className="section" style={heroStyle}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '850px' }}>
          <span className="badge" style={{ 
            background: heroImage ? 'var(--accent)' : 'var(--primary)',
            animation: 'popIn 0.8s ease forwards',
            opacity: 0
          }}>{t('hero_badge')}</span>
          
          <h1 style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 6rem)', 
            lineHeight: 0.95, 
            marginBottom: '1.5rem', 
            fontWeight: 900,
            color: 'inherit',
            animation: 'popIn 0.8s ease forwards 0.15s',
            opacity: 0
          }}>
            {t('hero_title')} <span style={{ color: heroImage ? '#00e5ff' : 'var(--primary)' }}>{t('hero_title_accent')}</span>
          </h1>
          
          <h2 style={{ 
            fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', 
            fontWeight: 600, 
            color: heroImage ? '#00e5ff' : 'var(--accent)', 
            marginBottom: '2.5rem', 
            lineHeight: 1.3,
            textTransform: 'none',
            letterSpacing: '-0.02em',
            animation: 'popIn 0.8s ease forwards 0.3s',
            opacity: 0
          }}>
            {t('hero_subtitle')}
          </h2>

          <p style={{ 
            fontSize: '1.15rem', 
            color: heroImage ? 'rgba(255,255,255,0.9)' : 'var(--gray-500)', 
            marginBottom: '4rem', 
            lineHeight: 1.7, 
            maxWidth: '700px',
            animation: 'popIn 0.8s ease forwards 0.45s',
            opacity: 0
          }}>{t('hero_desc')}</p>
          
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            flexWrap: 'wrap',
            animation: 'popIn 0.8s ease forwards 0.6s',
            opacity: 0
          }}>
            <button onClick={() => setActivePage('advisory')} className="btn btn-prominent" style={{ padding: '1.5rem 3rem' }} aria-label="Start AI Strategic Advisory Dialogue">
              {t('hero_btn_main')}
            </button>
            <button 
              onClick={() => setActivePage('profile')} 
              className="btn btn-outline" 
              style={{ 
                padding: '1.5rem 3rem', 
                color: heroImage ? '#fff' : 'var(--primary)', 
                borderColor: heroImage ? '#fff' : 'var(--primary)' 
              }} 
              aria-label="View Institutional Brief Architecture"
            >
              {t('hero_btn_sec')}
            </button>
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
    <section style={{ background: 'var(--primary)', color: 'white', padding: '6rem 0' }} aria-label="Institutional Impact Metrics">
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

// --- Data for Core Services ---
const CORE_SERVICES = [
  { 
    id: 1, 
    icon: <Icons.Cpu />, 
    title: "Neural Architecture", 
    desc: "Developing custom deep learning models and proprietary neural engines for enterprise-scale predictive intelligence." 
  },
  { 
    id: 2, 
    icon: <Icons.Network />, 
    title: "Institutional Integration", 
    desc: "Seamlessly bridging the gap between legacy infrastructures and modern machine learning frameworks." 
  },
  { 
    id: 3, 
    icon: <Icons.Shield />, 
    title: "Strategic Security", 
    desc: "Securing organizational data against next-generation adversarial attacks with zero-trust neural safeguards." 
  },
  { 
    id: 4, 
    icon: <Icons.Activity />, 
    title: "Operational Efficiency", 
    desc: "Optimizing institutional workflows through automated decision support and high-fidelity diagnostic audits." 
  }
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');
  const [activePage, setActivePage] = useState<PageView>('home');
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', language);
  }, [language]);

  // Dynamic Image Generation for Hero
  useEffect(() => {
    const generateHeroVisual = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: 'A high-fidelity, abstract, cinematic background for an elite AI service provider website. Theme: intelligent systems, digital neural pathways, and business empowerment. Minimalist geometric precision with a sophisticated color palette of midnight navy (#002b45), charcoal, and vibrant royal blue (#0062ff) accents. Soft depth-of-field, sleek lines, institutional professional aesthetic, 4k resolution, no text.',
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
            },
          },
        });
        
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setHeroImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } catch (error) {
        console.error("AI Hero Image Generation Failed:", error);
      }
    };

    generateHeroVisual();
  }, []);

  const t = (key: string) => translations[language][key] || key;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode: () => setIsDarkMode(!isDarkMode), language, setLanguage, activePage, setActivePage, t, heroImage }}>
      <Header />
      <main>
        {activePage === 'home' ? (
          <>
            <Hero />
            <Metrics />
            <AboutUsSection id="institutional-summary" />
            <section className="section" id="capabilities-section" aria-label="Core Strategic Services">
              <div className="container">
                <div className="text-center" style={{ marginBottom: '8rem' }}>
                  <h2 style={{ fontSize: '3.5rem' }}>Core Strategic Services</h2>
                </div>
                <div className="grid grid-4">
                  {CORE_SERVICES.map(service => (
                    <div key={service.id} className="card" style={{ borderTop: '10px solid var(--primary)', textAlign: 'center' }}>
                      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        {service.icon}
                      </div>
                      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>{service.title}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>{service.desc}</p>
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
        ) : activePage === 'audit' ? (
          <AuditView />
        ) : activePage === 'security' ? (
          <SecurityView />
        ) : (
          <div className="section"><div className="container"><h1>Under Construction</h1></div></div>
        )}
      </main>
      <FloatingChat />
      <footer style={{ background: 'var(--secondary)', color: 'white', padding: '10rem 0 5rem' }} aria-label="Institutional Footer">
        <div className="container">
          <div className="grid grid-4" style={{ marginBottom: '6rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}><Icons.Logo /> {t('brand')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', fontSize: '0.95rem' }}>{t('footer_desc')}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '2.5rem' }}>PORTFOLIO</h4>
              <nav className="footer-links" aria-label="Footer portfolio navigation">
                <a onClick={() => setActivePage('audit')} aria-label="Navigate to Strategic Audit services page">Strategic Audit</a>
                <a onClick={() => setActivePage('security')} aria-label="Navigate to Strategic Security services page">Strategic Security</a>
                <a onClick={() => setActivePage('about')} aria-label="Navigate to Institutional Profile page">Institutional Profile</a>
                <a onClick={() => setActivePage('advisory')} aria-label="Start interactive AI Advisory dialogue">AI Advisory</a>
                <a onClick={() => setActivePage('calculator')} aria-label="Use the Pricing Estimator tool">Pricing Estimator</a>
                <a onClick={() => setActivePage('profile')} aria-label="View the Institutional Brief document portal">Institutional Brief</a>
              </nav>
            </div>
            <div>
              <h4 style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '2.5rem' }}>COMPLIANCE</h4>
              <nav className="footer-links" aria-label="Footer compliance navigation">
                <a href="#" aria-label="View our Security Protocol documentation">Security Protocol</a>
                <a href="#" aria-label="View our Privacy Framework documentation">Privacy Framework</a>
                <a href="#" aria-label="View our Terms of Engagement">Terms of Engagement</a>
              </nav>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>&copy; 2024 {t('brand')}. {t('footer_copy')}</div>
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