import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, RefreshCw, Activity, TrendingUp, BarChart3, Lightbulb, Zap, Map, CalendarCheck } from 'lucide-react';

import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../store/profileStore';
import { useCarbonEstimation } from '../store/carbonEstimationStore';
import { useCarbonInsightsStream } from '../hooks/useCarbonInsightsStream';
import { cn } from '../lib/utils';

import MetricStatCard from '../components/carbon/MetricStatCard';
import EmissionsBreakdownCard from '../components/carbon/EmissionsBreakdownCard';
import CoachingTipsCard from '../components/carbon/CoachingTipsCard';
import ExplanationsPanel from '../components/carbon/explanations/ExplanationsPanel';
import WeeklyMonthlyToggle from '../components/carbon/WeeklyMonthlyToggle';
import CurrentDevelopmentCard from '../components/ui/CurrentDevelopmentCard';
import WhatIfSimulator from '../components/carbon/what-if/WhatIfSimulator';
import RecommendationsPanel from '../components/carbon/recommendations/RecommendationsPanel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import usePlannerStore from '../store/plannerStore';
import DailyActionHero from '../components/planner/DailyActionHero';
import StreakBadge from '../components/planner/StreakBadge';
import GoalProgress from '../components/planner/GoalProgress';
import WeeklyPlanner from '../components/planner/WeeklyPlanner';
import GoalModal from '../components/planner/GoalModal';

import { DEV_STATUS_DATA } from '../features/dashboard/constants/dashboardConstants';

import {
  DashboardLoadingSpinner,
  DashboardEmptyState,
  ProfileNudgeCard
} from '../features/dashboard/components/DashboardSubComponents';

// ─── Trend Helpers ───────────────────────────────────────────────────────────

/**
 * Computes a formatted trend string (e.g. "+3.2%") from the first two
 * entries of the estimation history array. Returns null when insufficient data.
 */
const computeTrendFromHistory = (history) => {
  if (!history || history.length < 2) return null;
  const latest = history[0]?.totalFootprint;
  const prev = history[1]?.totalFootprint;
  if (!prev) return null;
  const pct = ((latest - prev) / prev) * 100;
  return (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
};

// ─── Main Dashboard Component ────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { estimation, history, loading, fetchMyEstimation, recalculate, fetchHistory } =
    useCarbonEstimation();
  const { streamedInsights, isStreaming, streamedToken, streamError, resetStream } =
    useCarbonInsightsStream(estimation);

  const {
    todayAction,
    activeGoal,
    analytics,
    streak,
    fetchInitialData,
    completeAction,
    skipAction,
    createGoal
  } = usePlannerStore();

  const [view, setView] = useState('monthly');
  const [isPlannerGoalModalOpen, setIsPlannerGoalModalOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!estimation) {
      fetchMyEstimation();
    }
    fetchHistory();
  }, [fetchMyEstimation, fetchHistory]);

  const handleRecalculate = async () => {
    try {
      resetStream();
      await recalculate();
      toast.success('Emissions updated successfully!');
    } catch (err) {
      console.error('Recalculate failed:', err);
      toast.error('Failed to update emissions. Please try again.');
    }
  };

  if (loading && !estimation) {
    return <DashboardLoadingSpinner />;
  }

  if (!estimation && !loading) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-zinc-950/50">
        <DashboardEmptyState />
      </div>
    );
  }
  const displayValue =
    view === 'weekly' ? estimation?.weeklyEstimate : estimation?.monthlyEstimate;
  const trendValue = computeTrendFromHistory(history);
  const historyFootprints = history.map((h) => h.totalFootprint).reverse();

  return (
    <>
      <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-zinc-950/50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-zinc-50 leading-tight">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-base">
                Welcome back,{' '}
                <span className="text-foreground font-bold">{user?.name || 'User'}</span>!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-zinc-800">
              <WeeklyMonthlyToggle view={view} onChange={setView} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRecalculate}
                disabled={loading}
                className="rounded-full border-slate-200 dark:border-zinc-800 h-9 font-bold text-xs gap-2"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </div>

          {/* KPI Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <MetricStatCard
              title="Total Footprint"
              value={displayValue?.toLocaleString()}
              unit="kg"
              icon={Leaf}
              description={view === 'weekly' ? 'Weekly Outlook' : 'Monthly Outlook'}
              history={historyFootprints}
              trend={trendValue}
            />
            <MetricStatCard
              title="Climate Impact"
              value={estimation?.severityLevel?.toUpperCase() || '—'}
              icon={Activity}
              description="Environmental Severity"
              history={history.map((h) => h.totalFootprint || 0)}
              trend={estimation?.severityLevel === 'high' ? 'Alert' : 'Stable'}
            />
            <MetricStatCard
              title="Emission Trend"
              value={estimation?.trendLabel?.toUpperCase() || '—'}
              icon={TrendingUp}
              description="Performance History"
              history={historyFootprints}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Main Tabbed Content */}
            <div className="lg:col-span-8 flex flex-col gap-8 w-full">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview" label="Overview" icon={BarChart3} />
                  <TabsTrigger value="insights" label="Insights" icon={Lightbulb} />
                  <TabsTrigger value="simulator" label="Simulator" icon={Zap} />
                  <TabsTrigger value="roadmap" label="Roadmap" icon={Map} />
                  <TabsTrigger value="planner" label="Planner" icon={CalendarCheck} />
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  {activeGoal && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DailyActionHero
                        action={todayAction}
                        onComplete={completeAction}
                        onSkip={skipAction}
                      />
                      <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800 flex flex-col justify-center items-center">
                        <StreakBadge
                          currentStreak={streak?.currentStreak || 0}
                          longestStreak={streak?.longestStreak || 0}
                          className=""
                        />
                        <Link to="/planner" className="mt-4">
                          <Button variant="link" className="text-primary font-bold italic">
                            View Full Planner
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="w-full">
                    <EmissionsBreakdownCard
                      categoryBreakdown={estimation?.categoryBreakdown}
                      coachInsight={estimation?.explanation}
                      history={history}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-8">
                  <div className="w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <RefreshCw size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50">
                          Footprint Overview
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                          Rule-Based Analysis
                        </p>
                      </div>
                    </div>
                    <ExplanationsPanel />
                  </div>
                </TabsContent>

                <TabsContent value="simulator" className="space-y-8">
                  <WhatIfSimulator />
                </TabsContent>

                <TabsContent value="roadmap" className="space-y-8">
                  <RecommendationsPanel />
                </TabsContent>

                <TabsContent value="planner" className="space-y-8">
                  <WeeklyPlanner onOpenGoal={() => setIsPlannerGoalModalOpen(true)} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-8 w-full sticky top-8">
              <CoachingTipsCard
                insights={streamedInsights}
                isStreaming={isStreaming}
                streamToken={streamedToken}
                streamError={streamError}
                onRetry={() => resetStream()}
              />

              <ProfileNudgeCard skippedSections={profile?.skippedSections} />

              {activeGoal && (
                <GoalProgress
                  goal={activeGoal}
                  analytics={analytics}
                  className="bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 shadow-xl shadow-slate-200/50"
                />
              )}

              <CurrentDevelopmentCard {...DEV_STATUS_DATA} />
            </div>
          </div>
        </div>
      </div>

      <GoalModal
        isOpen={isPlannerGoalModalOpen}
        onClose={() => setIsPlannerGoalModalOpen(false)}
        onSubmit={async (goalData) => { await createGoal(goalData); }}
      />
    </>
  );
};

export default Dashboard;
