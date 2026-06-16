import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const ExpandableExplanation = ({ title, description, children, defaultExpanded = false, icon: Icon = Info }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="mt-1 p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 text-sm md:text-base">{title}</h4>
          <p className="text-slate-500 text-xs md:text-sm mt-1 line-clamp-1">{description}</p>
        </div>
        <div className="mt-1 text-slate-400">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
          <div className="pl-14 text-slate-600 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableExplanation;
