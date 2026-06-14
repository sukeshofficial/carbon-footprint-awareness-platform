import React from 'react';
import { Badge } from '../ui/badge';

const SeverityBadge = ({ level }) => {
  const config = {
    low: { label: 'Low', className: 'bg-green-100 text-green-800 border-green-200' },
    medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    high: { label: 'High', className: 'bg-red-100 text-red-800 border-red-200' },
    unknown: { label: 'Unknown', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  };

  const { label, className } = config[level?.toLowerCase()] || config.unknown;

  return (
    <Badge variant="outline" className={`font-medium ${className}`}>
      {label}
    </Badge>
  );
};

export default SeverityBadge;
