import { Route, Switch } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Subscription from "@/components/Subscription";
import Ecosystem from "@/components/Ecosystem";
import Vision from "@/components/Vision";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScanLine from "@/components/ScanLine";
import ProjectPage from "@/pages/ProjectPage";

const pageVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] as const } },
} as const;

function HomePage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb] overflow-x-hidden grain-bg relative"
    >
      <Nav />
      <Hero />
      <ScanLine />
      <About />
      <ScanLine />
      <Skills />
      <ScanLine />
      <Projects />
      <ScanLine />
      <Services />
      <ScanLine />
      <Subscription />
      <ScanLine />
      <Ecosystem />
      <ScanLine />
      <Vision />
      <ScanLine />
      <Contact />
      <Footer />
    </motion.div>
  );
}

function AnimatedProjectPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ProjectPage />
    </motion.div>
  );
}

function App() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={HomePage} />
        <Route path="/project/:slug" component={AnimatedProjectPage} />
      </Switch>
    </AnimatePresence>
  );
}

export default App;
