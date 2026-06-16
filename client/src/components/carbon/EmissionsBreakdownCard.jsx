import React from 'react';
import { Card, CardContent } from '../ui/card';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid
} from 'recharts';
import { Info, PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

const COLORS = {
  Transport: '#10b981',
  Food: '#f59e0b',
  Energy: '#3b82f6',
  Shopping: '#8b5cf6',
};

const EmissionsBreakdownCard = ({ categoryBreakdown, coachInsight, history = [] }) => {
  const [activeView, setActiveView] = React.useState('breakdown'); // breakdown, comparison, trends

  const chartData = [
    { name: 'Transport', value: categoryBreakdown?.transport ?? 0 },
    { name: 'Food', value: categoryBreakdown?.food ?? 0 },
    { name: 'Energy', value: categoryBreakdown?.energy ?? 0 },
    { name: 'Shopping', value: categoryBreakdown?.shopping ?? 0 },
  ].filter(d => d.value > 0);

  const historyData = history.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: item.totalFootprint,
    ...item.categories
  })).reverse(); // Oldest first for trend

  const renderChart = () => {
    switch (activeView) {
      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: -20, right: 30, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                width={100}
              />
              <Tooltip
                formatter={(value) => [`${Math.round(value)} kg`, 'CO₂']}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="value" radius={999} barSize={24}>
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'trends':
        return (
          <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-zinc-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-zinc-800 transition-all duration-500 group/trends">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-zinc-900 flex items-center justify-center shadow-2xl shadow-slate-200 dark:shadow-none group-hover/trends:scale-110 transition-transform duration-500">
                <TrendingUp size={36} className="text-slate-300 dark:text-zinc-700 group-hover/trends:text-primary transition-colors" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 border-4 border-white dark:border-zinc-950 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-zinc-50 italic">Advanced Analytics</h4>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-black">Historical Intelligence</p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                Coming Soon
              </div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium max-w-[200px] leading-relaxed">
                We're building a smarter way to track your progress over months.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={6}
                dataKey="value"
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
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="h-full flex flex-col border-none bg-white dark:bg-zinc-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[3rem]">
      <CardContent className="p-10 flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">Detailed Analysis</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-zinc-50 italic tracking-tight">Carbon Analytics</h3>
          </div>

          <div className="flex p-1.5 bg-slate-100 dark:bg-zinc-800/50 rounded-[1.5rem] w-fit shadow-inner">
            <button
              onClick={() => setActiveView('breakdown')}
              className={cn(
                "p-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2",
                activeView === 'breakdown' ? "bg-white dark:bg-zinc-700 shadow-md text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              )}
            >
              <PieIcon size={18} />
              {activeView === 'breakdown' && <span className="text-[10px] font-black uppercase tracking-wider">Breakdown</span>}
            </button>
            <button
              onClick={() => setActiveView('comparison')}
              className={cn(
                "p-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2",
                activeView === 'comparison' ? "bg-white dark:bg-zinc-700 shadow-md text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              )}
            >
              <BarChart3 size={18} />
              {activeView === 'comparison' && <span className="text-[10px] font-black uppercase tracking-wider">Compare</span>}
            </button>
            <button
              onClick={() => setActiveView('trends')}
              className={cn(
                "p-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2",
                activeView === 'trends' ? "bg-white dark:bg-zinc-700 shadow-md text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              )}
            >
              <TrendingUp size={18} />
              {activeView === 'trends' && <span className="text-[10px] font-black uppercase tracking-wider">Trends</span>}
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full mb-10">
          {renderChart()}
        </div>

        {coachInsight && activeView !== 'trends' && (
          <div className="bg-blue-50/60 rounded-[2rem] p-6 border border-blue-100/50 flex gap-4 mt-auto">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Info size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Coach Insight</p>
              <p className="text-xs text-blue-900/80 leading-relaxed font-bold italic">{coachInsight}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmissionsBreakdownCard;
