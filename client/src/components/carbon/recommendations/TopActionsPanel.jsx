import React from 'react';
import PropTypes from 'prop-types';
import RecommendationCard from './RecommendationCard';
import { Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';

const actionShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  impactScore: PropTypes.number,
  effortLevel: PropTypes.string,
  moneySavedEstimate: PropTypes.number,
});

const TopActionsPanel = ({
  actions = [],
  onAccept,
  onDismiss,
  className = '',
}) => {
  if (actions.length === 0) return null;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Sparkles size={20} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
            Top Priority
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
            Recommended for You
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <RecommendationCard
            key={action._id}
            recommendation={action}
            onAccept={onAccept}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
};

TopActionsPanel.propTypes = {
  actions: PropTypes.arrayOf(actionShape),
  onAccept: PropTypes.func,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};

export default TopActionsPanel;