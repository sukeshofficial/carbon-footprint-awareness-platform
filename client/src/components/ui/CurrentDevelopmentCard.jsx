import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, ArrowRight, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @typedef {Object} ChecklistItem
 * @property {string} label
 * @property {boolean} completed
 */

/**
 * @param {Object} props
 * @param {string} props.title - Main card title (e.g., "🚧 In Development")
 * @param {string} props.description - Detailed description/subtitle
 * @param {string} props.phase - Current phase (e.g., "Phase 1 / 3")
 * @param {ChecklistItem[]} props.checklist - List of features and their status
 * @param {string} props.status - Status badge text (e.g., "Active Development")
 * @param {string} [props.nextMilestone] - Optional next milestone description
 * @param {string} [props.updatedAt] - Optional last updated time
 * @param {boolean} [props.isCompact] - If true, renders a tighter sidebar-friendly layout
 * @param {boolean} [props.isLoading] - If true, renders a shimmer skeleton state
 */
const CurrentDevelopmentCard = ({
  title,
  description,
  phase,
  checklist = [],
  status,
  nextMilestone,
  updatedAt,
  isCompact = false,
  isLoading = false,
}) => {
  // Derived progress
  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className={cn(
        "bg-white border border-zinc-100 rounded-3xl p-6 space-y-4 animate-pulse",
        isCompact ? "max-w-xs" : "w-full max-w-4xl"
      )}>
        <div className="h-6 w-1/3 bg-zinc-100 rounded-md" />
        <div className="h-4 w-full bg-zinc-100 rounded-md" />
        <div className="space-y-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 w-3/4 bg-zinc-50 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "group bg-white border border-zinc-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300",
        isCompact ? "p-4 max-w-xs" : "p-4 sm:p-5 lg:p-7 w-full max-w-3xl"
      )}
    >
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-black tracking-tight text-zinc-950 flex items-center gap-2">
            {title}
          </h3>
          {/* <p className={cn(
            "font-bold text-zinc-900 leading-tight",
            isCompact ? "text-sm sm:text-base" : "text-lg sm:text-xl lg:text-2xl"
          )}>
            {isCompact ? description.split('.')[0] : description}
          </p> */}
        </div>
        {!isCompact && (
          <div
            className="self-start shrink-0 px-2 py-1 sm:px-3 sm:py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
            aria-label={`Status: ${status}`}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            {status}
          </div>
        )}
      </div>

      {/* Description (Non-compact only or brief) */}
      {!isCompact && (
        <p className="text-zinc-900 text-[13px] font-medium leading-relaxed mb-4 max-w-lg">
          {description}
        </p>
      )}

      {/* Checklist Grid */}
      <div className={cn(
        "grid gap-x-6 gap-y-2 mb-5",
        isCompact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      )}>
        {checklist.map((item, index) => (
          <div key={index} className="flex items-center gap-2.5 group/item">
            {item.completed ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-zinc-200 shrink-0" />
            )}
            <span className={cn(
              "text-[13px] font-medium transition-colors",
              item.completed ? "text-zinc-900" : "text-zinc-400"
            )}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="space-y-2 mb-4">
        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <span className="block font-mono-tight text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{phase}</span>
            <span className="block text-sm font-bold text-zinc-900">Completion</span>
          </div>
          <span className="text-2xl font-black text-green-600 tracking-tighter">{progressPercent}%</span>
        </div>

        <div
          className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
            className="h-full bg-green-500 rounded-full"
          />
        </div>
      </div>

      {/* Footer / Milestone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100">
        {nextMilestone && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
              <Loader2 className="h-4 w-4 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono-tight text-[9px] font-bold text-zinc-400 uppercase">Next Milestone</span>
              <span className="text-[11px] font-bold text-zinc-900">{nextMilestone}</span>
            </div>
          </div>
        )}

        {updatedAt && (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Timer className="h-3 w-3" />
            <span className="text-[10px] font-medium tracking-tight">Last updated: {updatedAt}</span>
          </div>
        )}

        {/* <button className="flex items-center gap-1.5 text-green-600 hover:text-green-700 transition-colors">
          <span className="text-xs font-bold uppercase tracking-widest">Learn More</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button> */}
      </div>
    </motion.div>
  );
};

export default CurrentDevelopmentCard;
