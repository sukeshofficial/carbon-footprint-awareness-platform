/**
 * ScenarioCard.jsx
 * A clickable card showing a scenario template overview.
 */

import React from 'react';
import { Bus, Leaf, Zap, ShoppingBag, Bike, Train } from 'lucide-react';
import { cn } from '../../../lib/utils';
import DifficultyBadge from './DifficultyBadge';

const ICONS = {
  transport: Train,
  food: Leaf,
  energy: Zap,
  shopping: ShoppingBag,
};

const TYPE_COLORS = {
  transport: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  food: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  energy: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  shopping: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function ScenarioCard({ template, isSelected, onClick }) {
  const Icon = ICONS[template.type] ?? Leaf;
  const colorClass = TYPE_COLORS[template.type] ?? TYPE_COLORS.food;

  return (
    <button
      onClick={() => onClick(template)}
      className={cn(
        'w-full text-left p-5 rounded-2xl border transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary/50',
        isSelected
          ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
          : 'border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-primary/30 hover:shadow-sm'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight">{template.title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">{template.description}</p>
          <div className="mt-3">
            <DifficultyBadge level={template.difficulty} />
          </div>
        </div>
      </div>
    </button>
  );
}
