import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

const LifestyleStep = ({ data, onChange }) => {
  const cityTypes = [
    { value: 'metropolitan', label: 'Metropolitan' },
    { value: 'tier_1', label: 'Tier 1' },
    { value: 'tier_2', label: 'Tier 2' },
    { value: 'rural', label: 'Rural' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <Label className="text-sm font-bold">City Type</Label>
        <div className="flex flex-wrap gap-2">
          {cityTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange({ ...data, cityType: type.value })}
              className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                data.cityType === type.value
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="householdSize" className="text-sm font-bold">Household Size (Total People)</Label>
        <Input
          id="householdSize"
          type="number"
          min="1"
          className="h-11 rounded-full border-zinc-200 dark:border-zinc-800 bg-background dark:bg-zinc-900/50 focus-visible:ring-primary/20"
          placeholder="How many people share your home?"
          value={data.householdSize || ''}
          // Sonar S2737: use Number.parseInt instead of global parseInt
          onChange={(e) => onChange({ ...data, householdSize: Number.parseInt(e.target.value, 10) || 0 })}
        />
      </div>
    </div>
  );
};

export default LifestyleStep;
