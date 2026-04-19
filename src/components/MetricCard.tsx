interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ label, value, sub, color = 'text-emerald-400', icon, trend }: Props) {
  return (
    <div className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-1 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</span>
        {icon && <span className="text-slate-600">{icon}</span>}
      </div>
      <div className={`text-2xl font-bold font-mono ${color} leading-none mt-1`}>{value}</div>
      {sub && (
        <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
      )}
      {trend && (
        <div className={`text-[10px] font-medium mt-0.5 ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-500'}`}>
          {trend === 'up' ? '▲ Benefit' : trend === 'down' ? '▼ Loss' : '— Neutral'}
        </div>
      )}
    </div>
  );
}
