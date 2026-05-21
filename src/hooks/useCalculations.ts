import { useMemo } from 'react';
import type { InputParams, Results } from '../types';

export function useCalculations(p: InputParams): Results {
  return useMemo(() => {
    const treatmentFeedCost =
      p.treatmentFeedCost !== undefined
        ? p.treatmentFeedCost
        : p.controlFeedCost + p.pelexCost * p.pelexDosage;

    const throughputDiff = p.treatmentThroughput - p.controlThroughput;
    const ampereLoadDiff = p.treatmentAmpereLoad - p.controlAmpereLoad;
    const fcrDiff = p.treatmentFCR - p.controlFCR;
    const feedCostDiff = treatmentFeedCost - p.controlFeedCost;

    const elecControl =
      ((1.732 * p.voltage * p.controlAmpereLoad * 0.95) / 1000) *
      (p.powerUnitCost / p.controlThroughput);
    const elecTreatment =
      ((1.732 * p.voltage * p.treatmentAmpereLoad * 0.95) / 1000) *
      (p.powerUnitCost / p.treatmentThroughput);
    const electricity = { control: elecControl, treatment: elecTreatment, savings: elecControl - elecTreatment };

    const boilerControl = (p.boilerFuelCost * p.boilerFuel * p.ratedCapacity) / p.controlThroughput;
    const boilerTreatment = (p.boilerFuelCost * p.boilerFuel * p.ratedCapacity) / p.treatmentThroughput;
    const boiler = { control: boilerControl, treatment: boilerTreatment, savings: boilerControl - boilerTreatment };

    const dieControl = (p.dieReplacementCost * p.ratedCapacity) / (p.dieLife * p.controlThroughput);
    const dieTreatment = (p.dieReplacementCost * p.ratedCapacity) / (p.dieLife * p.treatmentThroughput);
    const die = { control: dieControl, treatment: dieTreatment, savings: dieControl - dieTreatment };

    const fixedControl = (p.fixedRunningCost * p.ratedCapacity * (24 / p.factoryRunningTime)) / p.controlThroughput;
    const fixedTreatment = (p.fixedRunningCost * p.ratedCapacity * (24 / p.factoryRunningTime)) / p.treatmentThroughput;
    const fixedFactory = { control: fixedControl, treatment: fixedTreatment, savings: fixedControl - fixedTreatment };

    const totalDirectControl = elecControl + boilerControl + dieControl + fixedControl;
    const totalDirectTreatment = elecTreatment + boilerTreatment + dieTreatment + fixedTreatment;
    const totalDirect = {
      control: totalDirectControl,
      treatment: totalDirectTreatment,
      savings: totalDirectControl - totalDirectTreatment,
    };

    const chickenControl = 1000 / p.controlFCR;
    const chickenTreatment = 1000 / p.treatmentFCR;
    const chickenBenefit = chickenTreatment - chickenControl;
    const chickenProduction = { control: chickenControl, treatment: chickenTreatment, benefit: chickenBenefit };

    const prodCostControl = chickenControl * p.controlFeedCost;
    const prodCostTreatment = chickenTreatment * treatmentFeedCost;
    const productionCost = {
      control: prodCostControl,
      treatment: prodCostTreatment,
      benefit: prodCostControl - prodCostTreatment,
    };

    const additionalRevenue = chickenBenefit * p.chickenSellingPrice;
    const additionalFeedCost = productionCost.benefit;
    const netIndirectRevenue = additionalRevenue + additionalFeedCost;

    const totalReturn = totalDirect.savings + netIndirectRevenue;
    const totalROI = (totalReturn / p.pelexCost) * 100;

    return {
      treatmentFeedCost,
      throughputDiff,
      ampereLoadDiff,
      fcrDiff,
      feedCostDiff,
      electricity,
      boiler,
      die,
      fixedFactory,
      totalDirect,
      chickenProduction,
      productionCost,
      additionalRevenue,
      additionalFeedCost,
      netIndirectRevenue,
      totalReturn,
      totalROI,
    };
  }, [p]);
}
