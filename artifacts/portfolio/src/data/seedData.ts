import type {
  FirestoreProject,
  FirestoreSkill,
  FirestoreTimeline,
  FirestoreService,
  FirestoreSocial,
} from "@/lib/firestoreTypes";

/* ─────────────────────────────────────────────────────────────
   PROJECTS  (mirrors projectsData + firestoreTypes shape)
   Missing fields (thumbnail, liveLink, repoLink, detailSections)
   are intentionally blank — admin can fill them in later.
───────────────────────────────────────────────────────────── */
export const seedProjects: Omit<FirestoreProject, "id">[] = [
  {
    slug: "the-subspot",
    title: "The Subspot",
    subtitle: "Digital Subscription Management System",
    year: "2025",
    role: "Lead Developer & Product Owner",
    accent: "indigo",
    status: "Live",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
    heroDescription:
      "A fully operational subscription management platform scaling to 2000+ active users. Handles digital product delivery, user management, and automated subscription renewals.",
    problem:
      "Managing digital subscriptions manually was a nightmare — tracking renewals, delivering products, handling payments, and managing user access across multiple platforms created bottlenecks that cost hours of daily effort. Existing solutions were either too expensive or too generic to fit the specific workflow needed for digital product delivery at scale.",
    solution:
      "The Management System is built with a modern MERN stack (MongoDB, Express, React, Node.js) and powered by n8n for 24/7 automation. It integrates seamlessly with our WordPress & WooCommerce storefront to handle digital product delivery automatically.",
    techStack: ["React", "Node.js", "MongoDB", "Express", "n8n", "REST API", "Tailwind CSS"],
    features: [
      { title: "Automated Renewal Tracking", description: "Smart renewal system that tracks expiry dates and auto-renews subscriptions with payment processing." },
      { title: "Digital Product Delivery", description: "Instant automated delivery of digital products upon purchase confirmation via webhook triggers." },
      { title: "User Management Dashboard", description: "Comprehensive admin panel for managing subscribers, tracking engagement, and handling support tickets." },
      { title: "Payment Integration", description: "Seamless payment gateway integration supporting multiple providers with automatic invoice generation." },
      { title: "Analytics & Reporting", description: "Real-time dashboards showing subscriber growth, churn rates, revenue metrics, and product performance." },
      { title: "Multi-tier Access Control", description: "Role-based permission system supporting different subscription tiers with varying access levels." },
    ],
    stats: [
      { value: "2,800+", label: "Active Users" },
      { value: "99.9%", label: "Automation Success" },
      { value: "50+", label: "Digital Products" },
      { value: "0", label: "Manual Interventions/Day" },
    ],
    tags: ["Web App", "Automation", "2000+ Users"],
    detailSections: [],
    order: 0,
    createdAt: Date.now(),
  },
  {
    slug: "jibon",
    title: "Jibon",
    subtitle: "Blood Donation Platform",
    year: "2024",
    role: "Full Stack Developer",
    accent: "red",
    status: "Active",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
    heroDescription:
      "A life-saving platform connecting blood donors with patients in need. Features donor matching, real-time availability tracking, and hospital integration.",
    problem:
      "In emergency situations, finding compatible blood donors quickly can mean the difference between life and death. Traditional methods — phone calls, social media posts, and manual coordination — are slow, unreliable, and often fail when time is critical. There was no centralized system to match donors with patients based on blood type, location, and availability.",
    solution:
      "Developed a real-time blood donation platform that instantly connects patients with compatible donors in their area. The system uses intelligent matching algorithms considering blood type compatibility, geographic proximity, and donor availability. Hospital staff can create urgent requests that immediately notify eligible donors via push notifications.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "REST API", "Geolocation API"],
    features: [
      { title: "Smart Donor Matching", description: "Intelligent algorithm matching patients with compatible donors based on blood type, location, and availability status." },
      { title: "Real-time Availability", description: "Live tracking of donor availability with cooldown period management after each donation." },
      { title: "Emergency Request System", description: "Priority notification system for urgent blood needs that alerts all compatible donors instantly." },
      { title: "Hospital Integration", description: "Direct integration with hospital systems for seamless request creation and fulfillment tracking." },
      { title: "Donor Profile Management", description: "Complete donor profiles with donation history, health records, and eligibility tracking." },
      { title: "Location-based Search", description: "Geolocation-powered search to find nearest available donors within customizable radius." },
    ],
    stats: [
      { value: "500+", label: "Registered Donors" },
      { value: "150+", label: "Lives Impacted" },
      { value: "<30min", label: "Avg Match Time" },
      { value: "8", label: "Blood Types Supported" },
    ],
    tags: ["Web App", "Healthcare", "React"],
    detailSections: [],
    order: 1,
    createdAt: Date.now(),
  },
  {
    slug: "hospital-report-maker",
    title: "Hospital Report Maker",
    subtitle: "Multi-user Medical System",
    year: "2024",
    role: "Lead Developer",
    accent: "sky",
    status: "Deployed",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
    heroDescription:
      "A comprehensive medical report generation system supporting multiple users simultaneously. Streamlines documentation for healthcare professionals with automated formatting.",
    problem:
      "Healthcare professionals spend countless hours manually formatting medical reports, often re-typing the same templates and struggling with inconsistent document structures. In multi-doctor practices, there's no standardized way to generate, review, and share patient reports — leading to errors, delays, and frustrated staff.",
    solution:
      "Created a multi-user medical report generation platform with pre-built templates, automated formatting, and real-time collaboration. Doctors can generate professional reports in minutes instead of hours, with built-in validation to ensure accuracy and compliance with medical documentation standards.",
    techStack: ["PHP", "MySQL", "JavaScript", "Bootstrap", "AJAX", "PDF Generation", "jQuery"],
    features: [
      { title: "Template Library", description: "Pre-built medical report templates covering common diagnoses, procedures, and follow-up documentation." },
      { title: "Multi-user Collaboration", description: "Simultaneous access for multiple doctors with user-specific dashboards and report histories." },
      { title: "Automated Formatting", description: "Intelligent document formatting that structures reports according to medical documentation standards." },
      { title: "PDF Export", description: "One-click professional PDF generation with hospital branding, headers, and digital signatures." },
      { title: "Patient Records Integration", description: "Linked patient database for auto-populating demographic and historical data into reports." },
      { title: "Audit Trail", description: "Complete logging of report creation, edits, and access for compliance and quality assurance." },
    ],
    stats: [
      { value: "75%", label: "Time Saved" },
      { value: "1,000+", label: "Reports Generated" },
      { value: "15+", label: "Active Doctors" },
      { value: "100%", label: "Format Compliance" },
    ],
    tags: ["Multi-user", "Healthcare", "Automation"],
    detailSections: [],
    order: 2,
    createdAt: Date.now(),
  },
  {
    slug: "roshbadam",
    title: "Roshbadam",
    subtitle: "E-commerce Branding & Logistics",
    year: "2024",
    role: "Brand Strategist & Developer",
    accent: "orange",
    status: "Live",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
    heroDescription:
      "End-to-end e-commerce brand setup including visual identity, product photography direction, logistics pipeline, and digital marketing strategy.",
    problem:
      "Launching an e-commerce brand requires juggling dozens of moving parts — from brand identity and product photography to website development, payment processing, and logistics. Most small business owners lack the technical expertise and resources to handle this complexity, resulting in fragmented, unprofessional online presences that fail to convert.",
    solution:
      "Delivered a complete brand-to-market solution covering every aspect of e-commerce launch. Built the visual identity from scratch, directed product photography, developed the storefront, integrated payment and shipping systems, and created the initial digital marketing campaigns — all as a cohesive, turnkey package.",
    techStack: ["WordPress", "WooCommerce", "Elementor", "Photoshop", "Lightroom", "Meta Ads", "Google Analytics"],
    features: [
      { title: "Brand Identity Design", description: "Complete visual identity including logo, color palette, typography system, and brand guidelines." },
      { title: "Product Photography", description: "Directed professional product shoots with consistent styling, lighting, and post-processing pipeline." },
      { title: "Storefront Development", description: "Custom WooCommerce storefront with optimized product pages, cart flow, and checkout experience." },
      { title: "Logistics Integration", description: "End-to-end shipping pipeline with courier API integration, tracking, and automated notifications." },
      { title: "Payment Processing", description: "Multi-gateway payment integration supporting cards, mobile banking, and cash-on-delivery options." },
      { title: "Marketing Launch", description: "Initial Meta Ads campaigns with audience targeting, creative assets, and conversion tracking setup." },
    ],
    stats: [
      { value: "300+", label: "Products Listed" },
      { value: "95%", label: "Customer Satisfaction" },
      { value: "3x", label: "Revenue Growth" },
      { value: "2 Weeks", label: "Launch Timeline" },
    ],
    tags: ["E-commerce", "Branding", "Logistics"],
    detailSections: [],
    order: 3,
    createdAt: Date.now(),
  },
  {
    slug: "college-erp",
    title: "College ERP System",
    subtitle: "Comprehensive Educational Management Platform",
    year: "2024",
    role: "Lead Developer & System Architect",
    accent: "teal",
    status: "Built",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
    heroDescription:
      "A role-based ERP for educational institutions with dedicated portals for Admins, Department Heads, Teachers, and Students. Features automated attendance tracking, fine management, and dynamic mark entry.",
    problem:
      "Educational institutions were drowning in manual processes — paper-based attendance, hand-calculated grades, untracked fines, and disconnected department workflows. Each role (admin, teacher, student) needed different views of the same data, but existing systems were either too expensive or required extensive customization to match institutional workflows.",
    solution:
      "Architected and built a comprehensive ERP system with four distinct role-based portals. Each user type sees only what they need — admins manage the whole institution, department heads oversee their faculty, teachers handle classes and grading, and students access their academic records. The system automates attendance-linked fines (20tk per missed class), dynamic mark entry, and cross-department reporting.",
    techStack: ["PHP", "Node.js", "MySQL", "JavaScript", "Bootstrap", "AJAX", "REST API", "Chart.js"],
    features: [
      { title: "Role-Based Access Control", description: "Four distinct portals (Admin, Dept Head, Teacher, Student) with granular permissions and role-specific dashboards." },
      { title: "Automated Attendance Tracking", description: "Digital attendance system with automatic fine calculation (20tk per missed class) and notification triggers." },
      { title: "Dynamic Mark Entry", description: "Flexible grading system supporting multiple assessment types, weighted scoring, and automatic GPA calculation." },
      { title: "Fine Management System", description: "Automated fine tracking linked to attendance with payment recording, balance alerts, and clearance workflows." },
      { title: "Department Analytics", description: "Per-department performance metrics, attendance trends, and comparative analysis dashboards with Chart.js visualizations." },
      { title: "Cross-Role Reporting", description: "Unified reporting system that aggregates data across roles for institutional oversight and decision-making." },
    ],
    stats: [
      { value: "4", label: "User Role Portals" },
      { value: "500+", label: "Students Managed" },
      { value: "90%", label: "Process Automation" },
      { value: "20tk", label: "Auto-fined Per Absence" },
    ],
    tags: ["Role-Based Access", "PHP/Node.js", "Database Design"],
    detailSections: [],
    order: 4,
    createdAt: Date.now(),
  },
  {
    slug: "the-cat-club",
    title: "The Cat Club",
    subtitle: "E-commerce Brand & Community",
    year: "2025",
    role: "Brand Builder & Developer",
    accent: "violet",
    status: "Active",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
    heroDescription:
      "A niche e-commerce brand built from scratch with community-first approach. Includes brand identity, product catalog, social media presence, and fulfilment workflow.",
    problem:
      "Building a niche e-commerce brand in a saturated market requires more than just listing products — it demands a compelling brand story, engaged community, and seamless operations. Most brand builders focus on one piece and ignore the rest, resulting in beautiful stores with no traffic or engaged audiences with no conversion pathway.",
    solution:
      "Built The Cat Club as a community-first e-commerce brand. Started with audience building and brand identity before launching products, ensuring a ready customer base from day one. The entire ecosystem — from social media content pipeline to order fulfillment — was designed as an integrated system.",
    techStack: ["WordPress", "WooCommerce", "Canva", "Meta Business Suite", "Instagram API", "Elementor"],
    features: [
      { title: "Community-First Strategy", description: "Audience building through engaging content and community management before product launch." },
      { title: "Brand Identity System", description: "Cohesive visual language across all touchpoints — website, social media, packaging, and communications." },
      { title: "Product Catalog", description: "Curated product catalog with professional imagery, detailed descriptions, and smart categorization." },
      { title: "Social Media Pipeline", description: "Automated content creation and scheduling workflow for consistent brand presence across platforms." },
      { title: "Fulfillment Workflow", description: "Streamlined order processing from confirmation to packaging, shipping, and delivery tracking." },
      { title: "Customer Engagement", description: "Post-purchase engagement system with feedback collection, loyalty programs, and re-marketing triggers." },
    ],
    stats: [
      { value: "1,200+", label: "Community Members" },
      { value: "200+", label: "Products Sold" },
      { value: "4.8/5", label: "Customer Rating" },
      { value: "45%", label: "Repeat Customer Rate" },
    ],
    tags: ["E-commerce", "Community", "Brand"],
    detailSections: [],
    order: 5,
    createdAt: Date.now(),
  },
];

