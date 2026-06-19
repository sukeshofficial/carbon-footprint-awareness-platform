import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useExplanationStore from '../../../store/explanationStore';
import ExplanationSummaryCard from './ExplanationSummaryCard';
import CategoryExplanationCard from './CategoryExplanationCard';
import HabitExplanationCallout from './HabitExplanationCallout';
import { Info, HelpCircle } from 'lucide-react';

const ExplanationsPanel = () => {
  const { explanation, loading, error, fetchExplanation } = useExplanationStore();

  useEffect(() => {
    fetchExplanation();
  }, [fetchExplanation]);

  if (loading && !explanation) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-slate-100 rounded-xl" />
          <div className="h-24 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800">
        <div className="flex items-center gap-3 mb-2">
          <Info size={20} />
          <h3 className="text-base font-semibold">Couldn't load explanations</h3>
        </div>
        <p className="text-sm opacity-90">{error}</p>
        <button
          onClick={() => fetchExplanation(true)}
          className="mt-4 px-4 py-2 bg-white rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="space-y-6">
      <ExplanationSummaryCard
        summary={explanation.summary}
        trend={explanation.source_signals?.trend}
        dominantCategory={explanation.source_signals?.dominant_category}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {explanation.category_explanations?.map((cat) => (
          <CategoryExplanationCard
            key={cat.category}
            category={cat.category}
            reason={cat.reason}
          />
        ))}
      </div>

      {explanation.habit_explanations?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800">
            <HelpCircle size={18} className="text-indigo-500" />
            <h3 className="text-xl font-bold">Deeper Insights</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {explanation.habit_explanations.map((habit) => (
              <HabitExplanationCallout
                key={habit.habit}
                habit={habit.habit}
                reason={habit.reason}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ExplanationsPanel.propTypes = {
  // No direct props from parent, but adding for consistency
};

export default ExplanationsPanel;
