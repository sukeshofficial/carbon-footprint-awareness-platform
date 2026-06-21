import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, Timer } from 'lucide-react';
import PropTypes from 'prop-types';
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
  // Calculate progress
  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent =
    checklist.length > 0
      ? Math.round((completedCount / checklist.length) * 100)
      : 0;

  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 space-y-4 animate-pulse",
          isCompact ? "max-w-xs" : "w-full max-w-4xl"
        )}
      >
        <div className="h-6 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md" />

        <div className="space-y-2 pt-2">
          {["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
            <div
              key={id}
              className="h-3 w-3/4 bg-zinc-50 dark:bg-zinc-800/50 rounded-md"
            />
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
        "group bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-100 dark:border-zinc-800/50 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-green-900/5 dark:hover:shadow-black/20 transition-all duration-300",
        isCompact ? "p-4 max-w-xs" : "p-4 sm:p-5 lg:p-7 w-full max-w-3xl"
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            {title}
          </h3>
        </div>

        {!isCompact && (
          <div
            className="self-start shrink-0 px-2 py-1 sm:px-3 sm:py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
            aria-label={`Status: ${status}`}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            {status}
          </div>
        )}
      </div>

      {/* Description */}
      {!isCompact && (
        <p className="text-zinc-900 dark:text-zinc-300 text-[13px] font-medium leading-relaxed mb-4 max-w-lg">
          {description}
        </p>
      )}

      {/* Checklist */}
      <div
        className={cn(
          "grid gap-x-6 gap-y-2 mb-5",
          isCompact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        )}
      >
        {checklist.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 group/item"
          >
            {item.completed ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-zinc-200 shrink-0" />
            )}

            <span
              className={cn(
                "text-[13px] font-medium transition-colors",
                item.completed
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400 dark:text-zinc-500"
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <span className="block font-mono-tight text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {phase}
            </span>
            <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Completion
            </span>
          </div>

          <span className="text-2xl font-black text-green-600 tracking-tighter">
            {progressPercent}%
          </span>
        </div>

        <div className="relative w-full">
          <div
            className="h-2 w-full rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800"
            data-value={progressPercent}
            data-max={100}
            aria-label={`Project completion ${progressPercent}%`}
          />

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
        {nextMilestone && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800">
              <Loader2 className="h-4 w-4 animate-spin-slow" />
            </div>

            <div className="flex flex-col">
              <span className="font-mono-tight text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                Next Milestone
              </span>
              <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                {nextMilestone}
              </span>
            </div>
          </div>
        )}

        {updatedAt && (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Timer className="h-3 w-3" />
            <span className="text-[10px] font-medium tracking-tight">
              Last updated: {updatedAt}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

CurrentDevelopmentCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
  checklist: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ),
  status: PropTypes.string.isRequired,
  nextMilestone: PropTypes.string,
  updatedAt: PropTypes.string,
  isCompact: PropTypes.bool,
  isLoading: PropTypes.bool,
};

CurrentDevelopmentCard.defaultProps = {
  checklist: [],
  nextMilestone: undefined,
  updatedAt: undefined,
  isCompact: false,
  isLoading: false,
};

export default CurrentDevelopmentCard;
