import React from 'react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import { Filter, Zap, TrendingDown, IndianRupee } from 'lucide-react';

const RecommendationFilters = ({ activeFilter, onFilterChange, className = "" }) => {
  const filters = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'impact', label: 'High Impact', icon: TrendingDown },
    { id: 'effort', label: 'Easy Wins', icon: Zap },
    { id: 'savings', label: 'Top Savings', icon: IndianRupee },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;

        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-widest gap-2 transition-all duration-300",
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-lg"
                : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm"
            )}
          >
            <Icon size={12} className={cn(isActive ? "text-primary" : "text-slate-400")} />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};

export default RecommendationFilters;
