import { AlertCircle, TrendingDown, Users, Activity, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import ChartContainer from '../components/ui/ChartContainer';
import Badge from '../components/ui/Badge';
import engagementData from '../data/engagement.json';

const getRiskColor = (level) => {
  switch (level) {
    case 'Critical': return '#ef4444';
    case 'High': return '#f59e0b';
    case 'Low': return '#22c55e';
    default: return '#3b82f6';
  }
};

const getRiskBadgeVariant = (level) => {
  switch (level) {
    case 'Critical': return 'danger';
    case 'High': return 'warning';
    case 'Low': return 'success';
    default: return 'info';
  }
};

const getRiskIcon = (level) => {
  switch (level) {
    case 'Critical': return ShieldAlert;
    case 'High': return AlertTriangle;
    case 'Low': return ShieldCheck;
    default: return AlertCircle;
  }
};

const getEngagementColor = (level) => {
  switch (level) {
    case 'High': return '#22c55e';
    case 'Medium': return '#3b82f6';
    case 'Low': return '#f59e0b';
    case 'None': return '#ef4444';
    default: return '#64748b';
  }
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-2">
          {data.engagementLevel} Engagement
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-slate-400">
            Churn Rate: <span className="text-red-400 font-medium">{data.churnRate}%</span>
          </p>
          <p className="text-slate-400">
            Users: <span className="text-white font-medium">{data.users.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function EngagementChurn() {
  const { engagementRetentionCorrelation, atRiskSegments, engagementThreshold } = engagementData;

  // Reverse the data so High engagement appears first
  const sortedCorrelation = [...engagementRetentionCorrelation].reverse();

  return (
    <div className="space-y-6">
      {/* Threshold Insight */}
      <div className="card border-blue-500/30 bg-blue-500/5 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-white">Engagement-Churn Correlation</h3>
              <Badge variant="info">Key Threshold</Badge>
            </div>
            <p className="text-slate-400 text-sm">{engagementThreshold.insight}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-xs text-slate-400">Threshold Definition: </span>
                <span className="text-slate-200 font-medium text-sm">{engagementThreshold.definition}</span>
              </div>
              <div className="px-3 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
                <span className="text-xs text-slate-400">Churn Below Threshold: </span>
                <span className="text-red-400 font-medium">{engagementThreshold.churnBelowThreshold}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement vs Churn Rate Bar Chart */}
      <ChartContainer
        title="Churn Rate by Engagement Level"
        subtitle="How engagement impacts customer retention"
        insight="Customers with no engagement churn at 28.7% — nearly 3x the rate of highly engaged users. 
          Driving users from 'None' to even 'Low' engagement reduces churn by over 10 percentage points."
        delay={100}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedCorrelation} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4d" vertical={false} />
              <XAxis 
                dataKey="engagementLevel" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 35]}
                label={{ 
                  value: 'Churn Rate %', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: '#64748b',
                  fontSize: 12
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="churnRate" radius={[8, 8, 0, 0]} barSize={60}>
                {sortedCorrelation.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getEngagementColor(entry.engagementLevel)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-400">High Engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-400">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-400">None (At Risk)</span>
          </div>
        </div>
      </ChartContainer>

      {/* User Distribution by Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {sortedCorrelation.map((item, index) => (
          <div 
            key={item.engagementLevel}
            className="card animate-slide-up text-center"
            style={{ animationDelay: `${(index + 2) * 100}ms` }}
          >
            <div 
              className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: `${getEngagementColor(item.engagementLevel)}20` }}
            >
              <Users className="w-6 h-6" style={{ color: getEngagementColor(item.engagementLevel) }} />
            </div>
            <p className="text-sm text-slate-400 mb-1">{item.engagementLevel} Engagement</p>
            <p className="text-2xl font-display font-bold text-white">
              {item.users.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">users</p>
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <p className="text-xs text-slate-400">Churn Rate</p>
              <p 
                className="text-lg font-bold"
                style={{ color: getEngagementColor(item.engagementLevel) }}
              >
                {item.churnRate}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* At-Risk Segments Table */}
      <ChartContainer
        title="At-Risk Customer Segments"
        subtitle="Segments showing elevated churn signals based on behavior patterns"
        insight="The 'One-and-Done Buyers' segment represents the largest risk pool with 68,550 customers 
          and 57% churn. Targeting this segment with app adoption and cross-category campaigns is critical."
        delay={200}
      >
        <div className="space-y-4">
          {atRiskSegments.map((segment, index) => {
            const RiskIcon = getRiskIcon(segment.riskLevel);
            return (
              <div 
                key={segment.segment}
                className={`p-5 rounded-xl bg-slate-800/30 border animate-slide-up
                  hover:bg-slate-800/50 transition-all duration-200
                  ${segment.riskLevel === 'Critical' ? 'border-red-500/30' : 
                    segment.riskLevel === 'High' ? 'border-amber-500/30' : 'border-green-500/30'}`}
                style={{ animationDelay: `${(index + 6) * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${getRiskColor(segment.riskLevel)}15` }}
                    >
                      <RiskIcon className="w-5 h-5" style={{ color: getRiskColor(segment.riskLevel) }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{segment.segment}</h4>
                      <p className="text-sm text-slate-400">
                        {segment.size.toLocaleString()} customers
                      </p>
                    </div>
                  </div>
                  <Badge variant={getRiskBadgeVariant(segment.riskLevel)}>
                    {segment.riskLevel} Risk
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {segment.keySignals.map((signal, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-full text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <span className="text-sm text-slate-400">Estimated Churn Rate</span>
                  <span 
                    className="text-lg font-bold"
                    style={{ color: getRiskColor(segment.riskLevel) }}
                  >
                    {segment.estimatedChurnRate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {atRiskSegments.filter(s => s.riskLevel === 'Critical').length}
            </p>
            <p className="text-xs text-slate-400">Critical Segments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">
              {atRiskSegments.filter(s => s.riskLevel === 'High').length}
            </p>
            <p className="text-xs text-slate-400">High Risk Segments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {atRiskSegments.reduce((sum, s) => sum + s.size, 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Total At-Risk Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {Math.round(atRiskSegments.reduce((sum, s) => sum + s.estimatedChurnRate, 0) / atRiskSegments.length)}%
            </p>
            <p className="text-xs text-slate-400">Avg Churn Rate</p>
          </div>
        </div>
      </ChartContainer>

      {/* Risk Level Legend */}
      <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Risk Level Classification</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <Badge variant="danger" size="xs">Critical</Badge>
                <span className="text-slate-400">Churn rate &gt;40% — Immediate intervention required</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="warning" size="xs">High</Badge>
                <span className="text-slate-400">Churn rate 15-40% — Proactive outreach recommended</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" size="xs">Low</Badge>
                <span className="text-slate-400">Churn rate &lt;15% — Monitor and maintain engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
