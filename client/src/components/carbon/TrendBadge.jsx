import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../ui/badge';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const TrendBadge = ({ trend }) => {
  const config = {
    improved: { label: 'Improved', color: 'text-green-600', bg: 'bg-green-50', icon: TrendingDown },
    stable: { label: 'Stable', color: 'text-blue-600', bg: 'bg-blue-50', icon: Minus },
    increased: { label: 'Increased', color: 'text-red-600', bg: 'bg-red-50', icon: TrendingUp },
    new: { label: 'New', color: 'text-purple-600', bg: 'bg-purple-50', icon: null },
  };

  const { label, color, bg, icon: Icon } = config[trend?.toLowerCase()] || config.new;

  return (
    <Badge variant="secondary" className={`${bg} ${color} flex items-center gap-1 px-2 py-0.5 border-none font-medium`}>
      {Icon && <Icon size={14} />}
      {label}
    </Badge>
  );
};

TrendBadge.propTypes = {
  trend: PropTypes.string
};

export default TrendBadge;
