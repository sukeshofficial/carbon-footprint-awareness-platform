import React from 'react';
import PropTypes from 'prop-types';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

const RecommendationReasoning = ({ reason }) => {
  if (!reason) return null;

  return (
    <div className="mt-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg flex gap-3 animate-in fade-in slide-in-from-left-2">
      <div className="mt-0.5 text-emerald-600">
        <Lightbulb size={16} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">Why this matters</span>
          <CheckCircle2 size={10} className="text-emerald-500" />
        </div>
        <p className="text-emerald-900 text-sm font-normal leading-relaxed">
          {reason}
        </p>
      </div>
    </div>
  );
};

RecommendationReasoning.propTypes = {
  reason: PropTypes.string
};

export default RecommendationReasoning;
