import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

const Sparkline = ({ data = [] }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 14;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d - min) / range) * height
  }));
  const path = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  return (
    <svg width={width} height={height} className="opacity-30 group-hover:opacity-60 transition-opacity duration-500">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
    </svg>
  );
};

const MetricStatCard = ({ title, value, unit = null, icon: Icon = null, chip = null, description = null, trend = null, history = [], className = "" }) => {
  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 border-none bg-white dark:bg-zinc-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem]", className)}>
      <CardContent className="p-4 flex items-center justify-between gap-4 h-full">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all duration-500 shadow-inner">
              <Icon size={22} />
            </div>
          )}
          <div className="space-y-0.5 min-w-0">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.15em] truncate">
              {title}
            </p>
            <div className="flex items-baseline gap-1.5 overflow-hidden">
              <span className="text-2xl font-[900] text-slate-900 dark:text-zinc-50 tracking-tight leading-none truncate">
                {value ?? '—'}
              </span>
              {unit && <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-tighter shrink-0">{unit}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between h-12 shrink-0">
          <div className="flex items-center gap-2">
            {trend && (
              <div className={cn(
                "text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap",
                trend.startsWith('+') ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              )}>
                {trend}
              </div>
            )}
            <div className="scale-[0.8] origin-right -mr-1">
              {chip}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Sparkline data={history} />
            {description && (
              <p className="text-[8px] font-black text-slate-300 dark:text-zinc-600 uppercase tracking-widest leading-none">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricStatCard;
