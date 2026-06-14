import React from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const CarbonContextReview = ({ responses, questions }) => {
  const getDisplayValue = (stepKey, fieldKey, value) => {
    if (value === undefined || value === null || value === '') return 'Not provided';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value.toString().replace(/_/g, ' ');
  };

  const isStepComplete = (stepKey) => {
    // This is a simplified check
    return true;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center py-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 dark:border-primary/20 mb-6">
        <h3 className="text-base font-bold tracking-tight text-primary dark:text-primary-foreground/90">Review Your Profiles</h3>
        <p className="text-muted-foreground text-xs">Confirm your details before we finalize your context.</p>
      </div>

      <div className="space-y-4">
        {questions?.steps.map((step) => (
          <div key={step.key} className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{step.label}</h4>
              {isStepComplete(step.key) ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-500" />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              {step.questions.map((q) => {
                let contextKey = `${step.key}Profile`;
                if (step.key === 'routine') contextKey = 'workRoutine';
                if (step.key === 'lifestyle') contextKey = 'lifestyleContext';
                if (step.key === 'waste') contextKey = 'wasteProfile';

                const val = responses?.[contextKey]?.[q.key] || responses?.[q.key]; // Handling potential nesting differences

                return (
                  <div key={q.key} className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground dark:text-zinc-500 uppercase tracking-wider font-bold">{q.label}</span>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {getDisplayValue(step.key, q.key, val)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-2xl text-center">
        <p className="text-xs font-bold text-green-800 dark:text-green-400 italic">"Your data helps us build a precision carbon footprint model for you."</p>
      </div>
    </div>
  );
};

export default CarbonContextReview;
