import React from 'react';
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
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-50">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Footprint Analysis</h3>
          <p className="text-indigo-600 text-sm font-medium uppercase tracking-wider">
            {dominantCategory ? `${dominantCategory} Driven` : 'Overview'}
          </p>
        </div>
      </div>

      <p className="text-slate-700 text-lg font-medium leading-relaxed">
        {summary || "Calculating your personalized carbon footprint breakdown..."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700">
          <AlertCircle size={14} />
          Rule-Based Insight
        </span>
      </div>
    </div>
  );
};

export default ExplanationSummaryCard;
