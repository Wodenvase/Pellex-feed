interface RowData {
  label: string;
  control: number;
  treatment: number;
  savings: number;
  highlight?: boolean;
  headerBg?: string;
}

interface Props {
  title: string;
  rows: RowData[];
  accentColor?: string;
}

function fmt(v: number) {
  return v.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export function CostTable({ title, rows, accentColor = 'border-emerald-500' }: Props) {
  return (
    <div className={`bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden`}>
      <div className={`px-4 py-2.5 border-b-2 ${accentColor} bg-slate-800`}>
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">{title}</h4>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 px-4 text-slate-500 font-medium">Category</th>
            <th className="text-right py-2 px-3 text-slate-400 font-medium">Control</th>
            <th className="text-right py-2 px-3 text-emerald-400 font-medium">Treatment</th>
            <th className="text-right py-2 px-3 text-sky-400 font-medium">Savings</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-slate-700/30 ${
                row.highlight ? 'bg-slate-700/40 font-semibold' : 'hover:bg-slate-700/20'
              }`}
            >
              <td className="py-2 px-4 text-slate-300">{row.label}</td>
              <td className="py-2 px-3 text-right font-mono text-slate-400">{fmt(row.control)}</td>
              <td className="py-2 px-3 text-right font-mono text-emerald-400">{fmt(row.treatment)}</td>
              <td className={`py-2 px-3 text-right font-mono font-semibold ${row.savings >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                {row.savings >= 0 ? '+' : ''}{fmt(row.savings)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
