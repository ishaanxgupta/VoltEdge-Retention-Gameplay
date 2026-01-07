export default function ChartContainer({ 
  title, 
  subtitle, 
  insight, 
  children, 
  action,
  className = '',
  delay = 0 
}) {
  return (
    <div 
      className={`chart-container animate-slide-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div className="relative">
        {children}
      </div>

      {/* Insight Text */}
      {insight && (
        <div className="insight-text">
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">💡</span>
            <p>{insight}</p>
          </div>
        </div>
      )}
    </div>
  );
}


