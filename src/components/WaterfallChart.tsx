interface Step {
  label: string;
  value: number;
  color?: string;
  isTotal?: boolean;
}

interface Props {
  title: string;
  steps: Step[];
  unit?: string;
}

export function WaterfallChart({ title, steps, unit = 'Rs/ton' }: Props) {
  let running = 0;
  const bars = steps.map(step => {
    const start = step.isTotal ? 0 : running;
    const end = step.isTotal ? step.value : running + step.value;
    running = end;
    return { ...step, start, end };
  });

  const allVals = bars.flatMap(b => [b.start, b.end]);
  const minV = Math.min(0, ...allVals);
  const maxV = Math.max(...allVals) * 1.1;
  const range = maxV - minV;

  const svgH = 160;
  const barW = 36;
  const gap = 12;
  const totalW = bars.length * (barW + gap);
  const zeroY = svgH * (1 - (0 - minV) / range);

  const toY = (v: number) => svgH * (1 - (v - minV) / range);

  return (
    <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
      <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">{title}</h4>
      <div className="overflow-x-auto">
        <svg width={totalW + 20} height={svgH + 40} className="min-w-full">
          <line x1={0} x2={totalW + 20} y1={zeroY} y2={zeroY} stroke="#334155" strokeWidth={1} strokeDasharray="4 2" />
          {bars.map((bar, i) => {
            const x = i * (barW + gap) + 10;
            const y1 = toY(bar.end);
            const y2 = toY(bar.start);
            const barTop = Math.min(y1, y2);
            const barHeight = Math.abs(y2 - y1);
            const positive = bar.end >= bar.start;
            const color = bar.isTotal
              ? '#0ea5e9'
              : bar.color || (positive ? '#10b981' : '#f43f5e');
            const labelY = barTop - 4;
            return (
              <g key={i}>
                <rect x={x} y={barTop} width={barW} height={Math.max(barHeight, 1)} fill={color} rx={3} opacity={bar.isTotal ? 1 : 0.85} />
                <text x={x + barW / 2} y={Math.max(labelY, 10)} textAnchor="middle" fontSize={8} fill={color} fontWeight="600">
                  {bar.value >= 0 ? '+' : ''}{bar.value.toFixed(1)}
                </text>
                <text x={x + barW / 2} y={svgH + 14} textAnchor="middle" fontSize={7.5} fill="#64748b">
                  {bar.label.length > 7 ? bar.label.slice(0, 7) + '…' : bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="text-[10px] text-slate-600 mt-1">{unit}</div>
    </div>
  );
}
