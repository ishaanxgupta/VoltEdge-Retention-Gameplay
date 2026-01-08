import { ChevronDown } from 'lucide-react';

export default function Select({ label, options, value, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-800/50 border border-slate-700/50 
            rounded-xl px-4 py-2.5 pr-10 text-sm text-white
            focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20
            transition-all duration-200 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}





