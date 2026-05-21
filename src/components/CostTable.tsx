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
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden`}>
      <div className={`px-4 py-2.5 border-b-2 ${accentColor} bg-white dark:bg-slate-800`}>
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">{title}</h4>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 px-4 text-slate-600 font-medium">Category</th>
            <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-300 font-medium">Control</th>
            <th className="text-right py-2 px-3 text-bentoli-green font-medium">Treatment</th>
            <th className="text-right py-2 px-3 text-bentoli-navy font-medium">Savings</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-slate-200 dark:border-slate-700 ${
                row.highlight ? 'bg-gray-50 dark:bg-slate-700 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <td className="py-2 px-4 text-slate-700 dark:text-slate-200">{row.label}</td>
              <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{fmt(row.control)}</td>
              <td className="py-2 px-3 text-right font-mono text-bentoli-green">{fmt(row.treatment)}</td>
              <td className={`py-2 px-3 text-right font-mono font-semibold ${row.savings >= 0 ? 'text-bentoli-navy' : 'text-rose-400'}`}>
                {row.savings >= 0 ? '+' : ''}{fmt(row.savings)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
