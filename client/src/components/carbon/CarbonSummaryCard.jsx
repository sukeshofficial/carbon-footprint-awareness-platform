import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import SeverityBadge from './SeverityBadge';
import TrendBadge from './TrendBadge';
import WeeklyMonthlyToggle from './WeeklyMonthlyToggle';
import { Leaf, Info } from 'lucide-react';

const CarbonSummaryCard = ({ estimation, onRecalculate, loading }) => {
  const [view, setView] = useState('monthly');

  if (!estimation && !loading) {
    return (
      <Card className="overflow-hidden border border-slate-100 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="h-[200px] flex flex-col items-center justify-center text-center p-6">
          <Leaf className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-500">No Footprint Data Yet</p>
          <p className="text-[11px] text-slate-400 mt-1 mb-4 max-w-[200px]">
            Complete your profile and carbon onboarding to see your estimates here.
          </p>
          {onRecalculate && (
            <Button
              onClick={onRecalculate}
              size="xs"
              variant="outline"
              className="text-[10px] h-7 px-3 rounded-full"
            >
              Try Calculate Now
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const displayValue = view === 'weekly' ? estimation?.weeklyEstimate : estimation?.monthlyEstimate;

  return (
    <Card className="overflow-hidden border-none shadow-premium bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Leaf size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Carbon Footprint</CardTitle>
              <CardDescription className="text-xs">Estimated CO₂ emissions</CardDescription>
            </div>
          </div>
          <WeeklyMonthlyToggle view={view} onChange={setView} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 leading-none">
                {displayValue?.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                kg CO₂ / {view === 'weekly' ? 'week' : 'month'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Severity</p>
                <SeverityBadge level={estimation?.severityLevel} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trend</p>
                <TrendBadge trend={estimation?.trendLabel} />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-start gap-3">
              <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Coach Insight: </span>
                {estimation?.explanation}
              </p>
            </div>

            {estimation?.aiInsights?.tips && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Actionable Tips</p>
                <div className="grid grid-cols-1 gap-2">
                  {estimation.aiInsights.tips.map((tip, idx) => (
                    <div key={tip.id || tip.title || idx} className="bg-green-50/50 border border-green-100 rounded-xl p-3 flex gap-3 group hover:bg-green-50 transition-colors">
                      <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-zinc-900 group-hover:text-green-700 transition-colors font-inter italic">{tip.title}</p>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={onRecalculate}
              disabled={loading}
              variant="outline"
              className="w-full text-xs font-semibold py-5 bg-white hover:bg-slate-50 border-slate-200"
            >
              Recalculate Personal Estimates
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

CarbonSummaryCard.propTypes = {
  estimation: PropTypes.shape({
    weeklyEstimate: PropTypes.number,
    monthlyEstimate: PropTypes.number,
    severityLevel: PropTypes.string,
    trendLabel: PropTypes.string,
    explanation: PropTypes.string,
    aiInsights: PropTypes.shape({
      tips: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.string
      }))
    })
  }),
  onRecalculate: PropTypes.func,
  loading: PropTypes.bool
};

export default CarbonSummaryCard;
