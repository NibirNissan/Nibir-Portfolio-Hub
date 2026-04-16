import { useEffect } from "react";
import { Route, Switch } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { trackHomepageVisit } from "@/lib/analytics";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Subscription from "@/components/Subscription";
import Ecosystem from "@/components/Ecosystem";
import Vision from "@/components/Vision";
import ProjectFeatures from "@/components/ProjectFeatures";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScanLine from "@/components/ScanLine";
import ScrollSkew from "@/components/ScrollSkew";
import ParallaxBg from "@/components/ParallaxBg";
import CustomCursor from "@/components/CustomCursor";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ProjectPage from "@/pages/ProjectPage";
import ServicePage from "@/pages/ServicePage";
import AdminPage from "@/pages/AdminPage";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";

const pageVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] as const } },
} as const;

function HomePage() {
  useEffect(() => {
    void trackHomepageVisit();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen overflow-x-hidden grain-bg relative"
      style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}
    >
      <ParallaxBg />
      <Nav />
      <Hero />
      <ScanLine />
      <ScrollSkew><About /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><Skills /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><Projects /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><Services /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><Subscription /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><Ecosystem /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><Vision /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><ProjectFeatures /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><Testimonials /></ScrollSkew>
      <ScanLine />
      <ScrollSkew><Contact /></ScrollSkew>
      <Footer />
    </motion.div>
  );
}

function AnimatedProjectPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <ProjectPage />
    </motion.div>
  );
}

function AnimatedServicePage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <ServicePage />
    </motion.div>
  );
}

function AnimatedBlogList() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <BlogList />
    </motion.div>
  );
}

function AnimatedBlogPost() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <BlogPost />
    </motion.div>
  );
}

function App() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <>
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <ThemeSwitcher />}
      <AnimatePresence mode="wait">
        <Switch key={location}>
          <Route path="/" component={HomePage} />
          <Route path="/project/:slug" component={AnimatedProjectPage} />
          <Route path="/service/:slug" component={AnimatedServicePage} />
          <Route path="/blog" component={AnimatedBlogList} />
          <Route path="/blog/:slug" component={AnimatedBlogPost} />
          <Route path="/admin" component={AdminPage} />
        </Switch>
      </AnimatePresence>
    </>
  );
}

export default App;
