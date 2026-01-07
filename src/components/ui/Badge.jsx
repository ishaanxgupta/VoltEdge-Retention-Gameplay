export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    success: 'bg-green-500/15 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/15 text-red-400 border-red-500/20',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium border 
      ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}