/* ─────────────────────────────────────────────────────────────
   SKILLS  (expanded from fallbackConfigs → one doc per skill)
───────────────────────────────────────────────────────────── */
const skillRows: Array<{ name: string; category: string }> = [
  { name: "HTML", category: "Tech" },
  { name: "CSS", category: "Tech" },
  { name: "JavaScript", category: "Tech" },
  { name: "Tailwind CSS", category: "Tech" },
  { name: "React", category: "Tech" },
  { name: "Figma", category: "Design" },
  { name: "Adobe Photoshop", category: "Design" },
  { name: "Adobe Illustrator", category: "Design" },
  { name: "UI/UX Design", category: "Design" },
  { name: "n8n", category: "Automation" },
  { name: "AI Agents", category: "Automation" },
  { name: "Workflow Automation", category: "Automation" },
  { name: "Facebook Business Suite", category: "Automation" },
  { name: "CapCut", category: "Video" },
  { name: "Adobe Premiere Pro", category: "Video" },
  { name: "Social Media Ads", category: "Video" },
  { name: "Motion Graphics", category: "Video" },
  { name: "Meta Ads", category: "Digital Marketing" },
  { name: "Google Ads", category: "Digital Marketing" },
  { name: "SEO", category: "Digital Marketing" },
  { name: "Content Strategy", category: "Digital Marketing" },
  { name: "Analytics", category: "Digital Marketing" },
];

