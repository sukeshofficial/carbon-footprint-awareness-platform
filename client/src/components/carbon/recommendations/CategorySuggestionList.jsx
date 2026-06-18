import React from 'react';
import RecommendationCard from './RecommendationCard';
import { Car, Utensils, Zap, ShoppingBag } from 'lucide-react';
import { cn } from '../../../lib/utils';

const CategorySuggestionList = ({
  categorySuggestions,
  activeFilter = 'all',
  onAccept,
  onDismiss,
  className = ""
}) => {
  const categories = [
    { id: 'transport', label: 'Transport', icon: Car, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { id: 'food', label: 'Food', icon: Utensils, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30' },
    { id: 'energy', label: 'Energy', icon: Zap, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
  ];

  const filterActions = (actions) => {
    if (!actions) return [];
    if (activeFilter === 'all') return actions;
    if (activeFilter === 'impact') return actions.filter(a => a.impactScore >= 7);
    if (activeFilter === 'effort') return actions.filter(a => a.effortLevel === 'low');
    if (activeFilter === 'savings') return actions.filter(a => a.moneySavedEstimate > 300);
    return actions;
  };

  return (
    <div className="space-y-10">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const allActions = categorySuggestions[cat.id] || [];
        const actions = filterActions(allActions);

        if (allActions.length === 0) return null;

        return (
          <div key={cat.id} className={cn("space-y-4", actions.length === 0 && "opacity-40")}>
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", cat.color)}>
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100 tracking-tight">{cat.label} Suggestions</h3>
            </div>

            {actions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actions.map((action) => (
                  <RecommendationCard
                    key={action._id}
                    recommendation={action}
                    onAccept={onAccept}
                    onDismiss={onDismiss}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 px-6 bg-slate-50 dark:bg-zinc-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-zinc-700 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching recommendations in this category</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategorySuggestionList;
