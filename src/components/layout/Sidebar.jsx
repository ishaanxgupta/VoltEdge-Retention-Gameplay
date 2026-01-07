import { 
  LayoutDashboard, 
  Filter, 
  Grid3X3, 
  Users, 
  Activity, 
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

const iconMap = {
  overview: LayoutDashboard,
  funnel: Filter,
  cohort: Grid3X3,
  segments: Users,
  engagement: Activity,
  insights: Lightbulb,
};

export default function Sidebar({ pages, activePage, onPageChange, collapsed, onToggle }) {
  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 
        transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 
            flex items-center justify-center shadow-lg shadow-green-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display font-bold text-white text-lg tracking-tight">VoltEdge</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Analytics</p>
            </div>
          )}
        </div>
        <button 
          onClick={onToggle}
          className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 
            flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {!collapsed && (
          <p className="text-[10px] text-slate-500 uppercase tracking-wider px-4 py-2">
            Dashboard
          </p>
        )}
        {pages.map((page, index) => {
          const Icon = iconMap[page.id] || LayoutDashboard;
          const isActive = activePage === page.id;
          
          return (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                transition-all duration-200 group
                ${isActive 
                  ? 'text-white bg-slate-800/70' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }
                animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
              title={collapsed ? page.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 
                  bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 
                ${isActive ? 'text-green-400' : ''}`} />
              {!collapsed && (
                <span className="font-medium text-sm whitespace-nowrap">{page.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Stats */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/50">
          <div className="bg-slate-800/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-400">Live Data</span>
            </div>
            <p className="text-xs text-slate-500">
              Last updated: Just now
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}


