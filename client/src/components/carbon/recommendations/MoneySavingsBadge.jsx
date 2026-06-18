import React from 'react';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import { IndianRupee } from 'lucide-react';

const MoneySavingsBadge = ({ amount, className = "" }) => {
  if (!amount || amount === 0) return null;

  return (
    <Badge className={cn("px-2 py-0.5 font-black uppercase text-[9px] tracking-widest flex items-center gap-1 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20", className)}>
      <IndianRupee size={10} />
      Save ₹{amount}
    </Badge>
  );
};

export default MoneySavingsBadge;
