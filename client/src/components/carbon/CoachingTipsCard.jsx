import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import RecommendationReasoning from './explanations/RecommendationReasoning';
import useExplanationStore from '../../store/explanationStore';

const CoachingTipsCard = ({ insights, isStreaming, streamToken, streamError, onRetry }) => {
  return (
    <Card className="h-full border-none bg-white shadow-inner overflow-hidden flex flex-col">
      <CardContent className="p-8 flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Sparkles size={18} />
            </div>
            <h3 className="text-lg font-black text-slate-900 leading-none">Coaching Tips</h3>
          </div>
          {isStreaming && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
          {/* Streaming in progress — show raw token text */}
          {isStreaming && !insights ? (
            <div className="space-y-4">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Analyzing your habits…</p>
                <p className="text-sm text-slate-500 leading-relaxed font-mono whitespace-pre-wrap">{streamToken || '...'}</p>
              </div>
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-white/50 border border-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : insights?.tips?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {insights.tips.map((tip, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-200 rounded-3xl p-6 flex flex-col gap-3 group">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-xs font-black shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-tight italic">{tip.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">{tip.description}</p>
                    </div>
                  </div>
                  <RecommendationReasoning
                    reason={useExplanationStore.getState().explanation?.recommendation_reasoning?.find(r => r.recommendation_id === tip.id)?.reason}
                  />
                </div>
              ))}
            </div>
          ) : streamError ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center bg-white rounded-4xl border border-dashed border-slate-200">
              <AlertCircle className="w-10 h-10 text-slate-200" />
              <div>
                <p className="text-sm font-bold text-slate-400 italic">Couldn't generate AI tips.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRetry}
                  className="text-xs text-green-600 font-black mt-2 h-8 px-4"
                >
                  Retry Generation
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white border border-slate-100 rounded-3xl" />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(CoachingTipsCard);
