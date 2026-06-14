import React from 'react';
import { Button } from '../ui/button';

const WeeklyMonthlyToggle = ({ view, onChange }) => {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg">
      <Button
        variant={view === 'weekly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('weekly')}
        className={`px-4 py-1.5 h-auto text-xs font-medium rounded-md transition-all ${view === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
      >
        Weekly
      </Button>
      <Button
        variant={view === 'monthly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('monthly')}
        className={`px-4 py-1.5 h-auto text-xs font-medium rounded-md transition-all ${view === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
      >
        Monthly
      </Button>
    </div>
  );
};

export default WeeklyMonthlyToggle;
