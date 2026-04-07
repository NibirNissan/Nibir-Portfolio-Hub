import { Bot, Code2, Video, TrendingUp, ShoppingBag, Rocket, Globe, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Deliverable {
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export interface ServiceData {
  slug: string;
  icon: LucideIcon;
  title: string;
  headline: string;
  roiLine: string;
  color: string;
  rgb: string;
  caseStudySlug?: string;
  caseStudyTitle?: string;
  caseStudyResult?: string;
  process: ProcessStep[];
  deliverables: Deliverable[];
  faq: FAQItem[];
  pricing: PricingTier[];
  ctaLink: string;
}

export const servicesData: ServiceData[] = [
  {
    slug: "ai-automation",
    icon: Bot,
    title: "Custom AI Agent & Workflow Building",
    headline: "AI-Powered Business Automation",
    roiLine: "Save 20+ hours per week and eliminate human error with intelligent workflows that run 24/7.",
    color: "emerald",
    rgb: "16, 185, 129",
    caseStudySlug: "the-subspot",
    caseStudyTitle: "The Subspot",
    caseStudyResult: "Automated 95% of subscription management — serving 2,000+ users with zero manual intervention.",
    process: [
      { title: "Discovery Call", description: "We map your current workflows, identify bottlenecks, and pinpoint the highest-ROI automation opportunities." },
      { title: "Workflow Architecture", description: "Custom n8n workflow blueprints designed around your exact business logic, tools, and data flows." },
      { title: "Build & Integration", description: "Full implementation — API connections, AI agent setup, error handling, and testing across your entire stack." },
      { title: "Launch & Scale", description: "Go live with monitoring dashboards, documentation, and ongoing optimization to scale as you grow." },
    ],
    deliverables: [
      { title: "24/7 Lead Response", description: "AI agents that qualify, respond, and route leads automatically — day or night." },
      { title: "Automated CRM Sync", description: "Real-time data sync between all your tools — no manual entry, no missed updates." },
      { title: "Smart Email Sequences", description: "Trigger-based email flows that nurture leads based on behavior and engagement." },
      { title: "Custom n8n Workflows", description: "Purpose-built automation flows tailored to your exact business processes." },
      { title: "Error Monitoring", description: "Real-time alerts and auto-recovery systems so nothing breaks silently." },
      { title: "Performance Dashboard", description: "Live metrics showing time saved, tasks automated, and ROI delivered." },
    ],
    faq: [
      { question: "What tools do you integrate with?", answer: "I work with virtually any tool that has an API — CRMs (HubSpot, Salesforce), email platforms (Mailchimp, SendGrid), payment systems (Stripe), spreadsheets, databases, and hundreds more via n8n." },
      { question: "How long does a typical automation project take?", answer: "Simple workflows take 1-2 weeks. Complex multi-step systems with AI agents typically take 3-5 weeks from discovery to launch." },
      { question: "Do I need technical knowledge to use the automations?", answer: "Not at all. Everything is built with a clean UI and documentation. You'll get training on how to monitor and adjust your workflows." },
      { question: "What happens if something breaks?", answer: "All workflows include error handling and alert systems. I also offer ongoing maintenance packages for peace of mind." },
    ],
    pricing: [
      { name: "Starter", price: "Contact", description: "Perfect for automating your first workflow", features: ["1 core automation workflow", "Up to 3 tool integrations", "Basic error handling", "1 week of post-launch support", "Documentation & training"] },
      { name: "Professional", price: "Contact", description: "For businesses ready to scale operations", features: ["Up to 5 automation workflows", "Unlimited tool integrations", "AI agent integration", "Custom dashboard", "30 days of support", "Priority response time"], highlight: true },
      { name: "Enterprise", price: "Contact", description: "Full-scale automation transformation", features: ["Unlimited workflows", "Multi-department automation", "Advanced AI agents", "Custom reporting", "Dedicated support channel", "Quarterly optimization reviews"] },
    ],
    ctaLink: "https://wa.me/8801976816697",
  },
  {
    slug: "web-development",
    icon: Code2,
    title: "Web Development & UI/UX Design",
    headline: "Pixel-Perfect Web Experiences",
    roiLine: "From concept to production — beautiful, fast, and conversion-optimized websites and applications.",
    color: "indigo",
    rgb: "99, 102, 241",
    caseStudySlug: "jibon",
    caseStudyTitle: "Jibon",
    caseStudyResult: "Designed and developed a modern web application with responsive UI, seamless navigation, and optimized performance.",
    process: [
      { title: "Design Brief", description: "Understand your brand, audience, and goals to craft a clear creative direction and wireframes." },
      { title: "UI/UX Design", description: "High-fidelity Figma prototypes with responsive layouts, interaction design, and design system creation." },
      { title: "Development", description: "Clean, modern code using React, Tailwind CSS, and performance-first architecture." },
      { title: "Launch & Optimize", description: "Deployment, SEO setup, analytics integration, and performance tuning for maximum impact." },
    ],
    deliverables: [
      { title: "Figma Design System", description: "Complete component library with tokens, variants, and responsive breakpoints." },
      { title: "Responsive Frontend", description: "Pixel-perfect implementation that looks stunning on every device and screen size." },
      { title: "Performance Optimization", description: "Lighthouse 90+ scores with optimized assets, lazy loading, and code splitting." },
      { title: "SEO Foundation", description: "Semantic HTML, meta tags, structured data, and sitemap for search visibility." },
      { title: "Animation & Interactions", description: "Smooth micro-interactions and scroll animations that elevate the experience." },
      { title: "CMS Integration", description: "Content management setup so you can update content without touching code." },
    ],
    faq: [
      { question: "What technologies do you use?", answer: "React, Next.js, Vite, Tailwind CSS, TypeScript, and Framer Motion are my core stack. I also work with WordPress for content-heavy sites." },
      { question: "Do you design and develop, or just one?", answer: "Both. I handle the full pipeline from Figma design to production code. You get a single point of contact for the entire project." },
      { question: "Can you redesign my existing website?", answer: "Absolutely. I'll audit your current site, identify improvements, and deliver a modern redesign that improves both aesthetics and performance." },
      { question: "Do you provide hosting and maintenance?", answer: "I can deploy to Vercel, Netlify, or your preferred host. Ongoing maintenance packages are available for updates and monitoring." },
    ],
    pricing: [
      { name: "Starter", price: "Contact", description: "Landing page or portfolio site", features: ["1–3 page website", "Mobile responsive design", "Basic animations", "Contact form integration", "1 round of revisions"] },
      { name: "Professional", price: "Contact", description: "Full business website or web app", features: ["Up to 10 pages", "Custom design system", "Advanced animations", "CMS integration", "SEO optimization", "3 rounds of revisions"], highlight: true },
      { name: "Enterprise", price: "Contact", description: "Complex web applications", features: ["Unlimited pages", "Full-stack development", "User authentication", "Database integration", "API development", "Ongoing support & maintenance"] },
    ],
    ctaLink: "https://wa.me/8801976816697",
  },
  {
    slug: "video-editing",
    icon: Video,
    title: "Professional Video Editing",
    headline: "Cinematic Video Content",
    roiLine: "High-impact video that captures attention, tells your story, and drives engagement across every platform.",
    color: "sky",
    rgb: "56, 189, 248",
    caseStudySlug: "roshbadam",
    caseStudyTitle: "Roshbadam",
    caseStudyResult: "Produced high-impact visual content that elevated the brand presence and drove engagement across platforms.",
    process: [
      { title: "Creative Brief", description: "Define your message, audience, tone, and platform requirements for maximum impact." },
      { title: "Storyboard & Edit", description: "Structured narrative with professional cuts, transitions, color grading, and sound design." },
      { title: "Review & Refine", description: "Collaborative review rounds with precise feedback implementation and polish." },
      { title: "Export & Deliver", description: "Platform-optimized exports for Instagram, TikTok, YouTube, ads, or any destination." },
    ],
    deliverables: [
      { title: "Social Media Reels", description: "Scroll-stopping short-form content optimized for Instagram, TikTok, and YouTube Shorts." },
      { title: "Ad Creatives", description: "High-converting video ads designed for Meta, Google, and programmatic campaigns." },
      { title: "Brand Videos", description: "Professional brand stories, product demos, and company culture content." },
      { title: "Color Grading", description: "Cinematic color correction and grading that gives your content a premium, cohesive look." },
      { title: "Motion Graphics", description: "Custom text animations, lower thirds, intros, and branded overlays." },
      { title: "Sound Design", description: "Licensed music, sound effects, and audio mixing for polished, professional output." },
    ],
    faq: [
      { question: "What software do you use?", answer: "Primarily Adobe Premiere Pro and After Effects for professional work, plus CapCut for quick-turnaround social content." },
      { question: "How fast is the turnaround?", answer: "Short-form content: 2-3 days. Long-form edits: 5-7 days. Rush delivery is available for an additional fee." },
      { question: "Do you provide raw footage or just edited content?", answer: "I work with your raw footage. If you need filming services, I can recommend trusted videographers in your area." },
      { question: "Can you match my existing brand style?", answer: "Yes. Send me your brand guidelines, reference videos, or mood board, and I'll match the visual style precisely." },
    ],
    pricing: [
      { name: "Starter", price: "Contact", description: "Social media content package", features: ["Up to 5 short-form edits/month", "Basic color correction", "Text overlays & captions", "Platform-optimized exports", "1 revision per video"] },
      { name: "Professional", price: "Contact", description: "Full content production", features: ["Up to 15 edits/month", "Advanced color grading", "Motion graphics & intros", "Sound design & mixing", "Brand consistency guide", "2 revisions per video"], highlight: true },
      { name: "Enterprise", price: "Contact", description: "Complete video strategy", features: ["Unlimited edits", "Ad creative production", "Long-form content", "Custom templates", "Priority turnaround", "Dedicated revision rounds"] },
    ],
    ctaLink: "https://wa.me/8801976816697",
  },
  {
    slug: "digital-marketing",
    icon: TrendingUp,
    title: "Results-Driven Digital Marketing",
    headline: "Performance Marketing That Scales",
    roiLine: "Data-backed campaigns that generate real leads, real sales, and measurable ROI — not vanity metrics.",
    color: "rose",
    rgb: "251, 113, 133",
    caseStudySlug: "the-cat-club",
    caseStudyTitle: "The Cat Club",
    caseStudyResult: "Built a thriving online community with strategic digital marketing, growing to 1,000+ active members.",
    process: [
      { title: "Audit & Strategy", description: "Deep-dive into your current marketing, competitors, and audience to build a data-driven growth plan." },
      { title: "Campaign Setup", description: "Pixel installation, audience building, creative production, and campaign architecture." },
      { title: "Launch & Optimize", description: "A/B testing, bid optimization, and real-time performance monitoring across all channels." },
      { title: "Scale & Report", description: "Double down on what works, kill what doesn't, and deliver transparent performance reports." },
    ],
    deliverables: [
      { title: "Meta Ads Management", description: "Full Facebook & Instagram ad campaigns — targeting, creatives, and optimization." },
      { title: "Google Ads Campaigns", description: "Search, display, and remarketing campaigns that capture high-intent traffic." },
      { title: "Lead Generation Funnels", description: "End-to-end funnel design from landing page to conversion and follow-up." },
      { title: "Analytics Dashboard", description: "Custom reporting dashboard with real-time KPIs, ROAS tracking, and attribution." },
      { title: "A/B Testing Framework", description: "Systematic testing of creatives, copy, audiences, and landing pages." },
      { title: "Brand Scaling Strategy", description: "Long-term growth roadmap with budget allocation and channel expansion plans." },
    ],
    faq: [
      { question: "What's the minimum ad budget you work with?", answer: "I recommend a minimum of $500/month ad spend to gather enough data for meaningful optimization. My management fee is separate." },
      { question: "How soon will I see results?", answer: "Paid ads typically show initial data within 48-72 hours. Meaningful optimization takes 2-4 weeks. Full campaign maturity is around 60-90 days." },
      { question: "Do you create the ad creatives?", answer: "Yes. I handle ad copy, image selection/editing, and video ad production. Everything is designed for conversion, not just impressions." },
      { question: "How do you measure success?", answer: "We track ROAS, CPA, CPL, conversion rates, and LTV. You get weekly reports and a monthly strategy review." },
    ],
    pricing: [
      { name: "Starter", price: "Contact", description: "Single-channel campaign management", features: ["1 ad platform (Meta or Google)", "Up to 3 campaigns", "Monthly performance report", "Basic audience targeting", "Bi-weekly optimization"] },
      { name: "Professional", price: "Contact", description: "Multi-channel growth strategy", features: ["Meta + Google Ads", "Unlimited campaigns", "Weekly reporting", "Advanced audience building", "A/B testing", "Funnel optimization"], highlight: true },
      { name: "Enterprise", price: "Contact", description: "Full-scale marketing department", features: ["All ad platforms", "Full funnel management", "Daily optimization", "Custom analytics dashboard", "Creative production", "Dedicated strategy calls"] },
    ],
    ctaLink: "https://wa.me/8801976816697",
  },
  {
    slug: "subscription-business",
    icon: ShoppingBag,
    title: "Digital Subscription Business Setup",
    headline: "Subscription Commerce, Automated",
    roiLine: "Launch and scale a digital subscription business with automated delivery, payments, and customer management.",
    color: "violet",
    rgb: "139, 92, 246",
    caseStudySlug: "the-subspot",
    caseStudyTitle: "The Subspot",
    caseStudyResult: "Built a subscription platform from zero to 2,000+ active subscribers with fully automated operations.",
    process: [
      { title: "Business Model Design", description: "Define your subscription tiers, pricing strategy, and digital product delivery workflow." },
      { title: "Platform Setup", description: "Build your storefront, payment integration, and automated delivery infrastructure." },
      { title: "Automation Layer", description: "Connect n8n workflows for renewal tracking, user management, and support automation." },
      { title: "Launch & Grow", description: "Go live with onboarding flows, analytics tracking, and growth optimization systems." },
    ],
    deliverables: [
      { title: "Subscription Platform", description: "Complete storefront with tiered plans, user dashboards, and self-service management." },
      { title: "Payment Integration", description: "Stripe/PayPal/local payment gateway setup with automated invoicing and receipts." },
      { title: "Automated Delivery", description: "Instant digital product delivery triggered by purchase — no manual intervention." },
      { title: "Renewal System", description: "Smart renewal tracking with automated reminders, grace periods, and re-engagement." },
      { title: "Customer Portal", description: "Self-service dashboard where users manage subscriptions, view history, and update details." },
      { title: "Analytics & Reporting", description: "MRR tracking, churn analysis, LTV calculations, and growth metrics dashboard." },
    ],
    faq: [
      { question: "What kind of digital products can I sell?", answer: "Software subscriptions, digital downloads, courses, memberships, SaaS access, content libraries — any digital product with recurring revenue potential." },
      { question: "Can you migrate my existing subscribers?", answer: "Yes. I handle data migration from your current system, including subscriber records, payment history, and product access." },
      { question: "What payment methods are supported?", answer: "Stripe, PayPal, bKash, and other local payment gateways. I set up whatever your audience prefers." },
      { question: "Do I need to handle customer support manually?", answer: "Most common support scenarios are automated — password resets, subscription changes, renewal issues. Only edge cases need human attention." },
    ],
    pricing: [
      { name: "Starter", price: "Contact", description: "Launch your first subscription", features: ["Single subscription tier", "Payment integration", "Basic automation", "Customer portal", "Launch support"] },
      { name: "Professional", price: "Contact", description: "Multi-tier subscription business", features: ["Up to 5 subscription tiers", "Advanced automation", "Analytics dashboard", "Email sequences", "30 days support", "Renewal optimization"], highlight: true },
      { name: "Enterprise", price: "Contact", description: "Full subscription ecosystem", features: ["Unlimited tiers", "Multi-product catalog", "Advanced analytics", "Custom integrations", "White-label option", "Ongoing optimization"] },
    ],
    ctaLink: "https://wa.me/8801976816697",
  },
  {
    slug: "saas-development",
    icon: Rocket,
    title: "Web App & SaaS Development",
    headline: "Custom SaaS Platforms, Built to Scale",
    roiLine: "From MVP to enterprise-grade — full-stack SaaS development with modern architecture and subscription logic.",
    color: "amber",
    rgb: "245, 158, 11",
    caseStudySlug: "college-erp",
    caseStudyTitle: "College ERP",
    caseStudyResult: "Built a multi-department ERP system handling student management, faculty coordination, and administrative operations for 50+ users.",
    process: [
      { title: "Product Discovery", description: "Define your MVP scope, user personas, core features, and technical requirements." },
      { title: "Architecture & Design", description: "System design, database schema, API structure, and UI/UX prototyping in Figma." },
      { title: "Iterative Development", description: "Agile sprints with regular demos — frontend, backend, and infrastructure built in parallel." },
      { title: "Launch & Iterate", description: "Production deployment, user onboarding, monitoring setup, and feature iteration roadmap." },
    ],
    deliverables: [
      { title: "Custom Web Application", description: "Full-stack SaaS platform with modern React frontend and robust Node.js backend." },
      { title: "User Management", description: "Multi-role authentication, permissions, team management, and access control." },
      { title: "Admin Dashboard", description: "Data-rich admin panel with analytics, user management, and system controls." },
      { title: "API Architecture", description: "RESTful API design with documentation, versioning, and third-party integration support." },
      { title: "Subscription Billing", description: "Stripe-powered billing with plans, trials, upgrades, and usage-based pricing." },
      { title: "Infrastructure Setup", description: "Cloud deployment, CI/CD pipeline, monitoring, and auto-scaling configuration." },
    ],
    faq: [
      { question: "What's your tech stack for SaaS?", answer: "React/Next.js frontend, Node.js/Express backend, PostgreSQL or MongoDB database, deployed on AWS or Vercel. I choose the best tools for your specific needs." },
      { question: "How long does it take to build an MVP?", answer: "A focused MVP typically takes 6-10 weeks. Complex platforms with multiple user roles and integrations take 3-6 months." },
      { question: "Do you handle DevOps and deployment?", answer: "Yes. I set up your production environment, CI/CD pipeline, monitoring, backups, and auto-scaling from day one." },
      { question: "Can you work with my existing codebase?", answer: "Absolutely. I can audit your current codebase, fix issues, add features, or refactor for better performance and maintainability." },
    ],
    pricing: [
      { name: "Starter", price: "Contact", description: "MVP development", features: ["Core feature set", "Basic authentication", "Simple dashboard", "API development", "Cloud deployment", "2 weeks post-launch support"] },
      { name: "Professional", price: "Contact", description: "Full SaaS platform", features: ["Advanced feature set", "Multi-role auth & permissions", "Admin + user dashboards", "Subscription billing", "API documentation", "60 days support"], highlight: true },
      { name: "Enterprise", price: "Contact", description: "Enterprise-grade SaaS", features: ["Unlimited features", "Multi-tenant architecture", "Advanced analytics", "Custom integrations", "Performance optimization", "Ongoing development & support"] },
    ],
    ctaLink: "https://wa.me/8801976816697",
  },
  {
    slug: "wordpress-development",
    icon: Globe,
    title: "High-Conversion WordPress Development",
    headline: "WordPress That Actually Converts",
    roiLine: "SEO-optimized, blazing-fast WordPress sites engineered to turn visitors into paying customers.",
    color: "cyan",
    rgb: "34, 211, 238",
    process: [
      { title: "Requirements & Audit", description: "Understand your business goals, analyze competitors, and define the site architecture." },
      { title: "Design & Build", description: "Custom theme development or page builder implementation with your brand identity." },
      { title: "Optimize & Test", description: "Speed optimization, SEO setup, cross-browser testing, and mobile responsiveness." },
      { title: "Launch & Train", description: "Go live with analytics, backup systems, and hands-on training for your team." },
    ],
    deliverables: [
      { title: "Custom WordPress Site", description: "Professional website with custom theme, responsive design, and brand-aligned aesthetics." },
      { title: "WooCommerce Store", description: "Full e-commerce setup with product pages, cart, checkout, and payment integration." },
      { title: "SEO Optimization", description: "On-page SEO, schema markup, XML sitemap, and Core Web Vitals optimization." },
      { title: "Speed Optimization", description: "Caching, image optimization, lazy loading, and CDN setup for sub-3-second load times." },
      { title: "Security Hardening", description: "SSL, firewall, malware scanning, and backup systems to protect your investment." },
      { title: "Content Management Training", description: "Hands-on training so your team can confidently update content, add products, and manage the site." },
    ],
    faq: [
      { question: "Do you use page builders or custom code?", answer: "Both. I'm an expert in Elementor and Divi for rapid delivery, and I also do custom theme development for unique requirements." },
      { question: "Can you improve my existing WordPress site?", answer: "Yes. I offer WordPress audits covering speed, SEO, security, and UX — with actionable improvements and implementation." },
      { question: "Do you set up WooCommerce?", answer: "Absolutely. Full store setup including product configuration, payment gateways, shipping, and inventory management." },
      { question: "What about ongoing maintenance?", answer: "I offer monthly maintenance packages covering updates, backups, security monitoring, and content changes." },
    ],
    pricing: [
      { name: "Starter", price: "Contact", description: "Business website", features: ["Up to 5 pages", "Responsive design", "Basic SEO setup", "Contact form", "1 revision round"] },
      { name: "Professional", price: "Contact", description: "Full business or e-commerce site", features: ["Up to 15 pages", "WooCommerce setup", "Advanced SEO", "Speed optimization", "Security hardening", "3 revision rounds"], highlight: true },
      { name: "Enterprise", price: "Contact", description: "Complex WordPress ecosystem", features: ["Unlimited pages", "Custom plugin development", "Multi-language support", "Advanced integrations", "Priority support", "Monthly maintenance"] },
    ],
    ctaLink: "https://wa.me/8801976816697",
  },
  {
    slug: "webapp-saas-product",
    icon: LayoutDashboard,
    title: "Web App & SaaS Product Development",
    headline: "Building the Future of Digital Tools",
    roiLine: "Enterprise-grade SaaS platforms with admin dashboards, multi-tenant logic, and subscription ecosystems.",
    color: "violet",
    rgb: "139, 92, 246",
    caseStudySlug: "college-erp",
    caseStudyTitle: "College ERP",
    caseStudyResult: "Delivered a full ERP system with multi-department access control and real-time data dashboards.",
    process: [
      { title: "Product Strategy", description: "Market analysis, feature prioritization, and technical architecture planning." },
      { title: "Prototype & Validate", description: "Interactive prototypes for user testing and stakeholder alignment before building." },
      { title: "Build & Ship", description: "Agile development with weekly demos, continuous integration, and quality assurance." },
      { title: "Scale & Evolve", description: "Performance monitoring, user feedback loops, and feature iteration for growth." },
    ],
    deliverables: [
      { title: "Product Roadmap", description: "Clear feature prioritization and development timeline aligned with business goals." },
      { title: "Interactive Prototype", description: "Clickable Figma prototype for testing and validation before development begins." },
      { title: "Full-Stack Application", description: "Production-ready SaaS with React frontend, Node.js backend, and cloud infrastructure." },
      { title: "Multi-Tenant Architecture", description: "Isolated data, customizable settings, and role-based access for each organization." },
      { title: "Billing & Subscriptions", description: "Stripe-powered recurring billing with plan management, invoices, and usage tracking." },
      { title: "DevOps & Monitoring", description: "CI/CD pipeline, error tracking, performance monitoring, and automated backups." },
    ],
    faq: [
      { question: "What's the difference between this and the SaaS Development service?", answer: "This service focuses on product development — strategy, prototyping, and building with a product mindset. It's ideal for founders building their own SaaS product." },
      { question: "Can you help me validate my SaaS idea?", answer: "Yes. I start with market research, competitive analysis, and rapid prototyping to validate before investing in full development." },
      { question: "Do you offer equity-based partnerships?", answer: "I occasionally take on equity partnerships for promising projects. Let's discuss your vision and see if it's a fit." },
      { question: "What about post-launch support?", answer: "I offer ongoing development retainers for continuous feature development, bug fixes, and infrastructure management." },
    ],
    pricing: [
      { name: "Starter", price: "Contact", description: "Validate & prototype", features: ["Market research", "Feature scoping", "Interactive prototype", "Technical architecture", "Development estimate"] },
      { name: "Professional", price: "Contact", description: "Full product build", features: ["Everything in Starter", "Full-stack development", "Multi-role authentication", "Billing integration", "Admin dashboard", "90 days post-launch support"], highlight: true },
      { name: "Enterprise", price: "Contact", description: "Scale & grow", features: ["Everything in Professional", "Multi-tenant architecture", "Advanced analytics", "Custom integrations", "Performance optimization", "Ongoing development retainer"] },
    ],
    ctaLink: "https://wa.me/8801976816697",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find((s) => s.slug === slug);
}
