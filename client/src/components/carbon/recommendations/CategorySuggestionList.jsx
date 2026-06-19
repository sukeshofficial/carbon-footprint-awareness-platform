import React from 'react';
import PropTypes from 'prop-types';
import RecommendationCard from './RecommendationCard';
import { Car, Utensils, Zap, ShoppingBag } from 'lucide-react';
import { cn } from '../../../lib/utils';

const actionShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  impactScore: PropTypes.number,
  effortLevel: PropTypes.string,
  moneySavedEstimate: PropTypes.number,
});

const CategorySuggestionList = ({
  categorySuggestions = {},
  activeFilter = 'all',
  onAccept,
  onDismiss,
  className = '',
}) => {
  const categories = [
    {
      id: 'transport',
      label: 'Transport',
      icon: Car,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30',
    },
    {
      id: 'food',
      label: 'Food',
      icon: Utensils,
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30',
    },
    {
      id: 'energy',
      label: 'Energy',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: ShoppingBag,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30',
    },
  ];

  const filterActions = (actions = []) => {
    if (activeFilter === 'all') return actions;

    if (activeFilter === 'impact') {
      return actions.filter((a) => a.impactScore >= 7);
    }

    if (activeFilter === 'effort') {
      return actions.filter((a) => a.effortLevel === 'low');
    }

    if (activeFilter === 'savings') {
      return actions.filter((a) => a.moneySavedEstimate > 300);
    }

    return actions;
  };

  return (
    <div className={cn('space-y-12', className)}>
      {categories.map((cat) => {
        const Icon = cat.icon;
        const allActions = categorySuggestions?.[cat.id] || [];
        const actions = filterActions(allActions);

        if (allActions.length === 0) return null;

        return (
          <div
            key={cat.id}
            className={cn(
              'space-y-6',
              actions.length === 0 && 'opacity-40'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center',
                    cat.color
                  )}
                >
                  <Icon size={20} />
                </div>

                <h3 className="text-xl font-black text-slate-800 dark:text-zinc-100 tracking-tight">
                  {cat.label} Suggestions
                </h3>
              </div>

              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {actions.length}{' '}
                {actions.length === 1 ? 'Action' : 'Actions'} available
              </div>
            </div>

            <div className="relative">
              <div className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-6 no-scrollbar snap-x">
                {actions.length > 0 ? (
                  actions.map((action) => (
                    <div
                      key={action._id}
                      className="min-w-[320px] md:min-w-[400px] snap-start"
                    >
                      <RecommendationCard
                        recommendation={action}
                        onAccept={onAccept}
                        onDismiss={onDismiss}
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full py-12 px-6 bg-slate-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-zinc-700 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      No matching recommendations in this category
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

CategorySuggestionList.propTypes = {
  categorySuggestions: PropTypes.shape({
    transport: PropTypes.arrayOf(actionShape),
    food: PropTypes.arrayOf(actionShape),
    energy: PropTypes.arrayOf(actionShape),
    shopping: PropTypes.arrayOf(actionShape),
  }).isRequired,
  activeFilter: PropTypes.oneOf([
    'all',
    'impact',
    'effort',
    'savings',
  ]),
  onAccept: PropTypes.func,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};

export default CategorySuggestionList;