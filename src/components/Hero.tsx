"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Copy, Check, User, Code, Award, Clock, Code2 } from "lucide-react";
import { profile as fallbackProfile } from "@/data/content";

interface Profile {
  name: string;
  origin: string;
  role: string;
  passion: string;
  status: string;
  headline: string;
  subHeadline: string;
  bio: string;
  quote: string;
  experienceYears: number;
}

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: fallbackProfile.name,
    origin: fallbackProfile.origin,
    role: fallbackProfile.role,
    passion: fallbackProfile.passion,
    status: fallbackProfile.status,
    headline: "Frontend Developer",
    subHeadline: "Web Engineering & Database Management",
    bio: "Saya adalah murid SMK PGRI 3 MALANG yang berfokus pada pengelolaan database dan selalu berupaya memberikan solusi terbaik dalam setiap proyek yang saya kerjakan.",
    quote: "Leveraging AI as a professional tool, not a replacement.",
    experienceYears: 4,
  });
  const [projectCount, setProjectCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch(() => {});

    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjectCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});

    fetch("/api/certificates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCertificateCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  const codeSnippetPlain = `const developer = {
  name: '${profile.name}',
  origin: '${profile.origin}',
  role: '${profile.role}',
  passion: '${profile.passion}',
  status: '${profile.status}'
};`;

  const stats = [
    { index: "01", icon: Code2, value: String(projectCount), label: "Projects", sub: "Innovative web apps" },
    { index: "02", icon: Award, value: String(certificateCount), label: "Certificates", sub: "Skills validated" },
    { index: "03", icon: Clock, value: String(profile.experienceYears), suffix: "y", label: "Experience", sub: "Continuous learning" },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(codeSnippetPlain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }

  return (
    <section className="relative pt-6" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-surface-border bg-surface text-xs font-mono text-zinc-300 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{profile.origin.toUpperCase()}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">Tech Enthusiast</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter uppercase leading-[0.95] text-white">
              {profile.headline.split(" ")[0]}
              <br />
              <span className="text-zinc-500 hover:text-zinc-300 transition-colors duration-300">
                {profile.headline.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-mono text-zinc-300 flex items-center gap-2 pt-2">
              <span className="text-zinc-500">&gt;</span> {profile.subHeadline}
            </p>
          </div>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed font-normal">{profile.bio}</p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm tracking-tight hover:bg-zinc-200 transition-all duration-200 group"
              href="#projects"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-surface-border bg-surface text-zinc-300 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-all duration-200"
              href="#contact"
            >
              <span>Get in Touch</span>
              <Mail className="w-4 h-4 text-zinc-400" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 max-w-xl">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.index}
                  className="p-4 rounded-xl border border-surface-border bg-surface/80 hover:border-zinc-700 transition-all duration-200"
                >
                  <div className="flex justify-between items-center text-zinc-500 mb-2 font-mono text-xs">
                    <Icon className="w-4 h-4" />
                    <span>{stat.index}</span>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                    {stat.value}
                    {"suffix" in stat && stat.suffix && (
                      <span className="text-lg font-normal text-zinc-500">{stat.suffix}</span>
                    )}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{stat.sub}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="rounded-2xl border border-surface-border bg-surface-subtle overflow-hidden shadow-2xl relative">
            <div className="px-4 py-3 bg-surface border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <span className="ml-2 text-xs font-mono text-zinc-400">workspace.tsx</span>
              </div>
              <button
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded bg-zinc-800 hover:bg-zinc-700 transition-colors ${
                  copied ? "text-emerald-400" : "text-zinc-300"
                }`}
                onClick={handleCopy}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-zinc-300 font-code">
              <p>
                <span className="text-zinc-500">const</span> <span className="text-white font-semibold">developer</span> = {"{"}
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">name</span>: <span className="text-white">&apos;{profile.name}&apos;</span>,
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">origin</span>: <span className="text-white">&apos;{profile.origin}&apos;</span>,
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">role</span>: <span className="text-white">&apos;{profile.role}&apos;</span>,
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">passion</span>: <span className="text-white">&apos;{profile.passion}&apos;</span>,
              </p>
              <p className="pl-4">
                <span className="text-zinc-400">status</span>:{" "}
                <span className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-800/40">
                  &apos;{profile.status}&apos;
                </span>
              </p>
              <p>{"};"}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-surface-border bg-surface space-y-5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-white shadow-inner">
                <User className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Hello, I&apos;m {profile.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">{profile.origin.toUpperCase()}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{profile.bio}</p>
            <blockquote className="p-4 rounded-xl bg-black/60 border border-zinc-800/90 text-xs sm:text-sm font-mono text-zinc-300 italic border-l-2 border-l-white">
              &ldquo;{profile.quote}&rdquo;
            </blockquote>
            <a
              className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800/80 text-xs font-mono uppercase tracking-wider text-zinc-200 transition-colors"
              href="#projects"
            >
              <Code className="w-3.5 h-3.5" />
              <span>View Projects</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
