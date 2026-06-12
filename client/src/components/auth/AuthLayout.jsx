import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Leaf } from 'lucide-react';
import AuthBranding from './AuthBranding';
import { cn } from '@/lib/utils';

const STYLES = {
  // Main Layout Grid - Strict 100vh/100vw, no scroll
  layoutContainer: cn(
    "relative grid h-screen w-screen overflow-hidden bg-green-50/5",
    "lg:grid-cols-[4.5fr_5.5fr]"
  ),

  // Branding Side (45%)
  brandingSidebar: "relative z-10 h-full overflow-hidden",

  // Form Side (55%)
  formArea: "relative z-10 flex flex-col items-center justify-center p-4 lg:p-8 h-full min-h-0",

  // Mobile Top Bar
  mobileHeader: "mt-2 mb-6 flex shrink-0 items-center gap-3 lg:hidden",
  logoContainer: cn(
    "h-8 w-8 overflow-hidden rounded-lg bg-white p-1.5",
    "shadow-lg shadow-green-500/5 ring-1 ring-zinc-950/5"
  ),
  logoImage: "h-full w-full object-contain text-green-600",
  brandTitle: "text-xl font-black tracking-tighter text-zinc-950",

  // Header Typography (Tighter for 100vh)
  headerSection: "mb-6 text-center shrink-0",
  titleText: "text-3xl lg:text-4xl font-extrabold tracking-tighter text-zinc-950 mb-2",
  subtitleText: "font-mono-tight text-[9px] text-zinc-400 font-bold tracking-[0.15em] uppercase",

  // Structural Form Card
  formCard: cn(
    "w-full max-w-[480px] p-6 lg:p-8 rounded-[2.5rem]",
    "bg-white border border-zinc-100",
    "shadow-[0_30px_60px_-12px_rgba(0,0,0,0.04)]",
    "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out",
    "max-h-full overflow-y-auto no-scrollbar"
  ),

  // Footer Badge (Green Technical Chip)
  footer: "mt-8 shrink-0 flex justify-center",
  badge: cn(
    "flex items-center gap-2 px-3 py-1.5 rounded-full",
    "bg-green-100 border border-green-300/50",
    "font-mono-tight text-[8px] font-bold text-green-600 tracking-[0.1em]",
    "shadow-sm shadow-green-500/5"
  ),
  badgeIcon: "h-3 w-3 text-green-500"
};

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className={STYLES.layoutContainer}>
      {/* Visual Light Ambiance - Refined Green Ambiance */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[30%] w-[40%] h-[40%] bg-emerald-500/[0.02] rounded-full blur-[80px] pointer-events-none" />

      {/* Left Column: Cinematic Branding (45%) */}
      <aside className={STYLES.brandingSidebar}>
        <AuthBranding />
      </aside>

      {/* Right Column: Form Stack (55%) */}
      <main className={STYLES.formArea}>
        {/* Mobile Logo Block */}
        <div className={STYLES.mobileHeader}>
          <div className={STYLES.logoContainer}>
            <Leaf className={STYLES.logoImage} />
          </div>
          <span className={STYLES.brandTitle}>ACo2</span>
        </div>

        {/* Header Text Stack */}
        <div className={STYLES.headerSection}>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={STYLES.titleText}
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={STYLES.subtitleText}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* The Structural Form Card */}
        <div className={STYLES.formCard}>
          {children}
        </div>

        {/* Security Footer Badge */}
        <footer className={STYLES.footer}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={STYLES.badge}
          >
            <Shield className={STYLES.badgeIcon} />
            SECURELY ENCRYPTED BY ACO2 SHIELD
          </motion.div>
        </footer>
      </main>
    </div>
  );
};
