import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Leaf } from 'lucide-react';
import AuthBranding from './AuthBranding';
import { cn } from '@/lib/utils';

const STYLES = {
  // Main Layout Grid - Fluid and Responsive
  layoutContainer: cn(
    "relative w-full overflow-x-hidden bg-green-50/5 dark:bg-zinc-950",
    "min-h-[100dvh] overflow-y-auto", // Mobile behavior
    "lg:h-screen lg:w-screen lg:min-h-0 lg:overflow-hidden", // Desktop behavior lock
    "flex flex-col lg:grid lg:grid-cols-[4.5fr_5.5fr] xl:grid-cols-[4fr_6fr]"
  ),

  // Branding Side (Hidden on Mobile, Visible on Desktop)
  brandingSidebar: "hidden lg:block relative z-10 h-full overflow-hidden border-r-2 border-dashed border-zinc-200/50 dark:border-zinc-800/50",

  // Form Side (Adapts from Mobile to Desktop)
  formArea: cn(
    "relative z-10 flex w-full flex-col items-center justify-center p-4 sm:p-8 md:p-12",
    "flex-1 min-h-[100dvh] lg:min-h-0 lg:h-full lg:overflow-hidden"
  ),

  // Mobile Top Bar
  mobileHeader: "mt-4 mb-8 flex w-full max-w-[420px] shrink-0 items-center justify-center gap-3 lg:hidden",
  logoContainer: cn(
    "h-10 w-10 overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-2 flex items-center justify-center",
    "shadow-lg shadow-green-500/10 ring-1 ring-zinc-950/5 dark:ring-zinc-800"
  ),
  logoImage: "h-full w-full object-contain text-green-600",
  brandTitle: "text-2xl font-black tracking-tighter text-zinc-950 dark:text-zinc-50",

  // Header Typography
  headerSection: "mb-6 lg:mb-8 text-center shrink-0 w-full max-w-[420px]",
  titleText: "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tighter text-zinc-950 dark:text-zinc-50 mb-2 leading-tight",
  subtitleText: "font-mono-tight text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-[0.1em] uppercase",

  // Structural Form Card
  formCard: cn(
    "w-full max-w-[420px] px-6 py-8 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem]",
    "bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-100 dark:border-zinc-800",
    "shadow-xl shadow-green-900/5 lg:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.04)]",
    "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
  ),

  // Footer Badge (Green Technical Chip)
  footer: "mt-8 shrink-0 flex justify-center w-full pb-8 lg:pb-0",
  badge: cn(
    "flex items-center gap-2 px-3 py-1.5 rounded-full",
    "bg-green-100 dark:bg-green-500/10 border border-green-300/50 dark:border-green-500/20",
    "font-mono-tight text-[9px] font-bold text-green-600 dark:text-green-400 tracking-[0.1em]",
    "shadow-sm shadow-green-500/5"
  ),
  badgeIcon: "h-3.5 w-3.5 text-green-500"
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
