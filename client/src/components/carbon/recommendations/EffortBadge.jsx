import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import { Zap } from 'lucide-react';

const EffortBadge = ({ level = 'medium', className = '' }) => {
  const config = {
    low: {
      label: 'Easy Win',
      variant: 'secondary',
      color:
        'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
    },
    medium: {
      label: 'Moderate',
      variant: 'secondary',
      color:
        'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
    },
    high: {
      label: 'Big Change',
      variant: 'secondary',
      color:
        'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
    },
  };

  const normalizedLevel = String(level).toLowerCase();
  const { label, color } = config[normalizedLevel] || config.medium;

  return (
    <Badge
      className={cn(
        'px-2 py-0.5 font-black uppercase text-[9px] tracking-widest flex items-center gap-1',
        color,
        className
      )}
    >
      <Zap size={10} className="fill-current" />
      {label}
    </Badge>
  );
};

EffortBadge.propTypes = {
  level: PropTypes.oneOf(['low', 'medium', 'high']),
  className: PropTypes.string,
};

export default EffortBadge;