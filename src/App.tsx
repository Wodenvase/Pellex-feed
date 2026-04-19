import { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { CostTable } from './components/CostTable';
import { BarChart } from './components/BarChart';
import { DonutChart } from './components/DonutChart';
import { WaterfallChart } from './components/WaterfallChart';
import { MetricCard } from './components/MetricCard';
import { useCalculations } from './hooks/useCalculations';
import type { InputParams } from './types';
import { TrendingUp, Zap, Flame, Settings, BarChart2, DollarSign, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_PARAMS: InputParams = {
  controlThroughput: 9.5,
  treatmentThroughput: 9.8,
  controlAmpereLoad: 168.5,
  treatmentAmpereLoad: 147.6,
  controlFCR: 1.5,
  treatmentFCR: 1.48,
  controlFeedCost: 40,
  voltage: 440,
  powerUnitCost: 10,
  boilerFuelCost: 6.5,
  boilerFuel: 10.5,
  ratedCapacity: 10,
  dieReplacementCost: 350000,
  dieLife: 10000,
  factoryRunningTime: 22,
  fixedRunningCost: 327.275,
  pelexCost: 120,
  chickenSellingPrice: 90,
  pelexDosage: 0.001,
};

type Tab = 'overview' | 'costs' | 'indirect' | 'charts';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart2 size={13} /> },
  { id: 'costs', label: 'Direct Costs', icon: <DollarSign size={13} /> },
  { id: 'indirect', label: 'Indirect Benefits', icon: <TrendingUp size={13} /> },
  { id: 'charts', label: 'Charts', icon: <BarChart2 size={13} /> },
];

