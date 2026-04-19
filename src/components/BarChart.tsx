interface Bar {
  label: string;
  control: number;
  treatment: number;
}

interface Props {
  title: string;
  bars: Bar[];
  unit?: string;
  controlColor?: string;
  treatmentColor?: string;
}

export function BarChart({ title, bars, unit = '', controlColor = '#94a3b8', treatmentColor = '#10b981' }: Props) {
  const allVals = bars.flatMap(b => [b.control, b.treatment]);
  const maxVal = Math.max(...allVals) * 1.15;
  const chartH = 140;
  const barW = 18;
  const gap = 6;
  const groupW = barW * 2 + gap + 24;
  const chartW = bars.length * groupW + 20;

  const pct = (v: number) => (v / maxVal) * chartH;

  const yTicks = 4;

  return (
    <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
      <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">{title}</h4>
      <div className="flex items-end gap-1 mb-2 overflow-x-auto">
        <div className="flex flex-col justify-between h-[140px] pr-2 text-right flex-shrink-0">
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const v = maxVal * (1 - i / yTicks);
            return (
              <span key={i} className="text-[9px] text-slate-600 leading-none">
                {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}
              </span>
            );
          })}
        </div>
        <svg width={chartW} height={chartH + 28} className="flex-shrink-0">
          {Array.from({ length: yTicks + 1 }).map((_, i) => (
            <line
              key={i}
              x1={0}
              x2={chartW}
              y1={(i / yTicks) * chartH}
              y2={(i / yTicks) * chartH}
              stroke="#334155"
              strokeWidth={0.5}
            />
          ))}
          {bars.map((bar, idx) => {
            const x = idx * groupW + 10;
            const ch = pct(bar.control);
            const th = pct(bar.treatment);
            return (
              <g key={idx}>
                <rect x={x} y={chartH - ch} width={barW} height={ch} fill={controlColor} rx={2} opacity={0.8} />
                <rect x={x + barW + gap} y={chartH - th} width={barW} height={th} fill={treatmentColor} rx={2} />
                <text
                  x={x + barW + gap / 2}
                  y={chartH + 14}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#64748b"
                >
                  {bar.label.length > 8 ? bar.label.slice(0, 8) + '…' : bar.label}
                </text>
                <text x={x + barW / 2} y={chartH - ch - 3} textAnchor="middle" fontSize={7} fill={controlColor}>
                  {bar.control.toFixed(1)}
                </text>
                <text x={x + barW + gap + barW / 2} y={chartH - th - 3} textAnchor="middle" fontSize={7} fill={treatmentColor}>
                  {bar.treatment.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm" style={{ background: controlColor, opacity: 0.8 }} />
          <span className="text-[10px] text-slate-500">Control</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm" style={{ background: treatmentColor }} />
          <span className="text-[10px] text-slate-500">Treatment</span>
        </div>
        {unit && <span className="text-[10px] text-slate-600 ml-auto">{unit}</span>}
      </div>
    </div>
  );
}
