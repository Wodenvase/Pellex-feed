import React from 'react';
import { InputParams } from '../types';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  compact?: boolean;
}

function SliderInput({ label, value, min, max, step, unit, onChange, compact }: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={compact ? 'mr-3 min-w-[200px] flex-shrink-0' : 'mb-4'}>
      <div className={`flex justify-between items-center ${compact ? 'mb-1' : 'mb-1'}`}>
        <span className={`text-xs font-medium ${compact ? 'text-slate-500 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            step={step}
            min={min}
            max={max}
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
            className={`${compact ? 'w-16 text-right text-xs px-1 py-0.5' : 'w-20 text-right text-xs px-1 py-0.5'} bg-white dark:bg-slate-700 text-bentoli-green font-mono font-semibold border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:border-bentoli-green`}
          />
          {unit && <span className="text-xs text-slate-500 w-8">{unit}</span>}
        </div>
      </div>
      <div className={`${compact ? 'relative h-1 bg-gray-200 dark:bg-slate-700 rounded-full' : 'relative h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full'}`}>
        <div
          className="absolute top-0 left-0 h-full bg-bentoli-green rounded-full"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-bentoli-green rounded-full border-2 border-white dark:border-slate-800 pointer-events-none"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-[10px] text-slate-600 dark:text-slate-400">{min}</span>
        <span className="text-[10px] text-slate-600 dark:text-slate-400">{max}</span>
      </div>
    </div>
  );
}

function Section({ title, color, children, compact }: { title: string; color: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className={compact ? 'min-w-[220px] flex-shrink-0' : 'mb-5'}>
      <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${color} ${compact ? 'text-xs' : ''}`}>{title}</h3>
      {children}
    </div>
  );
}

