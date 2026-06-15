import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Leaf, Info, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import SeverityBadge from './SeverityBadge';
import TrendBadge from './TrendBadge';
import WeeklyMonthlyToggle from './WeeklyMonthlyToggle';
import { useCarbonEstimation } from '../../store/carbonEstimationStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const COLORS = {
  Transport: '#10b981',
  Food: '#f59e0b',
  Energy: '#3b82f6',
  Shopping: '#8b5cf6',
};

const CarbonDashboardCard = () => {
  const {
    estimation,
    loading,
    fetchMyEstimation,
    recalculate,
  } = useCarbonEstimation();

  const [view, setView] = useState('monthly');
  const [streamedToken, setStreamedToken] = useState('');
  const [streamedInsights, setStreamedInsights] = useState(null);
  const [streamingDone, setStreamingDone] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const esRef = useRef(null);

  useEffect(() => {
    if (!estimation) {
      fetchMyEstimation();
    }
  }, []); // eslint-disable-line

  // When estimation is available and no resolved insights, open SSE stream
  useEffect(() => {
    if (!estimation) return;

    // Already resolved from cache via stream
    if (streamedInsights) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setIsStreaming(true);
    setStreamedToken('');
    setStreamError(false);

    // Use fetch-based SSE to include Authorization header
    const controller = new AbortController();

    fetch(`${API_BASE}/carbon-estimation/me/insights/stream`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let rawBuffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          rawBuffer += decoder.decode(value, { stream: true });

          const lines = rawBuffer.split('\n');
          rawBuffer = lines.pop(); // keep incomplete line

          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') { setStreamingDone(true); continue; }
            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                setStreamedToken(prev => prev + parsed.token);
              }
              if (parsed.done && parsed.insights) {
                setStreamedInsights(parsed.insights);
                setStreamingDone(true);
              }
              if (parsed.error) {
                setStreamError(true);
              }
            } catch (_) { /* skip */ }
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Stream error:', err);
          setStreamError(true);
        }
      })
      .finally(() => setIsStreaming(false));

    esRef.current = controller;
    return () => controller.abort();
  }, [estimation]); // eslint-disable-line

  // ── Handlers ──
  const handleRecalculate = async () => {
    try {
      setStreamedInsights(null);
      setStreamedToken('');
      setStreamingDone(false);
      setStreamError(false);
      await recalculate();
    } catch (err) {
      console.error('Recalculate failed:', err);
    }
  };

  // ── Empty state ──
  if (!estimation && !loading) {
    return (
      <Card className="overflow-hidden border border-slate-100 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-center p-6">
          <Leaf className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-xl font-bold text-slate-800">Start Your Sustainability Journey</p>
          <p className="text-sm text-slate-500 mt-2 mb-6 max-w-[300px]">
            Complete your profile and carbon onboarding to see your footprint breakdown and AI-powered coaching tips.
          </p>
          <Button onClick={handleRecalculate} className="rounded-full px-8 bg-green-600 hover:bg-green-700">
            Analyze My Footprint
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Full loading state ──
  if (loading && !estimation) {
    return (
      <Card className="overflow-hidden border-none h-[500px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-green-500/40" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">Calculating your carbon impact...</p>
        </CardContent>
      </Card>
    );
  }

  const { categoryBreakdown } = estimation;
  const chartData = [
    { name: 'Transport', value: categoryBreakdown?.transport ?? 0 },
    { name: 'Food', value: categoryBreakdown?.food ?? 0 },
    { name: 'Energy', value: categoryBreakdown?.energy ?? 0 },
    { name: 'Shopping', value: categoryBreakdown?.shopping ?? 0 },
  ].filter(d => d.value > 0);

  const displayValue = view === 'weekly' ? estimation.weeklyEstimate : estimation.monthlyEstimate;

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white flex flex-col">
      {/* ── Card Body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12">

        {/* Left: Key Metrics */}
        <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-slate-50 flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Carbon Footprint</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Analysis</p>
              </div>
            </div>
            <WeeklyMonthlyToggle view={view} onChange={setView} />
          </div>

          {/* Big Number */}
          <div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">
                {displayValue?.toLocaleString() ?? '—'}
              </span>
              <span className="text-base font-bold text-slate-400">kg CO₂</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Per {view === 'weekly' ? 'Week' : 'Month'}
            </p>
          </div>

          {/* Severity & Trend */}
          <div className="flex gap-3">
            <div className="bg-slate-50 rounded-2xl p-4 flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Severity</p>
              <SeverityBadge level={estimation.severityLevel} />
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Trend</p>
              <TrendBadge trend={estimation.trendLabel} />
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 flex gap-3 mt-auto">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Coach Insight</p>
              <p className="text-xs text-blue-800/80 leading-relaxed font-medium">{estimation.explanation}</p>
            </div>
          </div>
        </div>

        {/* Right: Chart + Tips */}
        <div className="lg:col-span-7 flex flex-col divide-y divide-slate-50">
          {/* Donut Chart */}
          <div className="p-8 h-[280px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Emissions Breakdown</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="40%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={6}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1200}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${Math.round(value)} kg`, 'CO₂']}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* AI Tips */}
          <div className="p-8 flex flex-col gap-4 bg-slate-50/30 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">AI Coaching Tips</p>
              </div>
              {isStreaming && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            </div>

            {/* Streaming in progress — show raw token text */}
            {isStreaming && !streamedInsights ? (
              <div className="space-y-3">
                <div className="bg-white border border-slate-100 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1.5">Your AI Coach is thinking…</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-mono whitespace-pre-wrap">{streamedToken || '...'}</p>
                </div>
                {[1, 2].map(i => (
                  <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : streamedInsights?.tips?.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {streamedInsights.tips.map((tip, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 group hover:border-green-200 hover:shadow-sm transition-all">
                    <div className="w-7 h-7 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-[10px] font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 group-hover:text-green-700 transition-colors italic leading-snug">{tip.title}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5 font-medium">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : streamError ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-200" />
                <div>
                  <p className="text-xs font-bold text-slate-400">Couldn't generate AI tips right now.</p>
                  <Button variant="ghost" size="sm" onClick={() => { setStreamError(false); setStreamedInsights(null); setStreamedToken(''); }} className="text-xs text-green-600 font-bold mt-0.5 h-7">
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-100 rounded-2xl" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="bg-slate-900 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-slate-500 font-medium">
          Model v2 · Calculation Engine 2.0 · Powered by OpenRouter
        </p>
        <Button
          onClick={handleRecalculate}
          disabled={loading}
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white font-bold text-[11px] rounded-full px-6 h-8"
        >
          {loading ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : null}
          Refresh My Analysis
        </Button>
      </div>
    </div>
  );
};

export default CarbonDashboardCard;
