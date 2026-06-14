import React from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

const WasteStep = ({ data, onChange }) => {
  const recyclingHabits = [
    { value: 'never', label: 'Never' },
    { value: 'occasionally', label: 'Occasionally' },
    { value: 'regularly', label: 'Regularly' },
    { value: 'always', label: 'Always' },
  ];

  const wasteSegregations = [
    { value: 'none', label: 'None' },
    { value: 'partial', label: 'Partial' },
    { value: 'complete', label: 'Complete' },
  ];

  const plasticUsage = [
    { value: 'high', label: 'High' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'low', label: 'Low' },
    { value: 'minimal', label: 'Minimal' },
  ];

  const handleSelect = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <Label className="text-sm font-bold">Recycling Habit</Label>
        <div className="flex flex-wrap gap-2">
          {recyclingHabits.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect('recyclingHabit', item.value)}
              className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                data.recyclingHabit === item.value
                  ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-bold">Waste Segregation</Label>
        <div className="flex flex-wrap gap-2">
          {wasteSegregations.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect('wasteSegregation', item.value)}
              className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                data.wasteSegregation === item.value
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-lg shadow-zinc-500/10"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-bold">Plastic Usage</Label>
        <div className="flex flex-wrap gap-2">
          {plasticUsage.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect('plasticUsage', item.value)}
              className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                data.plasticUsage === item.value
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WasteStep;
