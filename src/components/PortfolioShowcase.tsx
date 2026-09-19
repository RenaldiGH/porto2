"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Award } from "lucide-react";
import { skillBadges } from "@/data/content";

type TabId = "projects" | "certificates" | "stack";

const tabs: { id: TabId; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "stack", label: "Tech Stack" },
];

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  repoUrl: string | null;
  footnote: string | null;
  technologies: { id: string; name: string }[];
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  credentialUrl: string | null;
}

const statusLabel: Record<string, string> = {
  IN_PRODUCTION: "In Production",
  INTERNAL_TOOL: "Internal Tool",
  ARCHIVED: "Archived",
  PLANNED: "Planned",
};

export default function PortfolioShowcase() {
  const [active, setActive] = useState<TabId>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/certificates").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([projectsData, certificatesData]) => {
        setProjects(projectsData);
        setCertificates(certificatesData);
      })
      .catch(() => {
        setProjects([]);
        setCertificates([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-8 scroll-mt-24" id="projects">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-white">
          Portfolio Showcase
        </h2>
        <p className="text-sm text-zinc-400 font-mono">
          Explore my journey through projects, certifications, and technical expertise.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl border border-surface-border bg-surface">
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`relative px-6 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-colors duration-150 ${
                  isActive ? "text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-white rounded-lg shadow"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {active === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {!loading && projects.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-10">Belum ada proyek yang ditampilkan.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => {
                  const isLive = project.status === "IN_PRODUCTION";
                  return (
                    <div
                      key={project.id}
                      className="p-6 sm:p-8 rounded-2xl border border-surface-border bg-surface hover:border-zinc-500 transition-all duration-200 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                isLive ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"
                              }`}
                            />
                            <h3 className="text-xl font-bold text-white tracking-tight font-mono">{project.name}</h3>
                          </div>
                          <span
                            className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                              isLive
                                ? "text-zinc-300 border-zinc-700 bg-zinc-900"
                                : "text-zinc-400 border-zinc-800 bg-zinc-900/50"
                            }`}
                          >
                            {statusLabel[project.status] ?? project.status}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{project.description}</p>
                      </div>
                      <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech.id}
                              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                        {project.repoUrl ? (
                          <a
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white hover:text-zinc-300 transition-colors group"
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Code</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        ) : (
                          <div className="flex items-center text-xs font-mono text-zinc-500">
                            <span>{project.footnote}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {active === "certificates" && (
          <motion.div
            key="certificates"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {!loading && certificates.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-surface/50 max-w-xl mx-auto space-y-3">
                <Award className="w-8 h-8 mx-auto text-zinc-600" />
                <h4 className="text-base font-bold text-zinc-300 font-mono">Certificates in Preparation</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Certifications and technical validations are currently being compiled and will be published shortly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {certificates.map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.credentialUrl ?? undefined}
                    target={cert.credentialUrl ? "_blank" : undefined}
                    rel={cert.credentialUrl ? "noopener noreferrer" : undefined}
                    className={`p-5 rounded-2xl border border-surface-border bg-surface flex items-start gap-3 ${
                      cert.credentialUrl ? "hover:border-zinc-500 transition-colors" : ""
                    }`}
                  >
                    <Award className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">{cert.issuer}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {active === "stack" && (
          <motion.div
            key="stack"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-8 rounded-2xl border border-surface-border bg-surface text-center max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-bold text-white font-mono uppercase">Full Technical Profile</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                Focusing on Next.js, React 18, Strict TypeScript, Tailwind CSS, PostgreSQL Relational Database
                Engineering, Prisma ORM, Git Architecture, and Linux Environments.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {skillBadges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 bg-black border border-zinc-800 text-xs font-mono text-zinc-300 rounded-md"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
