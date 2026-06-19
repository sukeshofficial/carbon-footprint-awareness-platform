import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui/button';

const WeeklyMonthlyToggle = ({ view, onChange }) => {
  return (
    <div className="flex bg-slate-100 p-1 rounded-full">
      <Button
        variant={view === 'weekly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('weekly')}
        className={`px-4 py-1.5 h-auto text-xs font-medium rounded-full transition-all ${view === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
      >
        Weekly
      </Button>
      <Button
        variant={view === 'monthly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('monthly')}
        className={`px-4 py-1.5 h-auto text-xs font-medium rounded-full transition-all ${view === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
      >
        Monthly
      </Button>
    </div>
  );
};

WeeklyMonthlyToggle.propTypes = {
  view: PropTypes.oneOf(['weekly', 'monthly']).isRequired,
  onChange: PropTypes.func.isRequired
};

export default WeeklyMonthlyToggle;
