/**
 * ScenarioResultCard.jsx
 * Displays the full result of a scenario preview.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Leaf, Calendar, TrendingDown } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import ConfidenceBadge from './ConfidenceBadge';
import SavingsBadge from './SavingsBadge';
import BeforeAfterComparison from './BeforeAfterComparison';

export default function ScenarioResultCard({ result, onSave, isSaving }) {
  if (!result) return null;

  const {
    title,
    baselineCO2,
    projectedCO2,
    co2Saved,
    monthlySavingsCO2,
    yearlySavingsCO2,
    moneySavingsEstimate,
    difficultyLevel,
    confidenceScore,
    explanationText,
    comparisonSummary,
  } = result;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Hero Result */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 p-6">
        <p className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-black mb-1">Projected Savings</p>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums leading-none">
            {co2Saved?.toFixed(1)}
          </span>
          <span className="text-sm font-bold text-emerald-600/70 dark:text-emerald-400/70 pb-1">kg CO₂/month</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <DifficultyBadge level={difficultyLevel} />
          <ConfidenceBadge score={confidenceScore} />
          {moneySavingsEstimate > 0 && <SavingsBadge amount={moneySavingsEstimate} />}
        </div>
      </div>

      {/* Monthly / Yearly */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Monthly</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-zinc-100 tabular-nums">
            −{monthlySavingsCO2?.toFixed(1)} kg
          </p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">CO₂ saved</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Yearly</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-zinc-100 tabular-nums">
            −{yearlySavingsCO2?.toFixed(0)} kg
          </p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">CO₂ saved</p>
        </div>
      </div>

      {/* Before / After */}
      <BeforeAfterComparison baselineCO2={baselineCO2} projectedCO2={projectedCO2} />

      {/* Explanation */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-700 dark:text-zinc-200 uppercase tracking-widest mb-1">Impact Summary</p>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{explanationText}</p>
            {moneySavingsEstimate > 0 && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                * Money savings are approximate estimates based on typical Indian rates. Actual savings will vary.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      {onSave && (
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save this Scenario'}
        </button>
      )}
    </div>
  );
}

ScenarioResultCard.propTypes = {
  result: PropTypes.shape({
    title: PropTypes.string,
    baselineCO2: PropTypes.number,
    projectedCO2: PropTypes.number,
    co2Saved: PropTypes.number,
    monthlySavingsCO2: PropTypes.number,
    yearlySavingsCO2: PropTypes.number,
    moneySavingsEstimate: PropTypes.number,
    difficultyLevel: PropTypes.string,
    confidenceScore: PropTypes.number,
    explanationText: PropTypes.string,
    comparisonSummary: PropTypes.any
  }),
  onSave: PropTypes.func,
  isSaving: PropTypes.bool
};

