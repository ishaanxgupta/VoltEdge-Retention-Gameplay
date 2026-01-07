import { Bell, Search, Calendar } from 'lucide-react';

export default function Header({ title }) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 
      flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{today}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search metrics..."
            className="w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 
              rounded-xl text-sm text-white placeholder-slate-500
              focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20
              transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50
          flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50
          transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 
            flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-green-500/20">
            VE
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-white">Growth Team</p>
            <p className="text-xs text-slate-400">VoltEdge Analytics</p>
          </div>
        </div>
      </div>
    </header>
  );
}



