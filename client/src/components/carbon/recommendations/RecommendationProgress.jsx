import React from 'react';
import PropTypes from 'prop-types';
import { Leaf, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const historyItemShape = PropTypes.shape({
  status: PropTypes.string,
  co2SavedEstimate: PropTypes.number,
});

const RecommendationProgress = ({ history = [], className = '' }) => {
  const completed = history.filter((h) => h.status === 'completed');

  const co2Saved = completed.reduce(
    (acc, curr) => acc + (curr.co2SavedEstimate || 0),
    0
  );

  const visibleBadges = new Array(Math.min(completed.length, 3))
    .fill(null);

  return (
    <div
      className={cn(
        'bg-emerald-600 dark:bg-emerald-500 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
          <Leaf size={24} className="fill-current" />
        </div>

        <div className="space-y-0.5">
          <h3 className="text-sm font-black uppercase tracking-widest opacity-80">
            Action Progress
          </h3>

          <p className="text-2xl font-black tracking-tight leading-none">
            {completed.length}{' '}
            <span className="text-xs uppercase opacity-80">
              Actions Completed
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
            Total CO₂ Saved
          </p>
          <p className="text-xl font-black">
            ~{co2Saved.toFixed(1)} kg
          </p>
        </div>

        <div className="flex -space-x-2">
          {visibleBadges.map((_, index) => (
            <div
              key={`completed-badge-${completed[index]?._id || index}`}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border-2 border-emerald-600 flex items-center justify-center"
            >
              <CheckCircle2 size={14} />
            </div>
          ))}

          {completed.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border-2 border-emerald-600 flex items-center justify-center text-[10px] font-black">
              +{completed.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

RecommendationProgress.propTypes = {
  history: PropTypes.arrayOf(historyItemShape),
  className: PropTypes.string,
};

export default RecommendationProgress;