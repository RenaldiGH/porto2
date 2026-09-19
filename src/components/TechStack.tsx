"use client";

import { motion } from "framer-motion";
import { techStack } from "@/data/content";

export default function TechStack() {
  return (
    <section className="space-y-8 scroll-mt-24" id="tech-stack">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-surface-border pb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Core Technologies</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-white mt-1">
            Tech Stack Breakdown
          </h2>
        </div>
        <div className="px-3 py-1 rounded-full border border-surface-border text-xs font-mono text-zinc-400 self-start sm:self-auto">
          2024 Stack
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techStack.map((category, i) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="p-6 rounded-2xl border border-surface-border bg-surface space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-200">
                    {category.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {category.badge}
                </span>
              </div>
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="p-3.5 rounded-xl border border-zinc-800/60 bg-black/40 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
