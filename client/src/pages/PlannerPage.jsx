import React, { useEffect, useState } from 'react';
import usePlannerStore from '../store/plannerStore';
import WeeklyPlanner from '../components/planner/WeeklyPlanner';
import GoalModal from '../components/planner/GoalModal';
import { Button } from '../components/ui/button';
import { Plus, Calendar as CalendarIcon, Map } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

const PlannerPage = () => {
  const { fetchInitialData, createGoal } = usePlannerStore();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleCreateGoal = async (goalData) => {
    await createGoal(goalData);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-zinc-950/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-zinc-50 leading-tight">
              Action Planner
            </h1>
            <p className="text-muted-foreground text-base">
              Turn your carbon recommendations into achievable daily actions.
            </p>
          </div>

          <Button
            onClick={() => setIsGoalModalOpen(true)}
            className="rounded-full shadow-lg shadow-primary/20 h-12 px-6 font-bold gap-2"
          >
            <Plus className="w-5 h-5" />
            New Sustainability Goal
          </Button>
        </div>

        <Tabs defaultValue="weekly" className="space-y-8">
          <TabsList className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-1.5 rounded-full h-14 shadow-sm inline-flex">
            <TabsTrigger
              value="weekly"
              label="7-Day Plan"
              icon={CalendarIcon}
              className="rounded-full h-11 px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold italic transition-all"
            />
            <TabsTrigger
              value="monthly"
              label="30-Day Roadmap"
              icon={Map}
              className="rounded-full h-11 px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold italic transition-all"
            />
          </TabsList>

          <TabsContent value="weekly">
            <WeeklyPlanner onOpenGoal={() => setIsGoalModalOpen(true)} />
          </TabsContent>

          <TabsContent value="monthly">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border-2 border-dashed rounded-3xl bg-muted/10">
              <Map className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold">Monthly Roadmap</h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                The 30-day view helps you build long-term habits. This feature is coming soon to your green journey.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </div>
  );
};

export default PlannerPage;
