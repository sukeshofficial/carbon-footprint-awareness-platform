import React from 'react';
import { Zap } from 'lucide-react';

const HabitExplanationCallout = ({ habit, reason }) => {
  return (
    <div className="group relative overflow-hidden bg-slate-900 text-white rounded-xl p-4 shadow-lg">
      <div className="absolute top-0 right-0 -m-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Zap size={100} className="rotate-12" />
      </div>

      <div className="relative flex gap-3">
        <div className="mt-1 p-1.5 bg-amber-400 rounded-lg text-slate-900">
          <Zap size={16} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1 block">
            Kye Impact Habit
          </span>
          <h4 className="font-bold text-lg mb-2 capitalize">{habit}</h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {reason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitExplanationCallout;
