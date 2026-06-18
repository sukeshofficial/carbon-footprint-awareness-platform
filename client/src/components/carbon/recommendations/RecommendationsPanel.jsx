import React, { useEffect, useState } from 'react';
import useRecommendationStore from '../../../store/recommendationStore';
import TopActionsPanel from './TopActionsPanel';
import CategorySuggestionList from './CategorySuggestionList';
import RecommendationFilters from './RecommendationFilters';
import RecommendationProgress from './RecommendationProgress';
import { Button } from '../../ui/button';
import { RefreshCw, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const RecommendationsPanel = () => {
  const {
    topActions,
    categorySuggestions,
    history,
    isLoading,
    fetchRecommendations,
    updateStatus,
    fetchHistory
  } = useRecommendationStore();

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecommendations();
    fetchHistory();
  }, [fetchRecommendations, fetchHistory]);

  const handleRefresh = () => {
    fetchRecommendations(true);
  };

  const handleAccept = (id) => {
    updateStatus(id, 'accepted');
  };

  const handleDismiss = (id) => {
    updateStatus(id, 'dismissed');
  };

  if (isLoading && topActions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Generating your personalized roadmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero / Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">Your Carbon Coach</h2>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
              Based on your footprint analysis, I've curated a personalized action plan to help you reduce emissions effectively. These recommendations focus on high-impact areas with the best balance of effort and cost savings.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              className="rounded-full h-11 px-6 font-black text-xs uppercase tracking-widest gap-2 bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700"
            >
              <RefreshCw size={14} className={cn(isLoading && "animate-spin")} />
              Recalculate Roadmap
            </Button>
            <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 hidden sm:block"></div>
            <RecommendationFilters activeFilter={filter} onFilterChange={setFilter} />
          </div>
        </div>

        <div className="lg:col-span-4 h-full">
          <RecommendationProgress history={history} className="h-full" />
        </div>
      </div>

      {/* Top 3 Priority Section */}
      <TopActionsPanel
        actions={topActions}
        onAccept={handleAccept}
        onDismiss={handleDismiss}
      />

      {/* Category Wise Detailed Suggestions */}
      <div className="space-y-8 pt-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 tracking-tight uppercase tracking-widest">Full Action Plan</h2>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Explore Categories</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <CategorySuggestionList
          categorySuggestions={categorySuggestions}
          activeFilter={filter}
          onAccept={handleAccept}
          onDismiss={handleDismiss}
        />
      </div>
    </div>
  );
};

export default RecommendationsPanel;
