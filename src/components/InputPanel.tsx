import { InputParams } from '../types';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}

function SliderInput({ label, value, min, max, step, unit, onChange }: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            step={step}
            min={min}
            max={max}
              onChange={e => onChange(parseFloat(e.target.value) || 0)}
              className="w-20 text-right text-xs bg-white text-bentoli-green font-mono font-semibold border border-slate-200 rounded px-1 py-0.5 focus:outline-none focus:border-bentoli-green"
          />
          {unit && <span className="text-xs text-slate-500 w-8">{unit}</span>}
        </div>
      </div>
      <div className="relative h-1.5 bg-gray-200 rounded-full">
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
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-bentoli-green rounded-full border-2 border-white pointer-events-none"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-[10px] text-slate-600">{min}</span>
        <span className="text-[10px] text-slate-600">{max}</span>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
}

function Section({ title, color, children }: SectionProps) {
  return (
    <div className="mb-5">
      <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${color}`}>{title}</h3>
      {children}
    </div>
  );
}

interface Props {
  params: InputParams;
  onChange: (p: InputParams) => void;
}

export function InputPanel({ params: p, onChange }: Props) {
  const set = (key: keyof InputParams) => (v: number) => onChange({ ...p, [key]: v });

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <Section title="Performance — Control" color="text-slate-400">
        <SliderInput label="Throughput" value={p.controlThroughput} min={5} max={20} step={0.1} unit="t/hr" onChange={set('controlThroughput')} />
        <SliderInput label="Ampere Load" value={p.controlAmpereLoad} min={50} max={400} step={0.5} unit="A" onChange={set('controlAmpereLoad')} />
        <SliderInput label="FCR" value={p.controlFCR} min={1.0} max={3.0} step={0.01} onChange={set('controlFCR')} />
        <SliderInput label="Feed Cost" value={p.controlFeedCost} min={10} max={100} step={0.1} unit="Rs/kg" onChange={set('controlFeedCost')} />
      </Section>

      <Section title="Performance — Treatment (Pelex)" color="text-bentoli-green">
        <SliderInput label="Throughput" value={p.treatmentThroughput} min={5} max={20} step={0.1} unit="t/hr" onChange={set('treatmentThroughput')} />
        <SliderInput label="Ampere Load" value={p.treatmentAmpereLoad} min={50} max={400} step={0.5} unit="A" onChange={set('treatmentAmpereLoad')} />
        <SliderInput label="FCR" value={p.treatmentFCR} min={1.0} max={3.0} step={0.01} onChange={set('treatmentFCR')} />
        <SliderInput
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
        <SliderInput label="Voltage" value={p.voltage} min={200} max={600} step={10} unit="V" onChange={set('voltage')} />
        <SliderInput label="Power Unit Cost" value={p.powerUnitCost} min={1} max={50} step={0.5} unit="Rs/kWh" onChange={set('powerUnitCost')} />
        <SliderInput label="Rated Capacity" value={p.ratedCapacity} min={1} max={30} step={0.5} unit="t/hr" onChange={set('ratedCapacity')} />
      </Section>

      <Section title="Boiler & Fuel" color="text-bentoli-green">
        <SliderInput label="Boiler Fuel Cost" value={p.boilerFuelCost} min={1} max={30} step={0.1} unit="Rs/kg" onChange={set('boilerFuelCost')} />
        <SliderInput label="Boiler Fuel Consumption" value={p.boilerFuel} min={1} max={30} step={0.1} unit="kg/t" onChange={set('boilerFuel')} />
      </Section>

      <Section title="Die & Factory" color="text-rose-400">
        <SliderInput label="Die Replacement Cost" value={p.dieReplacementCost} min={50000} max={1000000} step={10000} unit="Rs" onChange={set('dieReplacementCost')} />
        <SliderInput label="Die Life" value={p.dieLife} min={1000} max={50000} step={500} unit="MT" onChange={set('dieLife')} />
        <SliderInput label="Factory Running Time" value={p.factoryRunningTime} min={1} max={24} step={1} unit="hr/day" onChange={set('factoryRunningTime')} />
        <SliderInput label="Fixed Running Cost" value={p.fixedRunningCost} min={50} max={1000} step={10} unit="Rs/hr" onChange={set('fixedRunningCost')} />
      </Section>

      <Section title="Pelex & Chicken" color="text-violet-400">
        <SliderInput label="Pelex Cost" value={p.pelexCost} min={10} max={500} step={5} unit="Rs/kg" onChange={set('pelexCost')} />
        <SliderInput label="Pelex Dosage" value={p.pelexDosage} min={0.0001} max={0.01} step={0.0001} unit="kg/kg" onChange={set('pelexDosage')} />
        <SliderInput label="Chicken Selling Price" value={p.chickenSellingPrice} min={20} max={300} step={5} unit="Rs/kg" onChange={set('chickenSellingPrice')} />
      </Section>
    </div>
  );
}
