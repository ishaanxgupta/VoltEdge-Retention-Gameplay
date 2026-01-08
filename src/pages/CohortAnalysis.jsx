import { useState, useMemo } from 'react';
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

// Helper function to determine quarter from month string
const getQuarterFromMonth = (monthStr) => {
  const month = monthStr.split(' ')[0];
  if (['Jan', 'Feb', 'Mar'].includes(month)) return 'q1';
  if (['Apr', 'May', 'Jun'].includes(month)) return 'q2';
  if (['Jul', 'Aug', 'Sep'].includes(month)) return 'q3';
  if (['Oct', 'Nov', 'Dec'].includes(month)) return 'q4';
  return null;
};

// Helper function to get year from cohort string
const getYearFromCohort = (cohortStr) => {
  const parts = cohortStr.split(' ');
  return parts.length > 1 ? parts[1] : '2025';
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

  // Filter heatmap data based on selected month/quarter
  const filteredHeatmapData = useMemo(() => {
    if (selectedMonth === 'all') {
      return cohortData.heatmapData;
    }
    
    return cohortData.heatmapData.filter(row => {
      const quarter = getQuarterFromMonth(row.cohort);
      return quarter === selectedMonth;
    });
  }, [selectedMonth]);

  // Filter cohort comparison data based on selected month/quarter
  const filteredCohortComparison = useMemo(() => {
    if (selectedMonth === 'all') {
      return cohortData.cohortComparison;
    }

    // Map quarter selection to quarter keys
    const quarterKeyMap = {
      'q1': 'Q1_2025',
      'q2': 'Q2_2025',
      'q3': 'Q3_2025',
      'q4': 'Q4_2025',
    };

    const selectedQuarterKey = quarterKeyMap[selectedMonth];
    if (!selectedQuarterKey) return cohortData.cohortComparison;

    // Return only the selected quarter's data
    return cohortData.cohortComparison.map(week => ({
      week: week.week,
      [selectedQuarterKey]: week[selectedQuarterKey],
    }));
  }, [selectedMonth]);

  // Calculate summary stats from filtered data
  const summaryStats = useMemo(() => {
    if (filteredHeatmapData.length === 0) {
      return [
        { label: 'Best Cohort', value: 'N/A', metric: 'No data', color: 'green' },
        { label: 'Worst Cohort', value: 'N/A', metric: 'No data', color: 'red' },
        { label: 'Avg Week 4 Drop', value: 'N/A', metric: 'No data', color: 'amber' },
        { label: 'Stabilization Point', value: 'N/A', metric: 'No data', color: 'blue' },
      ];
    }

    // Find best and worst cohorts based on week 12 retention (or latest available week)
    let bestCohort = filteredHeatmapData[0];
    let worstCohort = filteredHeatmapData[0];
    let bestRetention = -1;
    let worstRetention = 101;

    filteredHeatmapData.forEach(row => {
      // Find the latest available week value
      let latestRetention = null;
      for (let i = weeks.length - 1; i >= 0; i--) {
        if (row[weeks[i]] !== null && row[weeks[i]] !== undefined) {
          latestRetention = row[weeks[i]];
          break;
        }
      }

      if (latestRetention !== null) {
        if (latestRetention > bestRetention) {
          bestRetention = latestRetention;
          bestCohort = row;
        }
        if (latestRetention < worstRetention) {
          worstRetention = latestRetention;
          worstCohort = row;
        }
      }
    });

    // Calculate average week 4 drop
    const week4Values = filteredHeatmapData
      .map(row => row.week4)
      .filter(val => val !== null && val !== undefined);
    const avgWeek4 = week4Values.length > 0
      ? Math.round(week4Values.reduce((sum, val) => sum + val, 0) / week4Values.length)
      : 0;
    const avgWeek4Drop = 100 - avgWeek4;

    // Find stabilization point (week where variance becomes minimal)
    let stabilizationWeek = 'Week 9';
    if (filteredHeatmapData.length > 0) {
      // Check variance across cohorts for each week
      for (let i = 8; i < weeks.length; i++) {
        const weekValues = filteredHeatmapData
          .map(row => row[weeks[i]])
          .filter(val => val !== null && val !== undefined);
        
        if (weekValues.length > 1) {
          const avg = weekValues.reduce((sum, val) => sum + val, 0) / weekValues.length;
          const variance = weekValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / weekValues.length;
          const stdDev = Math.sqrt(variance);
          
          if (stdDev < 3) { // Low variance indicates stabilization
            stabilizationWeek = `Week ${i + 1}`;
            break;
          }
        }
      }
    }

    const bestWeek = bestCohort.week12 !== null && bestCohort.week12 !== undefined 
      ? `W12: ${bestCohort.week12}%`
      : bestCohort.week11 !== null && bestCohort.week11 !== undefined
      ? `W11: ${bestCohort.week11}%`
      : 'N/A';

    const worstWeek = worstCohort.week12 !== null && worstCohort.week12 !== undefined
      ? `W12: ${worstCohort.week12}%`
      : worstCohort.week11 !== null && worstCohort.week11 !== undefined
      ? `W11: ${worstCohort.week11}%`
      : 'N/A';

    return [
      { 
        label: 'Best Cohort', 
        value: bestCohort.cohort, 
        metric: bestWeek, 
        color: 'green' 
      },
      { 
        label: 'Worst Cohort', 
        value: worstCohort.cohort, 
        metric: worstWeek, 
        color: 'red' 
      },
      { 
        label: 'Avg Week 4 Drop', 
        value: `${avgWeek4Drop}%`, 
        metric: 'from signup', 
        color: 'amber' 
      },
      { 
        label: 'Stabilization Point', 
        value: stabilizationWeek, 
        metric: '<3% variance', 
        color: 'blue' 
      },
    ];
  }, [filteredHeatmapData, weeks]);

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
            label="Signup Quarter"
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
          {selectedMonth !== 'all' && (
            <div className="ml-auto px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <span className="text-xs text-blue-400">
                Showing {filteredHeatmapData.length} cohort{filteredHeatmapData.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cohort Heatmap */}
      <ChartContainer
        title="Retention Cohort Heatmap"
        subtitle={selectedMonth !== 'all' 
          ? `Weekly retention rates for ${monthOptions.find(o => o.value === selectedMonth)?.label} cohorts`
          : "Weekly retention rates by signup month"}
        insight={selectedMonth === 'all' 
          ? "Q4 2025 cohorts show improved early retention (77% at week 2 vs 71% for Q1). This improvement is attributed to the enhanced onboarding flow launched in September."
          : `Filtered view showing ${filteredHeatmapData.length} cohort${filteredHeatmapData.length !== 1 ? 's' : ''} from ${monthOptions.find(o => o.value === selectedMonth)?.label}. Use this view to compare retention patterns within a specific quarter.`}
        delay={100}
      >
        {filteredHeatmapData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-400">No data available for the selected filter</p>
          </div>
        ) : (
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
                {filteredHeatmapData.map((row, rowIndex) => (
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
        )}
      </ChartContainer>

      {/* Cohort Comparison Line Chart */}
      <ChartContainer
        title={selectedMonth !== 'all' 
          ? `Quarterly Retention: ${monthOptions.find(o => o.value === selectedMonth)?.label}`
          : "Quarterly Cohort Comparison"}
        subtitle={selectedMonth !== 'all'
          ? `Retention curve for ${monthOptions.find(o => o.value === selectedMonth)?.label}`
          : "Retention curves by quarter"}
        insight={selectedMonth === 'all'
          ? "Q4 2025 is showing the strongest retention trajectory. If this trend continues, we project 90-day retention could reach 27% — a 4 percentage point improvement from baseline."
          : `Focused view of ${monthOptions.find(o => o.value === selectedMonth)?.label} retention performance. Compare this quarter's trajectory against the overall average.`}
        delay={200}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredCohortComparison} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
              {selectedMonth === 'all' && (
                <Legend 
                  wrapperStyle={{ paddingTop: 20 }}
                  formatter={(value) => <span className="text-slate-400 text-sm">{value}</span>}
                />
              )}
              {selectedMonth === 'all' ? (
                <>
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
                </>
              ) : (
                <Line 
                  type="monotone" 
                  dataKey={Object.keys(filteredCohortComparison[0] || {}).find(key => key !== 'week') || 'Q1_2025'}
                  stroke={selectedMonth === 'q1' ? '#94a3b8' : 
                         selectedMonth === 'q2' ? '#3b82f6' : 
                         selectedMonth === 'q3' ? '#f59e0b' : '#22c55e'}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <div 
            key={stat.label}
            className="card animate-slide-up text-center"
            style={{ animationDelay: `${(index + 3) * 100}ms` }}
          >
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-display font-bold ${
              stat.color === 'green' ? 'text-green-400' :
              stat.color === 'red' ? 'text-red-400' :
              stat.color === 'amber' ? 'text-amber-400' :
              'text-blue-400'
            }`}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stat.metric}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
