import { SHOPPING_FACTORS } from '../../config/carbonEstimation.config.js';

/**
 * Estimates shopping-related CO2 emissions.
 * Units: kg CO2 per month.
 */
export const estimateShopping = (inputs) => {
  const {
    onlineShoppingFrequency,
    fashionPurchaseFrequency,
    gadgetUpgradeCycle,
  } = inputs;

  const onlineCO2 = SHOPPING_FACTORS.onlineFrequency[onlineShoppingFrequency] || SHOPPING_FACTORS.onlineFrequency.minimal;
  const fashionCO2 = SHOPPING_FACTORS.fashionFrequency[fashionPurchaseFrequency] || 0;
  const gadgetCO2 = SHOPPING_FACTORS.gadgetCycle[gadgetUpgradeCycle] || 0;

  return onlineCO2 + fashionCO2 + gadgetCO2;
};
