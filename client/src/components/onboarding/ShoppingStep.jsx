import React from 'react';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

const ShoppingStep = ({ data, onChange }) => {
  const shoppingFreq = [
    { value: 'frequent_online', label: 'Frequent Online', desc: 'Multiple times a week' },
    { value: 'occasional', label: 'Occasional', desc: 'Few times a month' },
    { value: 'minimal', label: 'Minimal', desc: 'Rarely buy new items' },
  ];

  const fashionFreq = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semi_annually', label: 'Semi-Annually' },
    { value: 'annually', label: 'Annually' },
    { value: 'rarely', label: 'Rarely' },
  ];

  const gadgetCycles = [
    { value: 'every_year', label: 'Every Year' },
    { value: 'every_2_years', label: 'Every 2 Years' },
    { value: 'every_3_to_5_years', label: '3-5 Years' },
    { value: 'more_than_5_years', label: '5+ Years' },
  ];

  const handleSelect = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <Label className="text-sm font-bold">
          Online Shopping Frequency <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {shoppingFreq.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect('onlineShoppingFrequency', item.value)}
              className={cn(
                "p-3 rounded-2xl border text-center transition-all",
                data.onlineShoppingFrequency === item.value
                  ? "bg-primary/5 dark:bg-primary/10 border-primary text-primary"
                  : "bg-background dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              <p className="text-xs font-bold">{item.label}</p>
              <p className="text-[10px] opacity-70">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-bold">
          Fashion Purchase Frequency <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {fashionFreq.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect('fashionPurchaseFrequency', item.value)}
              className={cn(
                "px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold transition-all",
                data.fashionPurchaseFrequency === item.value
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                  : "bg-background dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-bold">
          Gadget Upgrade Cycle <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {gadgetCycles.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect('gadgetUpgradeCycle', item.value)}
              className={cn(
                "px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold transition-all",
                data.gadgetUpgradeCycle === item.value
                  ? "bg-primary text-primary-foreground border-primary"
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

export default ShoppingStep;
