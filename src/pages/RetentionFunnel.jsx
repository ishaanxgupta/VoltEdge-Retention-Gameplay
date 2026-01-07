import { AlertTriangle, ArrowDown, TrendingDown, Smartphone, ShoppingBag, Users, UserCheck, Crown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import ChartContainer from '../components/ui/ChartContainer';
import Badge from '../components/ui/Badge';
import funnelData from '../data/funnel.json';

// Assign colors to stages
const stageColors = {
  registration: '#22c55e',
  first_purchase: '#3b82f6',
  app_adoption: '#8b5cf6',
  repeat_purchase: '#f59e0b',
  ecosystem_user: '#ef4444',
};

const stageIcons = {
  registration: UserCheck,
  first_purchase: ShoppingBag,
  app_adoption: Smartphone,
  repeat_purchase: TrendingDown,
  ecosystem_user: Crown,
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{data.name}</p>
        <p className="text-2xl font-bold text-white">{data.percentage}%</p>
        <p className="text-xs text-slate-400">{data.count.toLocaleString()} customers</p>
        {data.dropoff > 0 && (
          <p className="text-xs text-red-400 mt-1">
            -{data.dropoff}% drop from previous
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function RetentionFunnel() {
  const { stages, criticalDropoff } = funnelData;

  // Add colors to stages
  const stagesWithColors = stages.map(stage => ({
    ...stage,
    color: stageColors[stage.id] || '#64748b'
  }));

  return (
    <div className="space-y-6">
      {/* Critical Dropoff Alert */}
      <div className="card border-amber-500/30 bg-amber-500/5 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-white">Critical Drop-off Identified</h3>
              <Badge variant="warning">Action Required</Badge>
            </div>
            <p className="text-slate-400 text-sm mb-2">
              <span className="text-white font-medium">{criticalDropoff.stage}</span>: {criticalDropoff.percentage}% drop-off
            </p>
            <p className="text-slate-500 text-sm">{criticalDropoff.insight}</p>
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <ChartContainer
        title="Customer Retention Funnel"
        subtitle="Journey from registration to ecosystem builder status"
        insight="Only 10.9% of customers adopt the VoltEdge app, and just 0.43% become Ecosystem Builders. 
          The app adoption stage represents the single largest opportunity with 89.1% drop-off."
        delay={100}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Funnel */}
          <div className="space-y-3">
            {stagesWithColors.map((stage, index) => {
              const widthPercentage = Math.max(stage.percentage, 15); // Minimum width for visibility
              const isDropoff = stage.dropoff > 50;
              
              return (
                <div key={stage.id} className="relative animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Stage Bar */}
                  <div 
                    className="relative h-16 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                    style={{ 
                      width: `${widthPercentage}%`,
                      marginLeft: `${(100 - widthPercentage) / 2}%`
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-90"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div className="relative h-full flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium text-sm truncate">{stage.name}</span>
                        {isDropoff && (
                          <Badge variant="danger" size="xs">
                            -{stage.dropoff}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold text-lg">{stage.percentage}%</span>
                        <p className="text-white/70 text-xs">{stage.count.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dropoff Arrow */}
                  {index < stages.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="flex items-center gap-1 text-slate-500">
                        <ArrowDown className="w-4 h-4" />
                        {stagesWithColors[index + 1].dropoff > 0 && (
                          <span className={`text-xs ${stagesWithColors[index + 1].dropoff > 50 ? 'text-red-400' : 'text-amber-400'}`}>
                            -{stagesWithColors[index + 1].dropoff}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bar Chart Alternative View */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stagesWithColors} 
                layout="vertical"
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="percentage" 
                  radius={[0, 8, 8, 0]}
                  barSize={35}
                >
                  {stagesWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ChartContainer>

      {/* Stage-by-Stage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stagesWithColors.map((stage, index) => {
          const Icon = stageIcons[stage.id] || Users;
          return (
            <div 
              key={stage.id}
              className="card animate-slide-up text-center"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div 
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${stage.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: stage.color }} />
              </div>
              <p className="text-sm text-slate-400 mb-1">{stage.name}</p>
              <p className="text-2xl font-display font-bold text-white">{stage.percentage}%</p>
              <p className="text-xs text-slate-500 mt-1">
                {stage.count.toLocaleString()} customers
              </p>
              {stage.dropoff > 0 && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className={`text-xs ${stage.dropoff > 50 ? 'text-red-400' : 'text-amber-400'}`}>
                    -{stage.dropoff}% drop
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key Insight Card */}
      <div className="card border-purple-500/30 bg-purple-500/5 animate-slide-up" style={{ animationDelay: '600ms' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white mb-2">App Adoption: The Critical Lever</h3>
            <p className="text-slate-400 text-sm">
              With only <span className="text-purple-400 font-semibold">10.9%</span> of customers adopting the VoltEdge app, 
              this represents the single largest opportunity for retention improvement. App users show significantly lower 
              churn rates and higher lifetime value. Focus on post-purchase activation campaigns to drive app adoption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
