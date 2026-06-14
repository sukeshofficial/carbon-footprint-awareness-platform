import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

const TransportStep = ({ data, onChange }) => {
  const modes = [
    { value: 'car', label: 'Car' },
    { value: 'bike', label: 'Bike' },
    { value: 'bus', label: 'Bus' },
    { value: 'metro', label: 'Metro' },
    { value: 'train', label: 'Train' },
    { value: 'cab', label: 'Cab' },
    { value: 'walking', label: 'Walking' },
  ];

  const handleModeSelect = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <Label className="text-sm font-bold">
          Primary Travel Mode <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => handleModeSelect('primaryMode', mode.value)}
              className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                data.primaryMode === mode.value
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-primary/30 dark:hover:border-primary/50"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-bold">Secondary Travel Mode (Optional)</Label>
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => handleModeSelect('secondaryMode', mode.value)}
              className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                data.secondaryMode === mode.value
                  ? "bg-primary/10 dark:bg-primary/20 text-primary border-primary/30"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-primary/30 dark:hover:border-primary/50"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="weeklyCommuteDistance" className="text-sm font-bold">Weekly Commute (km)</Label>
          <Input
            id="weeklyCommuteDistance"
            type="number"
            min="0"
            className="h-11 rounded-full border-zinc-200 dark:border-zinc-800 bg-background dark:bg-zinc-900/50 focus-visible:ring-primary/20"
            placeholder="e.g. 50"
            value={data.weeklyCommuteDistance || ''}
            onChange={(e) => onChange({ ...data, weeklyCommuteDistance: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="yearlyFlightFrequency" className="text-sm font-bold">Yearly Flights</Label>
          <Input
            id="yearlyFlightFrequency"
            type="number"
            min="0"
            className="h-11 rounded-full border-zinc-200 dark:border-zinc-800 bg-background dark:bg-zinc-900/50 focus-visible:ring-primary/20"
            placeholder="e.g. 2"
            value={data.yearlyFlightFrequency || ''}
            onChange={(e) => onChange({ ...data, yearlyFlightFrequency: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
};

export default TransportStep;
