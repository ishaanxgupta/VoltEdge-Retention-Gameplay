import { Crown, Users, ShoppingCart, Moon, TrendingUp, DollarSign } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, Legend, PieChart, Pie 
} from 'recharts';
import ChartContainer from '../components/ui/ChartContainer';
import Badge from '../components/ui/Badge';
import segmentData from '../data/segments.json';

const segmentIcons = {
  power: Crown,
  regular: Users,
  transactional: ShoppingCart,
  dormant: Moon,
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-2">{data.name}</p>
        <div className="space-y-1 text-sm">
          <p className="text-slate-400">
            Retention: <span className="text-white font-medium">{data.retention90Day}%</span>
          </p>
          <p className="text-slate-400">
            Revenue: <span className="text-white font-medium">{data.revenueContribution}%</span>
          </p>
          <p className="text-slate-400">
            Users: <span className="text-white font-medium">{data.count.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function SegmentPerformance() {
  const { segments, callout } = segmentData;

  const retentionData = segments.map(s => ({
    name: s.name,
    retention90Day: s.retention90Day,
    color: s.color,
  }));

  const revenueData = segments.map(s => ({
    name: s.name,
    revenueContribution: s.revenueContribution,
    color: s.color,
  }));

  return (
    <div className="space-y-6">
      {/* Callout Banner */}
      <div className="card border-green-500/30 bg-green-500/5 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-white">{callout.title}</h3>
              <Badge variant="success">Key Insight</Badge>
            </div>
            <p className="text-slate-400 text-sm">{callout.text}</p>
          </div>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map((segment, index) => {
          const Icon = segmentIcons[segment.id];
          return (
            <div 
              key={segment.id}
              className="card animate-slide-up group hover:border-slate-600/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${segment.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: segment.color }} />
                </div>
                <Badge 
                  variant={segment.id === 'power' ? 'success' : segment.id === 'dormant' ? 'danger' : 'default'}
                >
                  {segment.percentage}%
                </Badge>
              </div>
              
              <h4 className="font-display font-semibold text-white mb-1">{segment.name}</h4>
              <p className="text-xs text-slate-500 mb-4">{segment.description}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/50">
                <div>
                  <p className="text-xs text-slate-400">90-Day Retention</p>
                  <p className="text-lg font-bold text-white">{segment.retention90Day}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Revenue Share</p>
                  <p className="text-lg font-bold text-white">{segment.revenueContribution}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Avg Order</p>
                  <p className="text-lg font-bold text-white">${segment.avgOrderValue}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Churn Rate</p>
                  <p className={`text-lg font-bold ${segment.churnRate > 10 ? 'text-red-400' : 'text-white'}`}>
                    {segment.churnRate}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention by Segment */}
        <ChartContainer
          title="90-Day Retention by Segment"
          subtitle="Percentage of users retained after 90 days"
          insight="Power Users show 78.5% retention — nearly 4x the average. Focusing on converting Regular users 
            to Power status would significantly impact overall retention metrics."
          delay={500}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4d" vertical={false} />
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="retention90Day" radius={[8, 8, 0, 0]} barSize={50}>
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Revenue by Segment */}
        <ChartContainer
          title="Revenue Contribution by Segment"
          subtitle="Percentage of total revenue generated"
          insight="Despite being only 14% of users, Power Users generate 62% of revenue. 
            This concentration highlights both the opportunity and risk in the current customer mix."
          delay={600}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4d" vertical={false} />
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 70]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenueContribution" radius={[8, 8, 0, 0]} barSize={50}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      {/* Segment Distribution Visual */}
      <ChartContainer
        title="User Distribution by Segment"
        subtitle="Current customer base composition"
        delay={700}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value.toLocaleString(), name]}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-4">
            {segments.map((segment) => (
              <div key={segment.id} className="flex items-center gap-4">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-medium">{segment.name}</span>
                    <span className="text-sm text-slate-400">{segment.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${segment.percentage}%`, 
                        backgroundColor: segment.color 
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm text-slate-400 w-20 text-right">
                  {segment.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ChartContainer>
    </div>
  );
}


