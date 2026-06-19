import React from 'react';
import PropTypes from 'prop-types';

function getConfig(score) {
  if (score >= 75) {
    return {
      label: 'High Confidence',
      color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400'
    };
  }
  if (score >= 50) {
    return {
      label: 'Medium Confidence',
      color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400'
    };
  }
  return {
    label: 'Low Confidence',
    color: 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
  };
}

export default function ConfidenceBadge({ score }) {
  const safeScore = score ?? 50;
  const cfg = getConfig(safeScore);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}
    >
      ~{score ?? '?'}% {cfg.label}
    </span>
  );
}

ConfidenceBadge.propTypes = {
  score: PropTypes.number
};

ConfidenceBadge.defaultProps = {
  score: 50
};