export const seedSkills: Omit<FirestoreSkill, "id">[] = skillRows.map((s, i) => ({
  ...s,
  order: i,
}));

/* ─────────────────────────────────────────────────────────────
   TIMELINE  (icon field is the string key in TIMELINE_ICON_MAP)
───────────────────────────────────────────────────────────── */
export const seedTimeline: Omit<FirestoreTimeline, "id">[] = [
  {
    year: "2019",
    title: "Started Coding",
    description:
      "Wrote my first HTML file at 15. Built a personal page that looked terrible — and was immediately obsessed with making it better. The loop began.",
    icon: "Code2",
    rgb: "16,185,129",
    tag: "Origin",
    order: 0,
  },
  {
    year: "2020",
    title: "Mastered Video Editing",
    description:
      "Spent two years inside Adobe Premiere Pro and After Effects. Developed a sharp intuition for storytelling, timing, and cinematic motion design.",
    icon: "Video",
    rgb: "56,189,248",
    tag: "Creative",
    order: 1,
  },
  {
    year: "2021",
    title: "Discovered UI/UX Design",
    description:
      "Fell into Figma and never looked back. Learned that great software isn't just used — it's felt. Started designing real products that people love.",
    icon: "Figma",
    rgb: "139,92,246",
    tag: "Design",
    order: 2,
  },
  {
    year: "2022",
    title: "Launched The Subspot",
    description:
      "Built and scaled a digital subscription platform from zero to 2,000+ active users. First real taste of full-stack entrepreneurship — product, ops, and growth at once.",
    icon: "Rocket",
    rgb: "99,102,241",
    tag: "Launch",
    order: 3,
  },
  {
    year: "2023",
    title: "Enrolled in CST Program",
    description:
      "Joined the Computer Science & Technology program. Bridged self-taught intuition with formal engineering — algorithms, data structures, and system design.",
    icon: "GraduationCap",
    rgb: "245,158,11",
    tag: "Academia",
    order: 4,
  },
  {
    year: "2024",
    title: "AI Automation Expert",
    description:
      "Became obsessed with intelligent workflow automation using n8n. Now building AI pipelines that save hundreds of hours for real businesses every single month.",
    icon: "Bot",
    rgb: "249,115,22",
    tag: "AI",
    order: 5,
  },
  {
    year: "2025 →",
    title: "Full-Stack & Beyond",
    description:
      "Operating as a full-stack developer, automation architect, and creative director. Delivering end-to-end digital products — from source code to brand identity.",
    icon: "Sparkles",
    rgb: "20,184,166",
    tag: "Now",
    order: 6,
  },
];

