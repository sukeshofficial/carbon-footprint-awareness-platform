import React from 'react';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import { TrendingDown } from 'lucide-react';

const ImpactBadge = ({ score, className = "" }) => {
  const getLevel = (s) => {
    if (s >= 8) return 'High Impact';
    if (s >= 5) return 'Medium';
    return 'Supporting';
  };

  const getColor = (s) => {
    if (s >= 8) return 'text-primary bg-primary/10 border-primary/20';
    if (s >= 5) return 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400 border-sky-100 dark:border-sky-500/20';
    return 'text-slate-500 bg-slate-50 dark:bg-slate-500/10 dark:text-slate-400 border-slate-100 dark:border-slate-500/20';
  };

  return (
    <Badge className={cn("px-2 py-0.5 font-black uppercase text-[9px] tracking-widest flex items-center gap-1", getColor(score), className)}>
      <TrendingDown size={10} />
      {getLevel(score)}
    </Badge>
  );
};

export default ImpactBadge;
