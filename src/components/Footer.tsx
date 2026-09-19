import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-black mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-zinc-500">
        <div className="flex items-center space-x-2 text-center md:text-left">
          <span>© {new Date().getFullYear()} Reynaldi. Crafted with pure monochrome &amp; precision.</span>
        </div>
        <div className="flex items-center space-x-6">
          <a className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1" href="#about">
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
