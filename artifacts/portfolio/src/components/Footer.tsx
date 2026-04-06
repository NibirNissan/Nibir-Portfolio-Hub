import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 sm:py-10 border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <span className="text-[10px] font-black text-emerald-400">NN</span>
          </div>
          <span className="font-bold text-white text-sm font-[var(--app-font-display)]">
            Nibir<span className="text-emerald-400">.</span>
          </span>
        </div>
        <p className="text-neutral-500 text-xs sm:text-sm flex items-center gap-1.5">
          Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> by Nibir Nissan &copy; {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-500">
          <a href="#about" className="hover:text-neutral-300 transition-colors">About</a>
          <a href="#projects" className="hover:text-neutral-300 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-neutral-300 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
