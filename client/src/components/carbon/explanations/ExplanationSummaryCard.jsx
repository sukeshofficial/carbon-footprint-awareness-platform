import React from 'react';
import PropTypes from 'prop-types';
import { Leaf, AlertCircle, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const ExplanationSummaryCard = ({ summary, trend, dominantCategory }) => {
  const getIcon = () => {
    switch (trend) {
      case 'improved': return <TrendingDown className="text-emerald-500" size={24} />;
      case 'increased': return <TrendingUp className="text-rose-500" size={24} />;
      case 'stable': return <Minus className="text-blue-500" size={24} />;
      default: return <Leaf className="text-indigo-500" size={24} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-4xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white rounded-xl border border-indigo-100">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Footprint Analysis</h3>
          <p className="text-indigo-600 text-xs font-medium uppercase tracking-wider">
            {dominantCategory ? `${dominantCategory} Driven` : 'Overview'}
          </p>
        </div>
      </div>

      <p className="text-slate-700 text-sm font-normal leading-relaxed">
        {summary || "Calculating your personalized carbon footprint breakdown..."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/50 border border-indigo-100 rounded-full text-[10px] font-medium text-indigo-700 uppercase tracking-tight">
          <AlertCircle size={14} />
          Rule-Based Insight
        </span>
      </div>
    </div>
  );
};

ExplanationSummaryCard.propTypes = {
  summary: PropTypes.string,
  trend: PropTypes.oneOf(['improved', 'increased', 'stable']),
  dominantCategory: PropTypes.string,
};

export default ExplanationSummaryCard;
