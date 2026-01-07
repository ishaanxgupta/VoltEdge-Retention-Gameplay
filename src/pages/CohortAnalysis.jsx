import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartContainer from '../components/ui/ChartContainer';
import Select from '../components/ui/Select';
import cohortData from '../data/cohorts.json';

const getRetentionColor = (value) => {
  if (value === null) return 'bg-slate-800/30';
  if (value >= 70) return 'bg-green-500';
  if (value >= 50) return 'bg-green-600';
  if (value >= 40) return 'bg-emerald-600';
  if (value >= 30) return 'bg-yellow-600';
  if (value >= 20) return 'bg-orange-600';
  return 'bg-red-600';
};

const getRetentionOpacity = (value) => {
  if (value === null) return '0.1';
  return Math.max(0.3, value / 100);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm text-slate-400 mb-2">Week {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300">{entry.dataKey}:</span>
            <span className="text-white font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CohortAnalysis() {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const segmentOptions = [
    { value: 'all', label: 'All Segments' },
    { value: 'power', label: 'Power Users' },
    { value: 'regular', label: 'Regular Users' },
    { value: 'transactional', label: 'Transactional' },
  ];

  const monthOptions = [
    { value: 'all', label: 'All Months' },
    { value: 'q4', label: 'Q4 2025' },
    { value: 'q3', label: 'Q3 2025' },
    { value: 'q2', label: 'Q2 2025' },
    { value: 'q1', label: 'Q1 2025' },
  ];

  const weeks = ['week1', 'week2', 'week3', 'week4', 'week5', 'week6', 'week7', 'week8', 'week9', 'week10', 'week11', 'week12'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card animate-slide-up">
        <div className="flex flex-wrap items-end gap-4">
          <Select
            label="Segment"
            options={segmentOptions}
            value={selectedSegment}
            onChange={setSelectedSegment}
            className="w-48"
          />
          <Select
            label="Signup Month"
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="w-48"
          />
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-slate-400">High Retention (70%+)</span>
            <div className="w-2 h-2 rounded-full bg-yellow-500 ml-4" />
            <span className="text-xs text-slate-400">Medium (30-50%)</span>
            <div className="w-2 h-2 rounded-full bg-red-500 ml-4" />
            <span className="text-xs text-slate-400">Low (&lt;20%)</span>
          </div>
        </div>
      </div>

      {/* Cohort Heatmap */}
      <ChartContainer
        title="Retention Cohort Heatmap"
        subtitle="Weekly retention rates by signup month"
        insight="Q4 2025 cohorts show improved early retention (77% at week 2 vs 71% for Q1). 
          This improvement is attributed to the enhanced onboarding flow launched in September."
        delay={100}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="text-left text-xs text-slate-400 font-medium pb-3 pr-4">Cohort</th>
                {weeks.map((week, i) => (
                  <th key={week} className="text-center text-xs text-slate-400 font-medium pb-3 px-1">
                    W{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.heatmapData.map((row, rowIndex) => (
                <tr key={row.cohort} className="animate-slide-up" style={{ animationDelay: `${rowIndex * 50}ms` }}>
                  <td className="text-sm text-white font-medium py-1 pr-4">{row.cohort}</td>
                  {weeks.map((week) => {
                    const value = row[week];
                    return (
                      <td key={week} className="p-1">
                        <div 
                          className={`cohort-cell w-12 h-10 flex items-center justify-center text-xs font-medium
                            ${value === null ? 'text-slate-600' : 'text-white'}`}
                          style={{ 
                            backgroundColor: value === null 
                              ? 'rgba(51, 65, 85, 0.2)' 
                              : `rgba(34, 197, 94, ${getRetentionOpacity(value)})`,
                            border: value === null ? '1px dashed rgba(51, 65, 85, 0.3)' : 'none'
                          }}
                        >
                          {value !== null ? `${value}%` : '-'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>

      {/* Cohort Comparison Line Chart */}
      <ChartContainer
        title="Quarterly Cohort Comparison"
        subtitle="Retention curves by quarter"
        insight="Q4 2025 is showing the strongest retention trajectory. If this trend continues, 
          we project 90-day retention could reach 27% — a 4 percentage point improvement from baseline."
        delay={200}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cohortData.cohortComparison} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4d" vertical={false} />
              <XAxis 
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `W${value}`}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-slate-400 text-sm">{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="Q1_2025" 
                stroke="#94a3b8" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#94a3b8' }}
              />
              <Line 
                type="monotone" 
                dataKey="Q2_2025" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="Q3_2025" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#f59e0b' }}
              />
              <Line 
                type="monotone" 
                dataKey="Q4_2025" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#22c55e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Best Cohort', value: 'Oct 2025', metric: '25% at W12', color: 'green' },
          { label: 'Worst Cohort', value: 'Aug 2025', metric: '22% at W8', color: 'red' },
          { label: 'Avg Week 4 Drop', value: '51%', metric: 'from signup', color: 'amber' },
          { label: 'Stabilization Point', value: 'Week 9', metric: '<2% variance', color: 'blue' },
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="card animate-slide-up text-center"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-display font-bold text-${stat.color}-400`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.metric}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



