import React from 'react';
import { Progress } from "../ui/progress";
import { cn } from '../../lib/utils';
import { Target } from 'lucide-react';

const GoalProgress = ({ goal, analytics, className }) => {
  if (!goal) return null;

  const progress = analytics?.goalAchievementPercent || 0;
  const current = goal.currentValue || 0;
  const target = goal.targetValue || 100;

  const targetTypeLabels = {
    footprint_reduction_percent: '% reduction',
    action_completion_count: 'actions completed',
    streak_days: 'day streak',
    category_reduction_percent: '% category reduction'
  };

  return (
    <div className={cn("space-y-4 p-5 rounded-2xl bg-primary/5 border border-primary/10", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            Current Goal
          </h3>
          <p className="text-lg font-bold mt-1 text-foreground">{goal.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{goal.description}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-primary leading-none">
            {Math.round(progress)}%
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Achieved</p>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-3 bg-primary/20" />
        <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
          <span>{current} {targetTypeLabels[goal.targetType]}</span>
          <span>Target: {target}</span>
        </div>
      </div>

      {analytics?.estimatedCo2Saved > 0 && (
        <div className="pt-2 flex items-center gap-4 border-t border-primary/10">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Estimated Impact</p>
            <p className="font-bold text-green-600">{analytics.estimatedCo2Saved.toFixed(1)} kg CO2e saved</p>
          </div>
          <div className="h-8 w-px bg-primary/10" />
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Completion Rate</p>
            <p className="font-bold text-primary">{Math.round(analytics.completionRate)}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
