interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ label, value, sub, color = 'text-bentoli-green', icon, trend }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-1 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
        {icon && <span className="text-slate-600 dark:text-slate-300">{icon}</span>}
      </div>
      <div className={`text-2xl font-bold font-mono ${color} leading-none mt-1`}>{value}</div>
      {sub && (
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{sub}</div>
      )}
      {trend && (
        <div className={`text-[10px] font-medium mt-0.5 ${trend === 'up' ? 'text-bentoli-green' : trend === 'down' ? 'text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {trend === 'up' ? '▲ Benefit' : trend === 'down' ? '▼ Loss' : '— Neutral'}
        </div>
      )}
    </div>
  );
}
