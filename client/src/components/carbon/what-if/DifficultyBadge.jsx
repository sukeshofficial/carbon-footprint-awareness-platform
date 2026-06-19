import React from 'react';
import PropTypes from 'prop-types';

const configs = {
  easy: {
    label: 'Easy',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  hard: {
    label: 'Hard',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

export default function DifficultyBadge({ level }) {
  const cfg = configs[level] ?? configs.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

DifficultyBadge.propTypes = {
  level: PropTypes.oneOf(['easy', 'medium', 'hard']),
};

DifficultyBadge.defaultProps = {
  level: 'medium',
};