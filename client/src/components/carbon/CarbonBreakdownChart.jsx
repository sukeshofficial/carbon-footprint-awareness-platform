import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CarbonBreakdownChart = ({ data, loading }) => {
  if (!data && !loading) {
    return (
      <Card className="h-full border border-slate-100 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="h-[250px] flex flex-col items-center justify-center text-center p-6">
          <p className="text-sm font-medium text-slate-500">Breakdown Unavailable</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
            We need your lifestyle details to calculate the category-wise impact.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data ? [
    { name: 'Transport', value: data.transport },
    { name: 'Food', value: data.food },
    { name: 'Energy', value: data.energy },
    { name: 'Shopping', value: data.shopping },
  ].filter(item => item.value > 0) : [];

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  let chartContent;

  if (loading) {
    chartContent = (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  } else if (chartData.length > 0) {
    chartContent = (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[chartData.indexOf(entry) % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value) => [`${value} kg CO₂`]}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
        </PieChart>
      </ResponsiveContainer>
    );
  } else {
    chartContent = (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm">No data available for breakdown</p>
      </div>
    );
  }

  return (
    <Card className="h-full border-none shadow-premium bg-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-bold text-slate-800">Category Split</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] pt-0">
        {chartContent}
      </CardContent>
    </Card>
  );
};

CarbonBreakdownChart.propTypes = {
  data: PropTypes.shape({
    transport: PropTypes.number,
    food: PropTypes.number,
    energy: PropTypes.number,
    shopping: PropTypes.number,
  }),
  loading: PropTypes.bool
};

export default CarbonBreakdownChart;
