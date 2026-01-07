import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon,
  accentColor = 'green',
  delay = 0 
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400 bg-green-500/15 border-green-500/20';
    if (trend === 'down') return 'text-red-400 bg-red-500/15 border-red-500/20';
    return 'text-slate-400 bg-slate-500/15 border-slate-500/20';
  };

  const accentColors = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-purple-500 to-violet-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-red-500 to-rose-600',
  };

  return (
    <div 
      className="kpi-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top accent line */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentColors[accentColor]} 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`} 
      />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentColors[accentColor]} 
          flex items-center justify-center shadow-lg`}
          style={{ boxShadow: `0 8px 16px -4px rgba(34, 197, 94, 0.2)` }}
        >
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        
        {trendValue && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
            border ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className="text-3xl font-display font-bold text-white tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}



