import React, { useEffect, useState } from 'react';
import usePlannerStore from '../../store/plannerStore';
import ActionCard from './ActionCard';
import StreakBadge from './StreakBadge';
import GoalProgress from './GoalProgress';
import { Button } from '../ui/button';
import { Calendar, ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

const WeeklyPlanner = ({ onOpenGoal }) => {
  const {
    actions,
    activeGoal,
    analytics,
    streak,
    isLoading,
    fetchActions,
    completeAction,
    skipAction,
    generatePlan
  } = usePlannerStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  useEffect(() => {
    if (activeGoal) {
      fetchActions();
    }
  }, [activeGoal]);

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  const getActionsForDay = (day) => {
    return actions.filter(action => isSameDay(new Date(action.scheduledDate), day));
  };

  const handleGeneratePlan = async () => {
    if (activeGoal) {
      await generatePlan(activeGoal._id, 'weekly');
    }
  };

  if (!activeGoal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border-2 border-dashed rounded-3xl bg-muted/10">
        <Plus className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">No Active Goal</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Set a sustainability goal first to generate a personalized weekly plan.
        </p>
        <Button onClick={onOpenGoal} className="mt-6 rounded-full px-8">Set Your First Goal</Button>
      </div>
    );
  }

  if (actions.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border-2 border-dashed rounded-3xl bg-muted/10">
        <Calendar className="w-12 h-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold">Your Planner is Empty</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Generate a 7-day plan based on your recommendations to start making progress.
        </p>
        <Button
          onClick={handleGeneratePlan}
          className="mt-6 rounded-full px-8 gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Generate 7-Day Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GoalProgress goal={activeGoal} analytics={analytics} className="" />
        </div>
        <div className="bg-white p-6 rounded-2xl border flex flex-col items-center justify-center gap-4">
          <StreakBadge
            currentStreak={streak?.currentStreak || 0}
            longestStreak={streak?.longestStreak || 0}
            className=""
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between bg-muted/5">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Weekly Roadmap
            </h2>
            <div className="flex items-center bg-muted rounded-full p-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 text-xs font-bold min-w-[140px] text-center">
                {format(weekDays[0], 'MMM d')} – {format(weekDays[6], 'MMM d, yyyy')}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleGeneratePlan} className="rounded-full gap-2">
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate Plan
          </Button>
        </div>

        <div className="divide-y">
          {weekDays.map((day, idx) => {
            const dayActions = getActionsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div key={idx} className={cn(
                "p-6 flex flex-col md:flex-row gap-6",
                isToday && "bg-primary/5"
              )}>
                <div className="md:w-32 flex-shrink-0">
                  <div className={cn(
                    "inline-flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all",
                    isToday ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-muted bg-white text-muted-foreground"
                  )}>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{format(day, 'EEE')}</span>
                    <span className="text-lg font-black">{format(day, 'd')}</span>
                  </div>
                  {isToday && <p className="text-[10px] font-black text-primary uppercase mt-2 ml-1">Today</p>}
                </div>

                <div className="flex-1 space-y-4">
                  {dayActions.length > 0 ? (
                    dayActions.map(action => (
                      <ActionCard
                        key={action._id}
                        action={action}
                        onComplete={completeAction}
                        onSkip={skipAction}
                      />
                    ))
                  ) : (
                    <div className="h-20 border border-dashed rounded-2xl flex items-center justify-center text-muted-foreground text-sm font-medium">
                      Recovery Day — No major actions scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
