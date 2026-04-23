export interface InputParams {
  controlThroughput: number;
  treatmentThroughput: number;
  controlAmpereLoad: number;
  treatmentAmpereLoad: number;
  controlFCR: number;
  treatmentFCR: number;
  controlFeedCost: number;
  treatmentFeedCost?: number;
  voltage: number;
  powerUnitCost: number;
  boilerFuelCost: number;
  boilerFuel: number;
  ratedCapacity: number;
  dieReplacementCost: number;
  dieLife: number;
  factoryRunningTime: number;
  fixedRunningCost: number;
  pelexCost: number;
  chickenSellingPrice: number;
  pelexDosage: number;
}

export interface CostRow {
  control: number;
  treatment: number;
  savings: number;
}

export interface Results {
  treatmentFeedCost: number;
  throughputDiff: number;
  ampereLoadDiff: number;
  fcrDiff: number;
  feedCostDiff: number;
  electricity: CostRow;
  boiler: CostRow;
  die: CostRow;
  fixedFactory: CostRow;
  totalDirect: CostRow;
  chickenProduction: { control: number; treatment: number; benefit: number };
  productionCost: { control: number; treatment: number; benefit: number };
  additionalRevenue: number;
  additionalFeedCost: number;
  netIndirectRevenue: number;
  totalReturn: number;
  totalROI: number;
}
