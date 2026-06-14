import React from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { Building2, Home, Laptop, GraduationCap } from 'lucide-react';

const RoutineStep = ({ data, onChange }) => {
  const routines = [
    { value: 'offline_commute', label: 'Office Commute', icon: Building2, desc: 'Regular travel to a physical workplace' },
    { value: 'work_from_home', label: 'Work From Home', icon: Home, desc: 'Remote work with minimal commuting' },
    { value: 'hybrid', label: 'Hybrid Work', icon: Laptop, desc: 'Balance of office and remote work' },
    { value: 'college_commute', label: 'College/Uni', icon: GraduationCap, desc: 'Student life with campus commuting' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <Label className="text-sm font-bold">
          Your Daily Routine <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {routines.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange({ ...data, type: item.value })}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-2",
                  data.type === item.value
                    ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-sm"
                    : "bg-background dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  data.type === item.value ? "bg-primary text-primary-foreground" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-bold",
                    data.type === item.value ? "text-primary dark:text-primary-foreground/90" : "text-zinc-900 dark:text-zinc-100"
                  )}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoutineStep;
