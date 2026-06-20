import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../ui/card';
import { TONE_PREFERENCES_LIST } from './constants';
import { cn } from '../../lib/utils';

const ToneSelector = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {TONE_PREFERENCES_LIST.map((tone) => (
        <Card
          key={tone.id}
          className={cn(
            'cursor-pointer transition-all duration-200 hover:border-primary/50 group',
            selected === tone.id ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-md' : 'border-border'
          )}
          onClick={() => onChange(tone.id)}
        >
          <CardContent className="p-5 flex flex-col gap-2 text-center h-full items-center justify-center">
            <h4 className={cn(
              "font-bold text-sm transition-colors",
              selected === tone.id ? "text-primary" : "text-foreground"
            )}>{tone.title}</h4>
            <p className="text-[10px] leading-relaxed text-muted-foreground">{tone.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

ToneSelector.propTypes = {
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ToneSelector;
