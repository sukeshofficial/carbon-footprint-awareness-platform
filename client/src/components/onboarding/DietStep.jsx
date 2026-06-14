import React from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

const DietStep = ({ data, onChange }) => {
  const diets = [
    { value: 'vegetarian', label: 'Vegetarian', description: 'No meat, includes dairy/eggs' },
    { value: 'eggetarian', label: 'Eggetarian', description: 'Vegetarian plus eggs' },
    { value: 'mixed_diet', label: 'Mixed Diet', description: 'Occasional meat and plants' },
    { value: 'non_vegetarian', label: 'Non-Vegetarian', description: 'Regular meat consumption' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <Label className="text-sm font-bold">
          What's your typical diet? <span className="text-destructive">*</span>
        </Label>
        <div className="grid gap-3">
          {diets.map((diet) => (
            <button
              key={diet.value}
              type="button"
              onClick={() => onChange({ ...data, dietStyle: diet.value })}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all",
                data.dietStyle === diet.value
                  ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-sm"
                  : "bg-background dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
              )}
            >
              <p className={cn(
                "text-sm font-bold",
                data.dietStyle === diet.value ? "text-primary dark:text-primary-foreground/90" : "text-zinc-900 dark:text-zinc-100"
              )}>
                {diet.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{diet.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietStep;
