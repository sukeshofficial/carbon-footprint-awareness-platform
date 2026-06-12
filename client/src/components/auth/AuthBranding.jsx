import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Globe2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const BrandingData = {
  hero: {
    badge: "ACo2 Intelligence v2.0",
    title: ["Measure.", "Learn.", "Optimize."],
    description: "ACo2 helps organizations and individuals build, track, and optimize their sustainable future in the most modern ecosystem."
  },
  stats: [
    { label: "Community", value: "Join 50k+ activists", icon: Users },
    { label: "Impact", value: "2.4M Tons Offset", icon: Globe2 }
  ],
  testimonial: {
    quote: "The best way to save the planet is to build the tools that empower everyone to do it. ACo2 is that platform.",
    author: "Sukesh D",
    role: "Founder of ACo2"
  }
};

const STYLES = {
  container: "relative h-full w-full bg-green-50/20 flex flex-col p-8 lg:p-12 overflow-hidden",

  // High-End Background System
  background: {
    wrapper: "absolute inset-0 pointer-events-none overflow-hidden",
    orb1: "absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-green-500/[0.04] rounded-full blur-[120px]",
    orb2: "absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/[0.03] rounded-full blur-[100px]"
  },

  // Content Sections
  header: "relative z-10 shrink-0",
  logo: "flex items-center gap-2 mb-4 lg:mb-4",
  main: "relative z-10 flex-1 flex flex-col justify-center",
  footer: "relative z-10 mt-auto shrink-0",

  // Typography
  badge: "inline-flex items-center px-2 py-1 rounded-md bg-green-600/5 border border-green-600/10 text-[9px] font-mono-tight font-bold text-green-600 uppercase tracking-widest mb-6",
  heroTitle: "text-6xl lg:text-6xl font-black tracking-tighter leading-[0.85] text-zinc-950 space-y-0.5 mb-4",
  heroDesc: "text-sm lg:text-base text-zinc-500 font-medium max-w-sm leading-relaxed",

  // Stats Grid
  statsGrid: "grid grid-cols-2 gap-x-12 gap-y-4 mt-8 pt-8 border-t border-zinc-200/50",
  statItem: "flex flex-col gap-0.5",
  statLabel: "font-mono-tight text-[8px] text-zinc-400 font-bold uppercase tracking-wider",
  statValue: "text-[12px] font-bold text-zinc-900 flex items-center gap-1.5",

  // Testimonial Area
  testimonialCard: "mt-8",
  quoteText: "text-xs italic text-zinc-400 font-medium leading-relaxed max-w-xs mb-3",
  authorStack: "flex flex-col",
  authorName: "text-[10px] font-bold text-zinc-900 tracking-wide",
  authorRole: "text-[9px] font-mono-tight text-zinc-400 uppercase font-medium"
};

const AuthBranding = () => {
  return (
    <div className={STYLES.container}>
      {/* Refined Subtle Background */}
      <div className={STYLES.background.wrapper}>
        <div className={STYLES.background.orb1} />
        <div className={STYLES.background.orb2} />
      </div>

      {/* Header: Logo */}
      <div className={STYLES.header}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={STYLES.logo}
        >
          <div className="h-8 w-8 bg-white rounded-lg shadow-lg shadow-green-500/5 ring-1 ring-zinc-950/5 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-xl font-black tracking-tighter text-zinc-950">ACo2</span>
        </motion.div>
      </div>

      {/* Main Content: Hero + Stats */}
      <div className={STYLES.main}>
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={STYLES.badge}
          >
            {BrandingData.hero.badge}
          </motion.div>

          <div className={STYLES.heroTitle}>
            {BrandingData.hero.title.map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
                className={i === 2 ? "text-green-600" : ""}
              >
                {word}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={STYLES.heroDesc}
          >
            {BrandingData.hero.description}
          </motion.p>

          {/* Technical Stats Grid */}
          <div className={STYLES.statsGrid}>
            {BrandingData.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className={STYLES.statItem}
              >
                <span className={STYLES.statLabel}>{stat.label}</span>
                <span className={STYLES.statValue}>
                  {stat.value}
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                </span>
              </motion.div>
            ))}
          </div>

          {/* Footer: Testimonial Integrated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={STYLES.testimonialCard}
          >
            <p className={STYLES.quoteText}>“{BrandingData.testimonial.quote}”</p>
            <div className={STYLES.authorStack}>
              <span className={STYLES.authorName}>— {BrandingData.testimonial.author}</span>
              <span className={STYLES.authorRole}>{BrandingData.testimonial.role}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthBranding;
