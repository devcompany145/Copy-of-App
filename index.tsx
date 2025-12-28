import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import lottie from 'lottie-web';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
type Language = 'en' | 'ar';
type PageView = 'home' | 'about' | 'audit' | 'security' | 'scalability' | 'compliance' | 'privacy' | 'terms' | 'profile' | 'calculator';

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
    nav_calculator: "Calculator",
    btn_consultation: "Inquiry",
    btn_download_brief: "Download Institutional Brief",
    hero_badge: "Institutional Intelligence",
    hero_title: "Systemic Engineering for",
    hero_title_accent: "Global Scale",
    hero_desc: "Exclusive strategic development through sovereign engineering. We deploy proprietary AI frameworks to automate critical business operations and reclaim operational excellence.",
    hero_btn_main: "Initiate Dialogue",
    hero_btn_sec: "The Architecture",
    calc_title: "Development Estimator",
    calc_desc: "Simulate institutional development costs based on project parameters.",
    calc_platform: "Platform Architecture",
    calc_type: "Operational Complexity",
    calc_design: "Design Fidelity",
    calc_features: "Integrated Capabilities",
    calc_total: "Estimated Strategic Investment",
    calc_disclaimer: "These figures represent institutional benchmarks and are subject to official diagnostic audit.",
    metrics_title: "Institutional Impact",
    metrics_1_val: "85%",
    metrics_1_label: "Success Rate",
    metrics_2_val: "75%",
    metrics_2_label: "Faster Market Access",
    metrics_3_val: "60%",
    metrics_3_label: "Cost Efficiency",
    metrics_4_val: "0",
    metrics_4_label: "Security Breaches",
    methodology_title: "The Sovereign Protocol",
    methodology_desc: "Our 4-stage systematic deployment architecture.",
    method_1_title: "I. Diagnostic Audit",
    method_1_desc: "Mapping institutional data structures and identifying friction points.",
    method_2_title: "II. Neural Architecture",
    method_2_desc: "Bespoke engineering of private models and secure pipelines.",
    method_3_title: "III. Seamless Integration",
    method_3_desc: "Non-disruptive deployment into high-load operational environments.",
    method_4_title: "IV. Total Autonomy",
    method_4_desc: "Continuous self-optimization and institutional scaling.",
    profile_badge: "Company Profile 2024",
    profile_vision: "Vision: To be the global leader in driving digital innovation and comprehensive transformation in the Arab world using the latest AI solutions.",
    profile_mission: "Mission: Empowering innovators and business leaders to transform ideas into tangible reality by providing an integrated platform with the latest AI technologies, committed to accelerating digital transformation and supporting Saudi Vision 2030.",
    profile_goals_title: "Strategic Objectives",
    profile_goal_1: "Lead digital transformation in the Kingdom and the region.",
    profile_goal_2: "Support 10,000 innovators and entrepreneurs by 2030.",
    profile_goal_3: "Develop over 100 high-tech AI solutions.",
    profile_projects_title: "Flagship Projects",
    project_1_name: "7Roads",
    project_1_desc: "A Saudi-registered product specializing in analyzing and improving driving behavior using AI to enhance road safety.",
    project_2_name: "The Medal",
    project_2_desc: "A digital key to facilitate and improve vehicle maintenance operations, connecting owners with certified service centers.",
    project_3_name: "AI for Health",
    project_3_desc: "An advanced platform using AI to support mental and physical health with high-standard privacy.",
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
    about_content: "Established as a beacon of high-fidelity engineering, Business Developers represents the intersection of capital strategy and machine intelligence. We operate on a global scale, providing the architectural foundation for the next century of enterprise operations.",
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
    form_name: "Full Name",
    form_email: "Corporate Email",
    form_desc_placeholder: "Describe your institutional objectives...",
    success_title: "Confirmed",
    success_msg: "Brief received. Awaiting architectural review.",
    success_btn: "New Dialogue",
    testimonials_title: "Institutional Feedback",
    test_1_quote: "The strategic deployment of AI within our logistics framework provided an unprecedented 40% gain in throughput.",
    test_1_author: "Chief of Strategy, Global Logistics Corp",
    test_2_quote: "Their sovereign neural architecture allowed us to maintain total data privacy while automating 80% of routine operations.",
    test_2_author: "VP Engineering, Secure Finance Group",
    audit_title: "Diagnostic Audit",
    audit_desc: "Mapping institutional data structures.",
    audit_content: "Our systematic audit identifies bottlenecks in your current data flows and designs the neural bridge to your future autonomous state.",
    security_title: "Sovereign Security",
    security_desc: "Hardened intelligence protocols.",
    security_content: "We engineer private models that reside exclusively within your controlled perimeter, ensuring total strategic sovereignty.",
    scalability_title: "Industrial Scaling",
    scalability_desc: "Ready for global throughput.",
    scalability_content: "Our architectures are built for high-concurrency environments, capable of scaling across multiple global regions without friction.",
    compliance_title: "Regulatory Compliance",
    compliance_desc: "Navigating international standards.",
    compliance_content: "We ensure all AI deployments adhere to sovereign laws and international data governance standards, mitigating risk at scale.",
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
    btn_consultation: "استفسار",
    btn_download_brief: "تحميل الملف التعريفي",
    hero_badge: "ذكاء مؤسسي",
    hero_title: "هندسة منهجية لـ",
    hero_title_accent: "نطاق عالمي",
    hero_desc: "تطوير استراتيجي حصري من خلال الهندسة السيادية. نقوم بنشر أطر ذكاء اصطناعي خاصة لأتمتة العمليات التجارية الحيوية واستعادة التميز التشغيلي.",
    hero_btn_main: "بدء الحوار",
    hero_btn_sec: "المعمارية",
    calc_title: "مقدر التطوير",
    calc_desc: "محاكاة تكاليف التطوير المؤسسي بناءً على معايير المشروع.",
    calc_platform: "معمارية المنصة",
    calc_type: "التعقيد التشغيلي",
    calc_design: "دقة التصميم",
    calc_features: "القدرات المتكاملة",
    calc_total: "الاستثمار الاستراتيجي المتوقع",
    calc_disclaimer: "هذه الأرقام تمثل معايير مؤسسية وتخضع لتدقيق تشخيصي رسمي.",
    metrics_title: "الأثر المؤسسي",
    metrics_1_val: "85%",
    metrics_1_label: "نسبة نجاح المشاريع",
    metrics_2_val: "75%",
    metrics_2_label: "سرعة الوصول للسوق",
    metrics_3_val: "60%",
    metrics_3_label: "توفير التكاليف",
    metrics_4_val: "0",
    metrics_4_label: "خروقات أمنية",
    methodology_title: "البروتوكول السيادي",
    methodology_desc: "معمارية النشر المنهجية المكونة من 4 مراحل.",
    method_1_title: "١. تدقيق تشخيصي",
    method_1_desc: "رسم خرائط هياكل البيانات المؤسسية وتحديد نقاط الاحتكاك.",
    method_2_title: "٢. معمارية عصبية",
    method_2_desc: "هندسة مخصصة للنماذج الخاصة وخطوط الأنابيب الآمنة.",
    method_3_title: "٣. تكامل سلس",
    method_3_desc: "نشر غير معطل في بيئات التشغيل ذات الأحمال العالية.",
    method_4_title: "٤. استقلالية كاملة",
    method_4_desc: "تحسين ذاتي مستمر وتوسيع النطاق المؤسسي.",
    profile_badge: "الملف التعريفي للشركة ٢٠٢٤",
    profile_vision: "الرؤية: أن نصبح المنصة العالمية الرائدة في قيادة الابتكار الرقمي والتحول الشامل في العالم العربي، بالاعتماد على أحدث حلول الذكاء الاصطناعي.",
    profile_mission: "الرسالة: مساعدة المبتكرين ورواد الأعمال على تحويل أفكارهم إلى واقع ملموس، من خلال توفير منصة متكاملة بأحدث تقنيات الذكاء الاصطناعي، والالتزام بتسريع التحول الرقمي ودعم رؤية المملكة ٢٠٣٠.",
    profile_goals_title: "الأهداف الاستراتيجية",
    profile_goal_1: "قيادة التحول الرقمي الفعال في المملكة والمنطقة.",
    profile_goal_2: "دعم ١٠,٠٠٠ مبتكر ورائد أعمال بحلول عام ٢٠٣٠.",
    profile_goal_3: "تطوير أكثر من ١٠٠ حل تقني جديد في الذكاء الاصطناعي.",
    profile_projects_title: "مشاريعنا الرائدة",
    project_1_name: "7Roads",
    project_1_desc: "منتج سعودي مسجل كعلامة تجارية متخصص في تحليل وتحسين سلوكيات القيادة باستخدام الذكاء الاصطناعي لرفع مستوى السلامة.",
    project_2_name: "The Medal",
    project_2_desc: "المفتاح الرقمي لتسهيل وتحسين عمليات صيانة المركبات، يربط أصحاب المركبات بمراكز الخدمة المعتمدة.",
    project_3_name: "الذكاء للصحة",
    project_3_desc: "منصة متطورة تستخدم الذكاء الاصطناعي لدعم الصحة العقلية والنفسية مع الحفاظ على أعلى معايير الخصوصية.",
    services_title: "الخبرات الجوهرية",
    services_desc: "نهج منهجي للذكاء اصطناعي لأكثر المنظمات العالمية طموحاً.",
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
    about_content: "تأسست بيزنس ديفلوبرز كمنارة للهندسة عالية الدقة، وهي تمثل نقطة التقاء استراتيجية رأس المال وذكاء الآلة. نحن نعمل على نطاق عالمي، ونوفر الأساس المعماري للقرن القادم من العمليات المؤسسية.",
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
    form_name: "الاسم الكامل",
    form_email: "البريد الرسمي",
    form_desc_placeholder: "لخص أهدافك المؤسسية...",
    success_title: "تم التأكيد",
    success_msg: "تم استلام الموجز. في انتظار المراجعة المعمارية.",
    success_btn: "حوار جديد",
    testimonials_title: "تقييمات مؤسسية",
    test_1_quote: "أدى النشر الاستراتيجي للذكاء الاصطناعي داخل إطار عملنا اللوجستي إلى زيادة غير مسبوقة في الإنتاجية بنسبة ٤٠٪.",
    test_1_author: "رئيس الاستراتيجية، شركة لوجستيات عالمية",
    test_2_quote: "سمحت لنا معماريتهم العصبية السيادية بالحفاظ على خصوصية البيانات الكاملة مع أتمتة ٨٠٪ من العمليات الروتينية.",
    test_2_author: "نائب الرئيس للهندسة، مجموعة التمويل الآمن",
    audit_title: "تدقيق تشخيصي",
    audit_desc: "رسم خرائط هياكل البيانات المؤسسية.",
    audit_content: "يحدد تدقيقنا المنهجي الاختناقات في تدفقات بياناتك الحالية ويصمم الجسر العصبي لحالتك الذاتية المستقبلية.",
    security_title: "أمن سيادي",
    security_desc: "بروتوكولات استخبارات معززة.",
    security_content: "نحن نهندس نماذج خاصة تقع حصرياً داخل محيطك الخاضع للسيطرة، مما يضمن سيادة استراتيجية كاملة.",
    scalability_title: "توسع صناعي",
    scalability_desc: "جاهز للإنتاجية العالمية.",
    scalability_content: "تم بناء معماريتنا لبيئات التزامن العالي، وهي قادرة على التوسع عبر مناطق عالمية متعددة دون احتكاك.",
    compliance_title: "الامتثال التنظيمي",
    compliance_desc: "التنقل في المعايير الدولية.",
    compliance_content: "نحن نضمن التزام جميع عمليات نشر الذكاء الاصطناعي بالقوانين السيادية ومعايير حوكمة البيانات الدولية، مما يقلل المخاطر على نطاق واسع.",
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
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  ArrowLeft: ({ lang }: { lang: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Calculator: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
  ),
  MethodStep: ({ num }: { num: number }) => (
    <div style={{ width: '40px', height: '40px', border: '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>
      {num}
    </div>
  ),
  Loader: () => (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  ),
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
};

// --- Price Calculator Logic ---
const PLATFORMS = [
  { id: 'ios', label_en: 'iOS Architecture', label_ar: 'معمارية iOS', price: 15000 },
  { id: 'android', label_en: 'Android Architecture', label_ar: 'معمارية Android', price: 15000 },
  { id: 'both', label_en: 'Cross-Platform (Unified)', label_ar: 'هجين (موحد)', price: 28000 }
];

const COMPLEXITY = [
  { id: 'mvp', label_en: 'Institutional MVP', label_ar: 'الحد الأدنى للمنتج (MVP)', multiplier: 1.0 },
  { id: 'standard', label_en: 'Operational Standard', label_ar: 'المعيار التشغيلي', multiplier: 1.8 },
  { id: 'complex', label_en: 'Sovereign Enterprise', label_ar: 'المؤسسة السيادية', multiplier: 3.5 }
];

const DESIGN = [
  { id: 'basic', label_en: 'Systemic (Standard)', label_ar: 'منهجي (قياسي)', price: 5000 },
  { id: 'premium', label_en: 'Institutional (High-Fidelity)', label_ar: 'مؤسسي (عالي الدقة)', price: 12000 },
  { id: 'custom', label_en: 'Bespoke Architectural', label_ar: 'هندسي مخصص', price: 25000 }
];

const FEATURES = [
  { id: 'auth', label_en: 'Sovereign Auth & Access', label_ar: 'المصادقة السيادية', price: 3000 },
  { id: 'payment', label_en: 'Financial Integration', label_ar: 'التكامل المالي', price: 5000 },
  { id: 'ai', label_en: 'Neural Engine Node', label_ar: 'عقدة المحرك العصبي', price: 15000 },
  { id: 'realtime', label_en: 'Sync Transmission', label_ar: 'الإرسال المتزامن', price: 8000 },
  { id: 'admin', label_en: 'Command & Control Panel', label_ar: 'لوحة التحكم والقيادة', price: 7000 }
];

// --- Calculator Component ---

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

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <section className="section" style={{ background: isDarkMode ? 'var(--secondary)' : 'var(--white)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <button onClick={() => setActivePage('home')} className="btn btn-outline" style={{ marginBottom: '4rem', padding: '0.75rem 1.5rem', display: 'flex', gap: '1rem', border: '1px solid var(--gray-200)' }}>
          <Icons.ArrowLeft lang={language} /> {t('btn_back')}
        </button>

        <div className="text-center" style={{ marginBottom: '6rem' }}>
          <span className="badge">{t('nav_calculator')}</span>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 1, marginBottom: '2.5rem' }}>{t('calc_title')}</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.25rem' }}>{t('calc_desc')}</p>
        </div>

        <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Platforms */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem', display: 'block' }}>{t('calc_platform')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {PLATFORMS.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => setPlatform(p.id)}
                    className="card" 
                    style={{ 
                      padding: '1.5rem 2rem', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      borderColor: platform === p.id ? 'var(--primary)' : 'var(--gray-200)',
                      background: platform === p.id ? (isDarkMode ? 'rgba(0,43,69,0.5)' : 'rgba(0,43,69,0.05)') : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{language === 'en' ? p.label_en : p.label_ar}</span>
                    {platform === p.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem', display: 'block' }}>{t('calc_type')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {COMPLEXITY.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setComplexity(c.id)}
                    className="card" 
                    style={{ 
                      padding: '1.5rem 2rem', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      borderColor: complexity === c.id ? 'var(--primary)' : 'var(--gray-200)',
                      background: complexity === c.id ? (isDarkMode ? 'rgba(0,43,69,0.5)' : 'rgba(0,43,69,0.05)') : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{language === 'en' ? c.label_en : c.label_ar}</span>
                    {complexity === c.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>

            {/* Design */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem', display: 'block' }}>{t('calc_design')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {DESIGN.map(d => (
                  <button 
                    key={d.id} 
                    onClick={() => setDesign(d.id)}
                    className="card" 
                    style={{ 
                      padding: '1.5rem 2rem', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      borderColor: design === d.id ? 'var(--primary)' : 'var(--gray-200)',
                      background: design === d.id ? (isDarkMode ? 'rgba(0,43,69,0.5)' : 'rgba(0,43,69,0.05)') : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{language === 'en' ? d.label_en : d.label_ar}</span>
                    {design === d.id && <Icons.Check />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'sticky', top: '150px' }}>
            {/* Features */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem', display: 'block' }}>{t('calc_features')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {FEATURES.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => toggleFeature(f.id)}
                    className="card" 
                    style={{ 
                      padding: '1.25rem', 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '1rem',
                      borderColor: selectedFeatures.includes(f.id) ? 'var(--primary)' : 'var(--gray-200)',
                      background: selectedFeatures.includes(f.id) ? (isDarkMode ? 'rgba(0,43,69,0.3)' : 'rgba(0,43,69,0.03)') : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ width: '20px', height: '20px', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedFeatures.includes(f.id) && <Icons.Check />}
                    </div>
                    <span>{language === 'en' ? f.label_en : f.label_ar}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Display */}
            <div className="card" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '4rem 3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', opacity: 0.6, marginBottom: '2rem' }}>{t('calc_total')}</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>
                ${calculatePrice().toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>USD</span>
              </div>
              <p style={{ fontSize: '0.75rem', opacity: 0.6, fontStyle: 'italic', lineHeight: 1.6 }}>{t('calc_disclaimer')}</p>
              <button 
                onClick={() => { setActivePage('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                className="btn btn-outline" 
                style={{ width: '100%', marginTop: '3rem', color: 'white', borderColor: 'white' }}
              >
                {t('btn_consultation')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Header Component Updates ---

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

        <nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '2.5rem', alignItems: 'center' }}>
          <a onClick={() => handleNav('home', 'services')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_services')}</a>
          <a onClick={() => handleNav('home', 'packages')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_packages')}</a>
          <a onClick={() => handleNav('calculator')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_calculator')}</a>
          <a onClick={() => handleNav('profile')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_profile')}</a>
          <a onClick={() => handleNav('about')} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--dark)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('nav_about')}</a>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="theme-toggle" style={{ fontSize: '0.6rem', fontWeight: 900 }}>
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={toggleDarkMode} className="theme-toggle">
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
          
          <a onClick={() => handleNav('home', 'contact')} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.65rem' }}>{t('btn_consultation')}</a>
        </nav>
      </div>
    </header>
  );
}

// --- Rest of the Existing Components ---

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

Strategic Goals:
- ${t('profile_goal_1')}
- ${t('profile_goal_2')}
- ${t('profile_goal_3')}

Flagship Projects:
1. ${t('project_1_name')}: ${t('project_1_desc')}
2. ${t('project_2_name')}: ${t('project_2_desc')}
3. ${t('project_3_name')}: ${t('project_3_desc')}

Impact Metrics:
- Project Success Rate: 85%
- Cost Efficiency: 60% reduction
- Acceleration: 75% faster market access
    `.trim();

    const blob = new Blob([briefContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Business_Developers_Profile_${language.toUpperCase()}.txt`;
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

        <div className="grid grid-2" style={{ gap: '4rem', marginBottom: '8rem' }}>
          <div className="card" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'white' }}>{t('profile_goals_title')}</h2>
            <ul style={{ listStyle: 'none' }}>
              {[1, 2, 3].map(i => (
                <li key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'white', marginTop: '4px' }}><Icons.Check /></div>
                  <span style={{ fontSize: '1.1rem', opacity: 0.9 }}>{t(`profile_goal_${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ border: '1px solid var(--gray-200)' }}>
             <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Corporate Mission</h2>
             <p style={{ fontSize: '1.2rem', color: 'var(--gray-500)', lineHeight: 1.7 }}>{t('profile_mission')}</p>
          </div>
        </div>

        <h2 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '5rem' }}>{t('profile_projects_title')}</h2>
        <div className="grid grid-3" style={{ gap: '2rem', marginBottom: '10rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{ borderTop: '8px solid var(--primary)', padding: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t(`project_${i}_name`)}</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '1rem', lineHeight: 1.7 }}>{t(`project_${i}_desc`)}</p>
            </div>
          ))}
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

function StaticPage({ view }: { view: PageView }) {
  const { t, setActivePage, language } = useTheme();
  
  const contentMap: Record<PageView, { title: string, desc: string, content: string }> = {
    home: { title: '', desc: '', content: '' },
    profile: { title: '', desc: '', content: '' },
    calculator: { title: '', desc: '', content: '' },
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
    <section className="section" style={{ padding: '14rem 0', background: isDarkMode ? '#001a2a' : '#fcfcfc', overflow: 'hidden', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="badge">{t('hero_badge')}</span>
            <h1 style={{ fontSize: 'clamp(4.5rem, 10vw, 8rem)', marginBottom: '3.5rem', fontWeight: 900, lineHeight: 0.9, color: 'var(--dark)', letterSpacing: '-0.05em' }}>
              {t('hero_title')} <br/>
              <span style={{ borderBottom: '10px solid var(--primary)' }}>{t('hero_title_accent')}</span>
            </h1>
            <p style={{ fontSize: '1.6rem', color: 'var(--gray-500)', maxWidth: '700px', margin: '0 0 6rem', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.6 }}>
              {t('hero_desc')}
            </p>
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary" style={{ minWidth: '280px', height: '75px', fontSize: '1rem' }}>
                {t('hero_btn_main')}
              </button>
              <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-outline" style={{ minWidth: '280px', height: '75px', fontSize: '1rem' }}>
                {t('hero_btn_sec')}
              </button>
            </div>
          </div>
          <div ref={container} style={{ width: '100%', maxWidth: '700px', opacity: 0.95, filter: 'contrast(1.1) brightness(0.9)' }} />
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const { t } = useTheme();
  const metrics = [
    { val: t('metrics_1_val'), label: t('metrics_1_label') },
    { val: "4.2PB", label: "Data Throughput" },
    { val: t('metrics_3_val'), label: t('metrics_3_label') },
    { val: t('metrics_4_val'), label: t('metrics_4_label') }
  ];
  return (
    <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6rem 0' }}>
      <div className="container">
        <div className="grid grid-4" style={{ gap: '2rem' }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>{m.val}</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7 }}>{m.label}</div>
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
            <div key={i} className="card" style={{ padding: '3rem', border: '1px solid var(--gray-200)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '2rem' }}><Icons.MethodStep num={i} /></div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t(`method_${i}_title`)}</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.7 }}>{t(`method_${i}_desc`)}</p>
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
    <section className="section bg-light" style={{ borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '8rem' }}>
          <h2 style={{ fontSize: '1rem', letterSpacing: '0.3em', color: 'var(--gray-500)', textTransform: 'uppercase' }}>{t('testimonials_title')}</h2>
        </div>
        <div className="grid grid-2" style={{ gap: '6rem' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '3rem' }}>
              <p style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--dark)', marginBottom: '3rem', lineHeight: 1.3, fontStyle: 'italic' }}>
                "{t(`test_${i}_quote`)}"
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t(`test_${i}_author`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useTheme();
  const [formState, setFormState] = useState({ name: '', email: '', description: '' });
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
    <section id="contact" className="section" style={{ borderTop: '1px solid var(--gray-200)' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="text-center" style={{ marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem', color: 'var(--dark)' }}>{t('contact_title')}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.35rem' }}>{t('contact_desc')}</p>
        </div>
        
        {submitted ? (
          <div className="card text-center success-card" style={{ padding: '8rem 4rem', animation: 'popIn 0.5s ease', border: '2px solid var(--primary)' }}>
            <h3 style={{ fontSize: '4rem', marginBottom: '2.5rem' }}>{t('success_title')}</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.45rem', marginBottom: '5rem', maxWidth: '700px', margin: '0 auto 5rem', lineHeight: 1.7 }}>{t('success_msg')}</p>
            <button className="btn btn-primary" onClick={() => setSubmitted(false)}>{t('success_btn')}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ border: '2px solid var(--gray-200)', padding: '6rem' }}>
            <div className="grid grid-2" style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('form_name')}</label>
                <input required className="input-field" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('form_email')}</label>
                <input required className="input-field" type="email" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('contact_title')}</label>
              <textarea required className="input-field" rows={7} placeholder={t('form_desc_placeholder')} value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '85px', marginTop: '4rem', fontSize: '1.1rem' }} disabled={isSubmitting}>
              {isSubmitting ? <><Icons.Loader /> <span style={{ marginLeft: '1rem' }}>{loadingStatus}</span></> : t('form_btn')}
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
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '450px', fontSize: '1rem', lineHeight: '2' }}>{t('footer_desc')}</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2.5rem', opacity: 0.6 }}>{t('footer_company')}</h4>
            <div className="footer-links">
              <a onClick={() => handlePage('profile')}>{t('nav_profile')}</a>
              <a onClick={() => handlePage('calculator')}>{t('nav_calculator')}</a>
              <a onClick={() => handlePage('about')}>{t('nav_about')}</a>
              <a onClick={() => handlePage('audit')}>Feasibility Audit</a>
              <a onClick={() => handlePage('security')}>Sovereign Security</a>
              <a onClick={() => handlePage('scalability')}>Industrial Scale</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2.5rem', opacity: 0.6 }}>{t('footer_legal')}</h4>
            <div className="footer-links">
              <a onClick={() => handlePage('compliance')}>{t('compliance_title')}</a>
              <a onClick={() => handlePage('privacy')}>Privacy Protocol</a>
              <a onClick={() => handlePage('terms')}>Terms of Engagement</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '5rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', letterSpacing: '0.25em' }}>
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
            <Metrics />
            <Methodology />
            <section id="services" className="section bg-light" style={{ borderTop: '1px solid var(--gray-200)' }}>
              <div className="container">
                <div className="text-center" style={{ marginBottom: '8rem' }}>
                  <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem' }}>{t('services_title')}</h2>
                  <p style={{ color: 'var(--gray-500)', fontSize: '1.35rem', maxWidth: '800px', margin: '0 auto' }}>{t('services_desc')}</p>
                </div>
                <div className="grid grid-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card" style={{ borderTop: '10px solid var(--primary)', padding: '4rem 3rem' }}>
                      <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem', fontWeight: 800 }}>{t(`service_${i}_title`)}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '1rem', lineHeight: 1.8 }}>{t(`service_${i}_desc`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <Testimonials />
            <section id="packages" className="section">
              <div className="container">
                <div className="text-center" style={{ marginBottom: '8rem' }}>
                  <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem' }}>{t('packages_title')}</h2>
                </div>
                <div className="grid grid-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="card" style={{ 
                      padding: '5rem 4rem',
                      transform: i === 2 ? 'scale(1.08)' : 'none', 
                      border: i === 2 ? '3px solid var(--primary)' : '1px solid var(--gray-200)',
                      boxShadow: i === 2 ? 'var(--shadow-xl)' : 'none',
                      zIndex: i === 2 ? 10 : 1
                    }}>
                      <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>{t(`pkg_${i}_name`)}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '5rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t(`pkg_${i}_target`)}</p>
                      <button className={`btn ${i === 2 ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', height: '70px' }}>{t('pkg_btn')}</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <Contact />
          </>
        ) : activePage === 'profile' ? (
          <CompanyProfileView />
        ) : activePage === 'calculator' ? (
          <PriceCalculatorView />
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
