interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  center?: boolean;
  className?: string;
  secondary?: string;
  trendLabel?: string;
}

export function MetricCard({ label, value, sub, color = 'text-bentoli-green', icon, trend, center = false, className = '', secondary, trendLabel }: Props) {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-1 hover:shadow-md transition-all ${className}`}>
      <div className={`flex ${center ? 'items-center justify-center' : 'items-start justify-between'} gap-2`}>
        <span className={`text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 ${center ? 'text-center' : ''}`}>{label}</span>
        {!center && icon && <span className="text-slate-600 dark:text-slate-300">{icon}</span>}
      </div>
      <div className={`text-2xl font-bold font-mono ${color} leading-none mt-1 ${center ? 'text-center' : ''}`}>{value}</div>
      {sub && (
        <div className={`text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 ${center ? 'text-center' : ''}`}>{sub}</div>
      )}
      {secondary && (
        <div className={`text-sm font-mono text-slate-700 dark:text-slate-200 mt-1 ${center ? 'text-center' : ''}`}>{secondary}</div>
      )}
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-medium mt-0.5 ${center ? 'justify-center' : ''}`}>
          <span className={`${trend === 'up' ? 'text-bentoli-green' : trend === 'down' ? 'text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}</span>
          <span className={`${trend === 'up' ? 'text-bentoli-green' : trend === 'down' ? 'text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>{trendLabel ?? (trend === 'up' ? 'Benefit' : trend === 'down' ? 'Loss' : 'Neutral')}</span>
        </div>
      )}
    </div>
  );
}
