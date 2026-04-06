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

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb] overflow-x-hidden grain-bg relative">
      <Nav />
      <Hero />
      <div className="section-line h-px w-full opacity-30 relative z-10" />
      <About />
      <div className="section-line h-px w-full opacity-30 relative z-10" />
      <Skills />
      <div className="section-line h-px w-full opacity-30 relative z-10" />
      <Projects />
      <div className="section-line h-px w-full opacity-30 relative z-10" />
      <Services />
      <div className="section-line h-px w-full opacity-30 relative z-10" />
      <Subscription />
      <div className="section-line h-px w-full opacity-30 relative z-10" />
      <Ecosystem />
      <div className="section-line h-px w-full opacity-30 relative z-10" />
      <Vision />
      <div className="section-line h-px w-full opacity-30 relative z-10" />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
