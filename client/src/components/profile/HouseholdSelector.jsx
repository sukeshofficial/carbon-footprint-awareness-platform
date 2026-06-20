import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../ui/card';
import { HOUSEHOLD_TYPES_LIST } from './constants';
import { cn } from '../../lib/utils';

const HouseholdSelector = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {HOUSEHOLD_TYPES_LIST.map((type) => (
        <button
          key={type.id}
          type="button"
          className={cn(
            "px-3 sm:px-4 py-2 rounded-full border text-[10px] sm:text-xs font-bold transition-all duration-200",
            selected === type.id
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-muted-foreground border-border hover:border-primary/30"
          )}
          onClick={() => onChange(type.id)}
        >
          {type.title}
        </button>
      ))}
    </div>
  );
};

HouseholdSelector.propTypes = {
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};

HouseholdSelector.defaultProps = {
  selected: null,
};

export default HouseholdSelector;
