import { Users, TrendingUp, Crown, DollarSign, Percent, IndianRupee } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Area, AreaChart 
} from 'recharts';
import KPICard from '../components/ui/KPICard';
import ChartContainer from '../components/ui/ChartContainer';
import kpis from '../data/kpis.json';
import retentionCurve from '../data/retentionCurve.json';

// Format currency in Indian format (₹)
const formatINR = (value) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

const formatNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toLocaleString();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm text-slate-400 mb-1">Week {label}</p>
        <p className="text-lg font-semibold text-white">
          {payload[0].value}% retained
        </p>
        <p className="text-xs text-slate-500">
          {payload[0].payload.users.toLocaleString()} users
        </p>
      </div>
    );
  }
  return null;
};

export default function ExecutiveOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Customers"
          value={formatNumber(kpis.totalUsers)}
          subtitle="Active customer base"
          icon={Users}
          trend={kpis.trends.totalUsers.direction}
          trendValue={kpis.trends.totalUsers.value}
          accentColor="green"
          delay={0}
        />
        <KPICard
          title="90-Day Retention"
          value={`${kpis.retention90Day}%`}
          subtitle="Customers retained after 90 days"
          icon={TrendingUp}
          trend={kpis.trends.retention90Day.direction}
          trendValue={kpis.trends.retention90Day.value}
          accentColor="blue"
          delay={100}
        />
        <KPICard
          title="Ecosystem Builders"
          value={kpis.powerUsers.count.toLocaleString()}
          subtitle={`${kpis.powerUsers.percentage}% of customer base`}
          icon={Crown}
          trend={kpis.trends.powerUsers.direction}
          trendValue={kpis.trends.powerUsers.value}
          accentColor="purple"
          delay={200}
        />
        <KPICard
          title="Ecosystem Revenue"
          value={`${kpis.powerUserRevenue}%`}
          subtitle="Share of total revenue"
          icon={IndianRupee}
          trend={kpis.trends.powerUserRevenue.direction}
          trendValue={kpis.trends.powerUserRevenue.value}
          accentColor="amber"
          delay={300}
        />
      </div>

      {/* Retention Curve Chart */}
      <ChartContainer
        title="Retention Decay Over Time"
        subtitle="12-week customer retention curve from first purchase"
        insight="With 71.4% overall 90-day retention, VoltEdge shows strong baseline retention. 
          Focus should be on converting the 28.6% churning customers through app adoption and cross-category expansion."
        delay={400}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={retentionCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              
              {/* Critical period highlight */}
              <ReferenceLine 
                x={4} 
                stroke="#f59e0b" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              <ReferenceLine 
                x={8} 
                stroke="#f59e0b" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              
              <Area
                type="monotone"
                dataKey="retention"
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#retentionGradient)"
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-amber-500 opacity-50" style={{ borderStyle: 'dashed' }} />
            <span className="text-slate-400">Critical Activation Window (Weeks 4-8)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-400">Retention %</span>
          </div>
        </div>
      </ChartContainer>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Order Value</p>
              <p className="text-2xl font-display font-bold text-white mt-1">
                {formatINR(kpis.avgOrderValue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Customer LTV</p>
              <p className="text-2xl font-display font-bold text-white mt-1">
                {formatINR(kpis.customerLifetimeValue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card animate-slide-up" style={{ animationDelay: '700ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Monthly Churn Rate</p>
              <p className="text-2xl font-display font-bold text-red-400 mt-1">
                {kpis.churnRate}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Percent className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
