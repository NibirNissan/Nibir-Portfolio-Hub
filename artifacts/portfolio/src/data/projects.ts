import { Users, Droplets, FileText, ShoppingBag, Briefcase, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectStat {
  value: string;
  label: string;
}

export interface ProjectData {
  slug: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  accent: string;
  status: string;
  heroDescription: string;
  problem: string;
  solution: string;
  techStack: string[];
  features: ProjectFeature[];
  stats: ProjectStat[];
  tags: string[];
}

export const projectsData: ProjectData[] = [
  {
    slug: "the-subspot",
    icon: Users,
    title: "The Subspot",
    subtitle: "Digital Subscription Management System",
    year: "2025",
    role: "Lead Developer & Product Owner",
    accent: "indigo",
    status: "Live",
    heroDescription:
      "A fully operational subscription management platform scaling to 2000+ active users. Handles digital product delivery, user management, and automated subscription renewals.",
    problem:
      "Managing digital subscriptions manually was a nightmare — tracking renewals, delivering products, handling payments, and managing user access across multiple platforms created bottlenecks that cost hours of daily effort. Existing solutions were either too expensive or too generic to fit the specific workflow needed for digital product delivery at scale.",
    solution:
      "Built a custom end-to-end subscription management system from scratch. The platform automates the entire lifecycle — from user signup and payment processing to automated product delivery and renewal tracking. Every manual touchpoint was identified and replaced with an automated workflow using n8n, creating a system that runs 24/7 without human intervention.",
    techStack: ["React", "Node.js", "n8n", "WordPress", "WooCommerce", "REST API", "MySQL", "Tailwind CSS", "Zapier"],
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
  },
  {
    slug: "jibon",
    icon: Droplets,
    title: "Jibon",
    subtitle: "Blood Donation Platform",
    year: "2024",
    role: "Full Stack Developer",
    accent: "red",
    status: "Active",
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
  },
  {
    slug: "hospital-report-maker",
    icon: FileText,
    title: "Hospital Report Maker",
    subtitle: "Multi-user Medical System",
    year: "2024",
    role: "Lead Developer",
    accent: "sky",
    status: "Deployed",
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
  },
  {
    slug: "roshbadam",
    icon: ShoppingBag,
    title: "Roshbadam",
    subtitle: "E-commerce Branding & Logistics",
    year: "2024",
    role: "Brand Strategist & Developer",
    accent: "orange",
    status: "Live",
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
  },
  {
    slug: "college-erp",
    icon: GraduationCap,
    title: "College ERP System",
    subtitle: "Comprehensive Educational Management Platform",
    year: "2024",
    role: "Lead Developer & System Architect",
    accent: "teal",
    status: "Built",
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
  },
  {
    slug: "the-cat-club",
    icon: Briefcase,
    title: "The Cat Club",
    subtitle: "E-commerce Brand & Community",
    year: "2025",
    role: "Brand Builder & Developer",
    accent: "violet",
    status: "Active",
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
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projectsData.find((p) => p.slug === slug);
}