function CompactControl({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <div className="flex-shrink-0 min-w-[160px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-3 py-2">
      <div className="text-[10px] text-slate-500 dark:text-slate-300 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="w-16 text-right text-sm bg-white dark:bg-slate-800 text-bentoli-green font-mono font-semibold border border-slate-100 dark:border-slate-700 rounded px-1 py-0.5 focus:outline-none"
        />
        {unit && <div className="text-xs text-slate-500">{unit}</div>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full mt-2 h-2 accent-bentoli-green"
      />
    </div>
  );
}

export function InputPanel({ params: p, onChange, compact }: { params: InputParams; onChange: (p: InputParams) => void; compact?: boolean }) {
  const set = (key: keyof InputParams) => (v: number) => onChange({ ...p, [key]: v });

  if (compact) {
    return (
      <div className="h-full flex items-center gap-4 overflow-x-auto py-2 scrollbar-hide px-1">
        <CompactControl label="Throughput" value={p.controlThroughput} min={5} max={20} step={0.1} unit="t/hr" onChange={set('controlThroughput')} />
        <CompactControl label="Treat Throughput" value={p.treatmentThroughput} min={5} max={20} step={0.1} unit="t/hr" onChange={set('treatmentThroughput')} />
        <CompactControl label="FCR (Ctrl)" value={p.controlFCR} min={1.0} max={3.0} step={0.01} onChange={set('controlFCR')} />
        <CompactControl label="FCR (Trt)" value={p.treatmentFCR} min={1.0} max={3.0} step={0.01} onChange={set('treatmentFCR')} />
        <CompactControl label="Treatment Feed Cost" value={p.treatmentFeedCost !== undefined ? p.treatmentFeedCost : p.controlFeedCost + p.pelexCost * p.pelexDosage} min={10} max={200} step={0.1} unit="Rs/kg" onChange={set('treatmentFeedCost')} />
        <CompactControl label="Pelex Cost" value={p.pelexCost} min={10} max={500} step={5} unit="Rs/kg" onChange={set('pelexCost')} />
        <CompactControl label="Pelex Dosage" value={p.pelexDosage} min={0.0001} max={0.01} step={0.0001} onChange={set('pelexDosage')} />
        <CompactControl label="Chicken Price" value={p.chickenSellingPrice} min={20} max={300} step={1} unit="Rs/kg" onChange={set('chickenSellingPrice')} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <Section title="Performance — Control" color="text-slate-400">
        <SliderInput compact={false} label="Throughput" value={p.controlThroughput} min={5} max={20} step={0.1} unit="t/hr" onChange={set('controlThroughput')} />
        <SliderInput compact={false} label="Ampere Load" value={p.controlAmpereLoad} min={50} max={400} step={0.5} unit="A" onChange={set('controlAmpereLoad')} />
        <SliderInput compact={false} label="FCR" value={p.controlFCR} min={1.0} max={3.0} step={0.01} onChange={set('controlFCR')} />
        <SliderInput compact={false} label="Feed Cost" value={p.controlFeedCost} min={10} max={100} step={0.1} unit="Rs/kg" onChange={set('controlFeedCost')} />
      </Section>

      <Section title="Performance — Treatment (Pelex)" color="text-bentoli-green">
        <SliderInput compact={false} label="Throughput" value={p.treatmentThroughput} min={5} max={20} step={0.1} unit="t/hr" onChange={set('treatmentThroughput')} />
        <SliderInput compact={false} label="Ampere Load" value={p.treatmentAmpereLoad} min={50} max={400} step={0.5} unit="A" onChange={set('treatmentAmpereLoad')} />
        <SliderInput compact={false} label="FCR" value={p.treatmentFCR} min={1.0} max={3.0} step={0.01} onChange={set('treatmentFCR')} />
        <SliderInput
          compact={false}
          label="Treatment Feed Cost"
          value={
            p.treatmentFeedCost !== undefined
              ? p.treatmentFeedCost
              : p.controlFeedCost + p.pelexCost * p.pelexDosage
          }
          min={10}
          max={200}
          step={0.1}
          unit="Rs/kg"
          onChange={set('treatmentFeedCost')}
        />
      </Section>

      <Section title="Power & Electricity" color="text-bentoli-navy">
        <SliderInput compact={false} label="Voltage" value={p.voltage} min={200} max={600} step={10} unit="V" onChange={set('voltage')} />
        <SliderInput compact={false} label="Power Unit Cost" value={p.powerUnitCost} min={1} max={50} step={0.5} unit="Rs/kWh" onChange={set('powerUnitCost')} />
        <SliderInput compact={false} label="Rated Capacity" value={p.ratedCapacity} min={1} max={30} step={0.5} unit="t/hr" onChange={set('ratedCapacity')} />
      </Section>

      <Section title="Boiler & Fuel" color="text-bentoli-green">
        <SliderInput compact={false} label="Boiler Fuel Cost" value={p.boilerFuelCost} min={1} max={30} step={0.1} unit="Rs/kg" onChange={set('boilerFuelCost')} />
        <SliderInput compact={false} label="Boiler Fuel Consumption" value={p.boilerFuel} min={1} max={30} step={0.1} unit="kg/t" onChange={set('boilerFuel')} />
      </Section>

      <Section title="Die & Factory" color="text-rose-400">
        <SliderInput compact={false} label="Die Replacement Cost" value={p.dieReplacementCost} min={50000} max={1000000} step={10000} unit="Rs" onChange={set('dieReplacementCost')} />
        <SliderInput compact={false} label="Die Life" value={p.dieLife} min={1000} max={50000} step={500} unit="MT" onChange={set('dieLife')} />
        <SliderInput compact={false} label="Factory Running Time" value={p.factoryRunningTime} min={1} max={24} step={1} unit="hr/day" onChange={set('factoryRunningTime')} />
        <SliderInput compact={false} label="Fixed Running Cost" value={p.fixedRunningCost} min={50} max={1000} step={10} unit="Rs/hr" onChange={set('fixedRunningCost')} />
      </Section>

      <Section title="Pelex & Chicken" color="text-violet-400">
        <SliderInput compact={false} label="Pelex Cost" value={p.pelexCost} min={10} max={500} step={5} unit="Rs/kg" onChange={set('pelexCost')} />
        <SliderInput compact={false} label="Pelex Dosage" value={p.pelexDosage} min={0.0001} max={0.01} step={0.0001} unit="kg/kg" onChange={set('pelexDosage')} />
        <SliderInput compact={false} label="Chicken Selling Price" value={p.chickenSellingPrice} min={20} max={300} step={5} unit="Rs/kg" onChange={set('chickenSellingPrice')} />
      </Section>
    </div>
  );
}