/* ─────────────────────────────────────────────────────────────
   SOCIAL LINKS  (matches the defaultSocials in Hero.tsx)
───────────────────────────────────────────────────────────── */
export const seedSocials: Omit<FirestoreSocial, "id">[] = [
  { name: "GitHub",    icon: "Github",        url: "https://github.com/NibirNissan",          order: 0 },
  { name: "Telegram",  icon: "MessageCircle", url: "https://t.me/nibir_nissan",               order: 1 },
  { name: "WhatsApp",  icon: "Phone",         url: "https://wa.me/8801976816697",              order: 2 },
];

export const seedServices: Omit<FirestoreService, "id">[] = [
  {
    title: "Custom AI Agent & Workflow Building",
    description: "Save 20+ hours per week and eliminate human error with intelligent workflows that run 24/7.",
    iconUrl: "",
    price: "Contact",
    order: 0,
    createdAt: Date.now(),
  },
  {
    title: "Web Development & UI/UX Design",
    description: "From concept to production — beautiful, fast, and conversion-optimized websites and applications.",
    iconUrl: "",
    price: "Contact",
    order: 1,
    createdAt: Date.now(),
  },
  {
    title: "Professional Video Editing",
    description: "High-impact video that captures attention, tells your story, and drives engagement across every platform.",
    iconUrl: "",
    price: "Contact",
    order: 2,
    createdAt: Date.now(),
  },
  {
    title: "Results-Driven Digital Marketing",
    description: "Data-backed campaigns that generate real leads, real sales, and measurable ROI — not vanity metrics.",
    iconUrl: "",
    price: "Contact",
    order: 3,
    createdAt: Date.now(),
  },
  {
    title: "Digital Subscription Business Setup",
    description: "Launch and scale a digital subscription business with automated delivery, payments, and customer management.",
    iconUrl: "",
    price: "Contact",
    order: 4,
    createdAt: Date.now(),
  },
  {
    title: "Web App & SaaS Development",
    description: "From MVP to enterprise-grade — full-stack SaaS development with modern architecture and subscription logic.",
    iconUrl: "",
    price: "Contact",
    order: 5,
    createdAt: Date.now(),
  },
  {
    title: "High-Conversion WordPress Development",
    description: "SEO-optimized, blazing-fast WordPress sites engineered to turn visitors into paying customers.",
    iconUrl: "",
    price: "Contact",
    order: 6,
    createdAt: Date.now(),
  },
  {
    title: "E-commerce Brand Building",
    description: "End-to-end brand and store setup — from visual identity to live sales — in record time.",
    iconUrl: "",
    price: "Contact",
    order: 7,
    createdAt: Date.now(),
  },
];
