import { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { CostTable } from './components/CostTable';
import { BarChart } from './components/BarChart';
import { DonutChart } from './components/DonutChart';
import { WaterfallChart } from './components/WaterfallChart';
import { MetricCard } from './components/MetricCard';
import { useCalculations } from './hooks/useCalculations';
import type { InputParams } from './types';
import { TrendingUp, Zap, Flame, Settings, BarChart2, DollarSign, Sun, Moon, ChevronsDown, X } from 'lucide-react';
import bentoliLogo from './assets/bentoli.png';

const DEFAULT_PARAMS: InputParams = {
  controlThroughput: 9,
  treatmentThroughput: 9.5,
  controlAmpereLoad: 168.5,
  treatmentAmpereLoad: 147.6,
  controlFCR: 1.5,
  treatmentFCR: 1.45,
  controlFeedCost: 40,
  treatmentFeedCost: 40.12,
  voltage: 440,
  powerUnitCost: 10,
  boilerFuelCost: 6.5,
  boilerFuel: 10.5,
  ratedCapacity: 10,
  dieReplacementCost: 350000,
  dieLife: 10000,
  factoryRunningTime: 22,
  fixedRunningCost: 300,
  pelexCost: 120,
  chickenSellingPrice: 90,
  pelexDosage: 0.001,
};

function fmt2(v: number) {
  return v.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function App() {
  const [params, setParams] = useState<InputParams>(DEFAULT_PARAMS);
  const [dark, setDark] = useState(false);
  const [ribbonExpanded, setRibbonExpanded] = useState(false);
  const r = useCalculations(params);

  const headerHeight = 56;
  const ribbonHeight = 140; // compact ribbon height (enough for controls)

  const costRows = [
    { label: 'Electricity Cost/ton', ...r.electricity },
    { label: 'Boiler Cost/ton', ...r.boiler },
    { label: 'Die Replacement/ton', ...r.die },
    { label: 'Fixed Factory Cost/ton', ...r.fixedFactory },
    { label: 'TOTAL DIRECT COST/TON', ...r.totalDirect, highlight: true },
  ];

  const perfRows = [
    { label: 'Throughput (ton/hr)', control: params.controlThroughput, treatment: params.treatmentThroughput, savings: r.throughputDiff },
    { label: 'Ampere Load (A)', control: params.controlAmpereLoad, treatment: params.treatmentAmpereLoad, savings: r.ampereLoadDiff },
    { label: 'FCR', control: params.controlFCR, treatment: params.treatmentFCR, savings: r.fcrDiff },
    { label: 'Feed Cost (Rs/kg)', control: params.controlFeedCost, treatment: r.treatmentFeedCost, savings: r.feedCostDiff },
  ];

  return (
    <div className={`${dark ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-800'} min-h-screen flex flex-col`}>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-5 py-3 flex items-center justify-between z-30 sticky top-0" style={{ height: headerHeight }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={bentoliLogo} alt="Bentoli" className="w-full h-full object-contain" />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100">PELEX ROI Calculator</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Control vs Treatment (Pelex) — real-time analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-300">Total ROI</span>
            <span className="text-sm font-bold text-emerald-600 font-mono">{fmt2(r.totalROI)}%</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400">on ₹{params.pelexCost}/kg</span>
          </div>

          <button
            onClick={() => setDark(d => !d)}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-sm bg-white dark:bg-slate-800"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Compact horizontal ribbon (fixed) */}
      <div
        className="fixed left-0 right-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
        style={{ top: headerHeight, height: ribbonHeight }}
      >
        <div className="px-4 py-3 h-full">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Input Parameters</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Adjust values to update results live</p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Quick ribbon — scroll horizontally for more</div>
          </div>

          <div className="h-[120px] relative">
            <div className="h-full">
              <InputPanel params={params} onChange={setParams} compact />
            </div>
            <div className="absolute right-3 top-3">
              <button
                onClick={() => setRibbonExpanded(e => !e)}
                className="flex items-center gap-2 px-3 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                aria-expanded={ribbonExpanded}
                aria-label="Expand inputs"
              >
                {ribbonExpanded ? <X size={14} /> : <ChevronsDown size={14} />}
                <span className="hidden sm:inline">{ribbonExpanded ? 'Close' : 'Expand'}</span>
              </button>
            </div>
          </div>

          {ribbonExpanded && (
            <div className="fixed left-0 right-0 z-40 top-[calc(56px+120px)] h-[60vh] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="p-4 h-full overflow-y-auto">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setRibbonExpanded(false)}
                    className="p-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    aria-label="Close inputs"
                  >
                    <X size={16} />
                  </button>
                </div>
                <InputPanel params={params} onChange={setParams} compact={false} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-5 relative" style={{ marginTop: headerHeight + ribbonHeight }}>
        <div className="space-y-6">
          <section>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard label="Direct Savings/Ton" value={`₹${fmt2(r.totalDirect.savings)}`} sub="Processing cost reduction" color="text-bentoli-navy" icon={<DollarSign size={14} />} trend="up" />
              <MetricCard label="FCR Benefit/Ton" value={`₹${fmt2(r.netIndirectRevenue)}`} sub="Net indirect revenue" color="text-bentoli-green" icon={<TrendingUp size={14} />} trend={r.netIndirectRevenue >= 0 ? 'up' : 'down'} />
              <MetricCard label="Total Return/Ton" value={`₹${fmt2(r.totalReturn)}`} sub="Direct + Indirect benefits" color="text-bentoli-navy" icon={<BarChart2 size={14} />} trend={r.totalReturn >= 0 ? 'up' : 'down'} />
              <MetricCard label="Total ROI" value={`${fmt2(r.totalROI)}%`} sub={`On ₹${params.pelexCost}/kg Pelex`} color="text-bentoli-green" icon={<TrendingUp size={14} />} trend={r.totalROI >= 0 ? 'up' : 'down'} />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CostTable title="Performance Comparison" rows={perfRows} accentColor="border-slate-600" />
            <WaterfallChart
              title="Savings Waterfall (Rs/ton)"
              steps={[
                { label: 'Electricity', value: r.electricity.savings, color: '#fbbf24' },
                { label: 'Boiler', value: r.boiler.savings, color: '#f97316' },
                { label: 'Die', value: r.die.savings, color: '#a78bfa' },
                { label: 'Fixed', value: r.fixedFactory.savings, color: '#38bdf8' },
                { label: 'Indirect', value: r.netIndirectRevenue },
                { label: 'TOTAL', value: r.totalReturn, isTotal: true },
              ]}
            />
          </section>

          <section>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b-2 border-bentoli-green bg-white dark:bg-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">ROI Summary</h4>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700">
                {[
                  { label: 'Processing Cost Savings/Ton', value: r.totalDirect.savings, sub: 'Direct Savings', color: 'text-bentoli-navy' },
                  { label: 'FCR Benefit/Ton of Feed', value: r.netIndirectRevenue, sub: 'Indirect ROI', color: 'text-bentoli-green' },
                  { label: 'Total Return/Ton of Feed', value: r.totalReturn, sub: `ROI: ${fmt2(r.totalROI)}% on ₹${params.pelexCost}`, color: 'text-bentoli-navy' },
                ].map(m => (
                  <div key={m.label} className="p-4 text-center">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
                    <div className={`text-xl font-bold font-mono ${m.color}`}>₹{fmt2(m.value)}</div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <CostTable title="Direct Processing Cost Breakdown (Rs/ton)" rows={costRows} accentColor="border-sky-500" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DonutChart
                title="Control — Cost Structure (Rs/ton)"
                slices={[
                  { label: 'Electricity', value: r.electricity.control, color: '#fbbf24' },
                  { label: 'Boiler', value: r.boiler.control, color: '#f97316' },
                  { label: 'Die Replacement', value: r.die.control, color: '#a78bfa' },
                  { label: 'Fixed Factory', value: r.fixedFactory.control, color: '#38bdf8' },
                ]}
                centerLabel="Total/ton"
                centerValue={`₹${Math.round(r.totalDirect.control)}`}
              />
              <DonutChart
                title="Treatment (Pelex) — Cost Structure (Rs/ton)"
                slices={[
                  { label: 'Electricity', value: r.electricity.treatment, color: '#fbbf24' },
                  { label: 'Boiler', value: r.boiler.treatment, color: '#f97316' },
                  { label: 'Die Replacement', value: r.die.treatment, color: '#a78bfa' },
                  { label: 'Fixed Factory', value: r.fixedFactory.treatment, color: '#10b981' },
                ]}
                centerLabel="Total/ton"
                centerValue={`₹${Math.round(r.totalDirect.treatment)}`}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Electricity Savings', value: r.electricity.savings, icon: <Zap size={14} /> },
                { label: 'Boiler Savings', value: r.boiler.savings, icon: <Flame size={14} /> },
                { label: 'Die Savings', value: r.die.savings, icon: <Settings size={14} /> },
                { label: 'Fixed Cost Savings', value: r.fixedFactory.savings, icon: <DollarSign size={14} /> },
              ].map(m => (
                <MetricCard key={m.label} label={m.label} value={`₹${fmt2(m.value)}`} sub="per ton of feed" color={m.value >= 0 ? 'text-bentoli-navy' : 'text-rose-400'} icon={m.icon} trend={m.value >= 0 ? 'up' : 'down'} />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WaterfallChart
              title="Full Savings Breakdown (Rs/ton)"
              steps={[
                { label: 'Electricity', value: r.electricity.savings, color: '#fbbf24' },
                { label: 'Boiler', value: r.boiler.savings, color: '#f97316' },
                { label: 'Die', value: r.die.savings, color: '#a78bfa' },
                { label: 'Fixed', value: r.fixedFactory.savings, color: '#38bdf8' },
                { label: 'Indirect', value: r.netIndirectRevenue },
                { label: 'TOTAL', value: r.totalReturn, isTotal: true },
              ]}
            />
            <BarChart
              title="Chicken Production & Revenue (per ton of feed)"
              bars={[
                { label: 'Chicken kg', control: r.chickenProduction.control, treatment: r.chickenProduction.treatment },
                { label: 'Prod Cost/100', control: r.productionCost.control / 100, treatment: r.productionCost.treatment / 100 },
                { label: 'Addl Rev', control: 0, treatment: r.additionalRevenue },
                { label: 'Net Indirect', control: 0, treatment: Math.max(r.netIndirectRevenue, 0) },
              ]}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
