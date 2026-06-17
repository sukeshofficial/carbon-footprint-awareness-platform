/**
 * BeforeAfterComparison.jsx
 * Visual bar comparing baseline vs projected monthly CO2.
 */

import React from 'react';
import { TrendingDown } from 'lucide-react';

export default function BeforeAfterComparison({ baselineCO2, projectedCO2 }) {
  const max = Math.max(baselineCO2, projectedCO2, 1);
  const baselinePct = Math.round((baselineCO2 / max) * 100);
  const projectedPct = Math.round((projectedCO2 / max) * 100);
  const saved = Math.max(0, baselineCO2 - projectedCO2);
  const savedFormatted = saved.toFixed(1);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
          <TrendingDown className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100">Before vs After</h3>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Monthly CO₂ (kg)</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
            <span>Current</span>
            <span className="font-black text-slate-700 dark:text-zinc-200 tabular-nums">{baselineCO2.toFixed(1)} kg</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-400 dark:bg-red-500 transition-all duration-700"
              style={{ width: `${baselinePct}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
            <span>Projected</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{projectedCO2.toFixed(1)} kg</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 dark:bg-emerald-500 transition-all duration-700"
              style={{ width: `${projectedPct}%` }}
            />
          </div>
        </div>
      </div>

      {saved > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Monthly savings</span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums">−{savedFormatted} kg CO₂</span>
        </div>
      )}
    </div>
  );
}
