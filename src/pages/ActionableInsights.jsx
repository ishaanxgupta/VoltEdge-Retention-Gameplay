import { Lightbulb, Rocket, Target, Crown, Clock, Zap, ArrowRight, CheckCircle2, Smartphone, RefreshCw, Layers } from 'lucide-react';
import Badge from '../components/ui/Badge';
import insightsData from '../data/insights.json';

const impactColors = {
  Critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  High: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const categoryIcons = {
  activation: Smartphone,
  retention: RefreshCw,
  expansion: Layers,
};

const sectionIcons = {
  first14Days: Rocket,
  day15to60: Target,
  powerUsers: Crown,
};

export default function ActionableInsights() {
  const { topInsights, actionRecommendations, quickWins } = insightsData;

  return (
    <div className="space-y-6">
      {/* Top Insights */}
      <div className="animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="font-display text-lg font-semibold text-white">Top 3 Retention Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {topInsights.map((insight, index) => {
            const colors = impactColors[insight.impact];
            const CategoryIcon = categoryIcons[insight.category] || Lightbulb;
            return (
              <div 
                key={insight.id}
                className={`card ${colors.bg} ${colors.border} border animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <CategoryIcon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <Badge variant={insight.impact === 'Critical' ? 'danger' : insight.impact === 'High' ? 'warning' : 'info'}>
                      {insight.impact} Impact
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className={`text-3xl font-display font-bold ${colors.text}`}>
                    {insight.metric}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{insight.metricLabel}</p>
                </div>
                
                <h3 className="font-display font-semibold text-white mb-2">{insight.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{insight.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="space-y-6">
        {Object.entries(actionRecommendations).map(([key, section], sectionIndex) => {
          const Icon = sectionIcons[key] || Target;
          const priorityColors = {
            Critical: { accent: 'from-red-500 to-rose-600', badge: 'danger' },
            High: { accent: 'from-amber-500 to-orange-600', badge: 'warning' },
            Medium: { accent: 'from-blue-500 to-cyan-600', badge: 'info' },
          };
          const colors = priorityColors[section.priority];
          
          return (
            <div 
              key={key}
              className="card animate-slide-up"
              style={{ animationDelay: `${(sectionIndex + 3) * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.accent} 
                  flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-semibold text-white text-lg">{section.title}</h3>
                    <Badge variant={colors.badge}>{section.priority} Priority</Badge>
                  </div>
                  <p className="text-sm text-slate-400">
                    {key === 'first14Days' && 'Critical activation window — focus on app adoption and product registration'}
                    {key === 'day15to60' && 'Repeat purchase acceleration — drive second purchase within optimal window'}
                    {key === 'powerUsers' && 'High-value retention — maximize LTV and ecosystem expansion'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {section.actions.map((action, actionIndex) => (
                  <div 
                    key={actionIndex}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 
                      hover:bg-slate-800/50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center 
                      text-slate-400 group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium mb-2">{action.action}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                          {action.expectedImpact}
                        </span>
                        <span className="text-slate-500">
                          Effort: <span className="text-slate-400">{action.effort}</span>
                        </span>
                        <span className="text-slate-500">
                          Timeline: <span className="text-slate-400">{action.timeline}</span>
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-green-400 
                      group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Wins */}
      <div className="card animate-slide-up" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-green-400" />
          <h3 className="font-display font-semibold text-white">Quick Wins</h3>
          <Badge variant="success">Low Effort, High Value</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickWins.map((win, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 
                transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">{win.timeline}</span>
              </div>
              <h4 className="font-medium text-white mb-2 group-hover:text-green-400 transition-colors">
                {win.title}
              </h4>
              <p className="text-sm text-slate-400">{win.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent 
        animate-slide-up" style={{ animationDelay: '700ms' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 
            flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-lg mb-2">
              Executive Summary: Path to Improved Retention
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Based on our analysis, a focused execution on these three pillars could significantly 
              reduce churn and increase customer lifetime value:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-800/30">
                <p className="text-green-400 font-semibold mb-1">-10% Churn</p>
                <p className="text-xs text-slate-400">From app adoption improvements (28.7% → 12.3%)</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30">
                <p className="text-green-400 font-semibold mb-1">+12% Repeat Purchase</p>
                <p className="text-xs text-slate-400">From cross-category recommendations</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30">
                <p className="text-green-400 font-semibold mb-1">₹100-170 Uplift</p>
                <p className="text-xs text-slate-400">Per user from accessories & trade-ins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
