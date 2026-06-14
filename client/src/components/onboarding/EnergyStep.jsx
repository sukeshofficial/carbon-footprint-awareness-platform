import React from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';

const EnergyStep = ({ data, onChange }) => {
  const usageLevels = [
    { value: 'none', label: 'None' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'occasionally', label: 'Occasionally' },
    { value: 'frequently', label: 'Frequently' },
    { value: 'very_frequently', label: 'Daily' },
  ];

  const homeTypes = [
    { value: 'shared_home', label: 'Shared Home' },
    { value: 'independent_home', label: 'Independent Home' },
    { value: 'apartment', label: 'Apartment' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <Label className="text-sm font-bold">Home Type</Label>
        <div className="flex flex-wrap gap-2">
          {homeTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange({ ...data, homeType: type.value })}
              className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                data.homeType === type.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-bold">AC Usage</Label>
        <div className="flex flex-wrap gap-2">
          {usageLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange({ ...data, acUsage: level.value })}
              className={cn(
                "px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold transition-all",
                data.acUsage === level.value
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-bold">Fan Usage</Label>
        <div className="flex flex-wrap gap-2">
          {usageLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange({ ...data, fanUsage: level.value })}
              className={cn(
                "px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold transition-all",
                data.fanUsage === level.value
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="space-y-0.5">
          <Label className="text-sm font-bold">Electricity Bill Awareness</Label>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Do you track your monthly usage?</p>
        </div>
        <Switch
          checked={data.billAwareness || false}
          onCheckedChange={(checked) => onChange({ ...data, billAwareness: checked })}
        />
      </div>
    </div>
  );
};

export default EnergyStep;
