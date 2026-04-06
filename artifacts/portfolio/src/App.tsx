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

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb] overflow-x-hidden grain-bg relative">
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
    </div>
  );
}

export default App;
