import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, ChevronRight } from 'lucide-react';
import { Leaf, Loader2, RefreshCw, Activity, TrendingUp, BarChart3, Lightbulb, Zap, Map } from 'lucide-react';

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

// ─── Constants ──────────────────────────────────────────────────────────────

const PROFILE_NUDGES = {
  transportProfile: 'Complete your transport profile for better commute insights',
  foodProfile: 'Add diet details for accurate food footprint estimates',
  energyProfile: 'Add energy habits for home carbon analysis',
  shoppingProfile: 'Add shopping habits for consumption footprint',
  wasteProfile: 'Add waste habits for accurate waste estimation',
};

const DEV_STATUS_DATA = {
  title: '🚧 In Development',
  description:
    'Building a profile system to personalize carbon insights, benchmarks, coaching tone, and recommendations based on user lifestyle and preferences.',
  phase: 'Phase 6 / 7',
  status: 'Active Development',
  nextMilestone: 'Completed ✅',
  updatedAt: '5 hours ago',
  checklist: [
    { label: 'Identity details (display name, city/region)', completed: true },
    { label: 'User type selection', completed: true },
    { label: 'Household setup', completed: true },
    { label: 'Tone preference setup', completed: true },
    { label: 'Profile Onboarding (8 steps)', completed: true },
    { label: 'Carbon Context Onboarding (7 steps)', completed: true },
    { label: 'Personalized carbon recommendations', completed: true },
  ],
};


const DashboardLoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary/40" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Calculating your carbon impact...
      </p>
    </div>
  </div>
);

const DashboardEmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-8 animate-bounce">
      <Leaf size={40} />
    </div>
    <h2 className="text-2xl font-black text-slate-900 dark:text-zinc-50 mb-3 italic">
      Start Your Green Journey
    </h2>
    <p className="text-muted-foreground text-sm max-w-md mb-10 leading-relaxed font-medium">
      We couldn't find your carbon footprint data. Complete the onboarding to see your impact, get personalized tips, and start reducing your emissions.
    </p>
    <Link to="/onboarding">
      <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold italic shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
        Complete Onboarding
      </Button>
    </Link>
  </div>
);

const ProfileNudgeCard = ({ skippedSections }) => {
  if (!skippedSections?.length) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <UserIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-zinc-100 italic">
            Complete Profile
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
            Accuracy: Low
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {skippedSections.map((section) => (
          <Link key={section} to="/profile/edit" className="block group">
            <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between hover:border-primary/30 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300">
              <p className="text-xs font-bold text-slate-600 dark:text-zinc-400 group-hover:text-primary transition-colors italic leading-snug pr-4">
                {PROFILE_NUDGES[section] ?? section}
              </p>
              <div className="w-7 h-7 rounded-full bg-slate-200/50 dark:bg-zinc-700/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

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

  const [view, setView] = useState('monthly');

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
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
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

            <CurrentDevelopmentCard {...DEV_STATUS_DATA} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
