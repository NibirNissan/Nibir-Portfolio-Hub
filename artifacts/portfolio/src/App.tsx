import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      <Nav />
      <Hero />
      <div className="section-line h-px w-full opacity-30" />
      <About />
      <div className="section-line h-px w-full opacity-30" />
      <Skills />
      <div className="section-line h-px w-full opacity-30" />
      <Projects />
      <div className="section-line h-px w-full opacity-30" />
      <Services />
      <div className="section-line h-px w-full opacity-30" />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
