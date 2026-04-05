import { Code2, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="font-bold text-white text-sm">
            Nibir<span className="text-indigo-400">.</span>
          </span>
        </div>
        <p className="text-slate-500 text-sm flex items-center gap-1.5">
          Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> by Nibir Nissan &copy; {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <a href="#about" className="hover:text-slate-300 transition-colors">About</a>
          <a href="#projects" className="hover:text-slate-300 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-slate-300 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
