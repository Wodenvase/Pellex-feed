interface Slice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  slices: Slice[];
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ title, slices, centerLabel, centerValue }: Props) {
  const total = slices.reduce((s, sl) => s + Math.max(sl.value, 0), 0);
  if (total === 0) return null;

  const r = 52;
  const cx = 80;
  const cy = 80;
  const stroke = 22;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = slices
    .filter(sl => sl.value > 0)
    .map(sl => {
      const pct = sl.value / total;
      const dash = pct * circumference;
      const seg = { ...sl, dash, offset, pct };
      offset += dash;
      return seg;
    });

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
      <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">{title}</h4>
      <div className="flex items-center gap-4">
        <svg width={160} height={160} className="flex-shrink-0">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset + circumference / 4}
              style={{ transition: 'stroke-dasharray 0.4s ease' }}
            />
          ))}
          {centerLabel && (
            <>
              <text x={cx} y={cy - 6} textAnchor="middle" fontSize={9} fill="#94a3b8">{centerLabel}</text>
              <text x={cx} y={cy + 10} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#f1f5f9">{centerValue}</text>
            </>
          )}
        </svg>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-slate-400 truncate">{seg.label}</div>
                <div className="text-[11px] font-semibold text-slate-200 font-mono">{seg.value.toFixed(2)}</div>
              </div>
              <span className="text-[10px] text-slate-500">{(seg.pct * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