function fmt2(v: number) {
  return v.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function App() {
  const [params, setParams] = useState<InputParams>(DEFAULT_PARAMS);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const r = useCalculations(params);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Settings size={15} className="text-slate-900" />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-slate-100">Interactive Model for Pellet Feed Manufacturing</h1>
            <p className="text-[10px] text-slate-500">Control vs Treatment (Pelex) — real-time analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-emerald-800/40 rounded-lg px-3 py-1.5">
            <span className="text-[10px] text-slate-500">Total ROI</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{fmt2(r.totalROI)}%</span>
            <span className="text-[10px] text-slate-600">on ₹{params.pelexCost}/kg</span>
          </div>
          <button
            onClick={() => setParams(DEFAULT_PARAMS)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors border border-slate-700 hover:border-slate-600 rounded-lg px-2.5 py-1.5"
          >
            <RotateCcw size={11} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-53px)]">
        <aside
          className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 bg-slate-900 border-r border-slate-800 overflow-hidden transition-all duration-200 relative`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Input Parameters</h2>
              <p className="text-[9px] text-slate-700 mt-0.5">Adjust sliders or type values to update all results live.</p>
            </div>
            <InputPanel params={params} onChange={setParams} />
          </div>
        </aside>

        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-slate-800 border border-slate-700 rounded-r-lg p-1 text-slate-500 hover:text-slate-300 transition-colors"
          style={{ left: sidebarOpen ? '18rem' : '0rem' }}
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <main className="flex-1 overflow-y-auto p-5 relative">
          <div className="flex gap-1 mb-5 bg-slate-800/60 rounded-lg p-1 w-fit border border-slate-700/40">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard label="Direct Savings/Ton" value={`₹${fmt2(r.totalDirect.savings)}`} sub="Processing cost reduction" color="text-sky-400" icon={<DollarSign size={14} />} trend="up" />
                <MetricCard label="FCR Benefit/Ton" value={`₹${fmt2(r.netIndirectRevenue)}`} sub="Net indirect revenue" color="text-emerald-400" icon={<TrendingUp size={14} />} trend={r.netIndirectRevenue >= 0 ? 'up' : 'down'} />
                <MetricCard label="Total Return/Ton" value={`₹${fmt2(r.totalReturn)}`} sub="Direct + Indirect benefits" color="text-amber-400" icon={<BarChart2 size={14} />} trend={r.totalReturn >= 0 ? 'up' : 'down'} />
                <MetricCard label="Total ROI" value={`${fmt2(r.totalROI)}%`} sub={`On ₹${params.pelexCost}/kg Pelex`} color="text-emerald-400" icon={<TrendingUp size={14} />} trend={r.totalROI >= 0 ? 'up' : 'down'} />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard label="Throughput Gain" value={`${r.throughputDiff >= 0 ? '+' : ''}${r.throughputDiff.toFixed(2)} t/hr`} sub={`${params.controlThroughput} → ${params.treatmentThroughput}`} color={r.throughputDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'} trend={r.throughputDiff >= 0 ? 'up' : 'down'} />
                <MetricCard label="Ampere Change" value={`${r.ampereLoadDiff.toFixed(1)} A`} sub={`${params.controlAmpereLoad} → ${params.treatmentAmpereLoad}`} color={r.ampereLoadDiff <= 0 ? 'text-emerald-400' : 'text-rose-400'} trend={r.ampereLoadDiff <= 0 ? 'up' : 'down'} />
                <MetricCard label="FCR Change" value={`${r.fcrDiff >= 0 ? '+' : ''}${r.fcrDiff.toFixed(3)}`} sub={`${params.controlFCR} → ${params.treatmentFCR}`} color={r.fcrDiff <= 0 ? 'text-emerald-400' : 'text-rose-400'} trend={r.fcrDiff <= 0 ? 'up' : 'down'} />
                <MetricCard label="Extra Chicken/Ton" value={`+${r.chickenProduction.benefit.toFixed(2)} kg`} sub={`${r.chickenProduction.control.toFixed(2)} → ${r.chickenProduction.treatment.toFixed(2)}`} color="text-emerald-400" trend="up" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              </div>

              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b-2 border-sky-500 bg-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">ROI Summary</h4>
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-700/60">
                  {[
                    { label: 'Processing Cost Savings/Ton', value: r.totalDirect.savings, sub: 'Direct Savings', color: 'text-sky-400' },
                    { label: 'FCR Benefit/Ton of Feed', value: r.netIndirectRevenue, sub: 'Indirect ROI', color: 'text-emerald-400' },
                    { label: 'Total Return/Ton of Feed', value: r.totalReturn, sub: `ROI: ${fmt2(r.totalROI)}% on ₹${params.pelexCost}`, color: 'text-amber-400' },
                  ].map(m => (
                    <div key={m.label} className="p-4 text-center">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{m.label}</div>
                      <div className={`text-xl font-bold font-mono ${m.color}`}>₹{fmt2(m.value)}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-4">
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
                  { label: 'Electricity Savings', value: r.electricity.savings, icon: <Zap size={14} />, color: 'text-amber-400' },
                  { label: 'Boiler Savings', value: r.boiler.savings, icon: <Flame size={14} />, color: 'text-orange-400' },
                  { label: 'Die Savings', value: r.die.savings, icon: <Settings size={14} />, color: 'text-violet-400' },
                  { label: 'Fixed Cost Savings', value: r.fixedFactory.savings, icon: <DollarSign size={14} />, color: 'text-sky-400' },
                ].map(m => (
                  <MetricCard key={m.label} label={m.label} value={`₹${fmt2(m.value)}`} sub="per ton of feed" color={m.value >= 0 ? m.color : 'text-rose-400'} icon={m.icon} trend={m.value >= 0 ? 'up' : 'down'} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'indirect' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CostTable
                  title="Chicken Production (kg per ton of feed)"
                  rows={[{ label: 'Chicken Production', control: r.chickenProduction.control, treatment: r.chickenProduction.treatment, savings: r.chickenProduction.benefit }]}
                  accentColor="border-amber-500"
                />
                <CostTable
                  title="Production Cost (Rs per ton of feed)"
                  rows={[{ label: 'Production Cost', control: r.productionCost.control, treatment: r.productionCost.treatment, savings: r.productionCost.benefit }]}
                  accentColor="border-rose-500"
                />
              </div>

              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b-2 border-emerald-500 bg-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Indirect Revenue Analysis (Per Ton of Feed)</h4>
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-700/60">
                  {[
                    { label: 'Additional Revenue', value: r.additionalRevenue, sub: `${r.chickenProduction.benefit.toFixed(3)} kg × ₹${params.chickenSellingPrice}/kg`, color: 'text-emerald-400' },
                    { label: 'Additional Feed Cost', value: -r.additionalFeedCost, sub: `Extra chicken × feed × FCR`, color: 'text-rose-400', abs: true },
                    { label: 'Net Indirect Revenue', value: r.netIndirectRevenue, sub: 'Revenue − Additional Cost', color: r.netIndirectRevenue >= 0 ? 'text-emerald-400' : 'text-rose-400' },
                  ].map(m => (
                    <div key={m.label} className="p-4 text-center">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{m.label}</div>
                      <div className={`text-xl font-bold font-mono ${m.color}`}>
                        {m.abs ? '-' : ''}₹{fmt2(Math.abs(m.value))}
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard label="Treatment Feed Cost" value={`₹${r.treatmentFeedCost.toFixed(4)}/kg`} sub={`Base ₹${params.controlFeedCost} + Pelex ₹${(params.pelexCost * params.pelexDosage).toFixed(4)}`} color="text-slate-300" />
                <MetricCard label="Extra Chicken/Ton" value={`+${r.chickenProduction.benefit.toFixed(3)} kg`} sub="per ton of feed processed" color="text-emerald-400" trend="up" />
                <MetricCard label="Chicken Selling Price" value={`₹${params.chickenSellingPrice}/kg`} sub="Market price" color="text-amber-400" />
                <MetricCard label="Net Benefit" value={`₹${fmt2(r.netIndirectRevenue)}`} sub="per ton of feed" color={r.netIndirectRevenue >= 0 ? 'text-emerald-400' : 'text-rose-400'} trend={r.netIndirectRevenue >= 0 ? 'up' : 'down'} />
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart
                  title="Direct Cost Comparison (Rs/ton)"
                  bars={[
                    { label: 'Electricity', control: r.electricity.control, treatment: r.electricity.treatment },
                    { label: 'Boiler', control: r.boiler.control, treatment: r.boiler.treatment },
                    { label: 'Die', control: r.die.control, treatment: r.die.treatment },
                    { label: 'Fixed', control: r.fixedFactory.control, treatment: r.fixedFactory.treatment },
                    { label: 'Total', control: r.totalDirect.control, treatment: r.totalDirect.treatment },
                  ]}
                  unit="Rs/ton"
                />
                <BarChart
                  title="Performance Metrics (scaled)"
                  bars={[
                    { label: 'Throughput', control: params.controlThroughput, treatment: params.treatmentThroughput },
                    { label: 'Amp ÷10', control: params.controlAmpereLoad / 10, treatment: params.treatmentAmpereLoad / 10 },
                    { label: 'FCR×10', control: params.controlFCR * 10, treatment: params.treatmentFCR * 10 },
                    { label: 'Feed Cost', control: params.controlFeedCost, treatment: r.treatmentFeedCost },
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
