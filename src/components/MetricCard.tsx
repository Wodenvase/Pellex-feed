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
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</span>
        {icon && <span className="text-slate-600">{icon}</span>}
      </div>
      <div className={`text-2xl font-bold font-mono ${color} leading-none mt-1`}>{value}</div>
      {sub && (
        <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
      )}
      {trend && (
        <div className={`text-[10px] font-medium mt-0.5 ${trend === 'up' ? 'text-bentoli-green' : trend === 'down' ? 'text-rose-400' : 'text-slate-500'}`}>
          {trend === 'up' ? '▲ Benefit' : trend === 'down' ? '▼ Loss' : '— Neutral'}
        </div>
      )}
    </div>
  );
}
