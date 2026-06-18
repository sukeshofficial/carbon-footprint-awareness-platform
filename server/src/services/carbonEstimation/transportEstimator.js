import { TRANSPORT_CONVERSION_FACTORS, FLIGHT_FACTORS } from '../../config/carbonEstimation.config.js';

/**
 * Estimates transport-related CO2 emissions.
 * Units: kg CO2 per month.
 */
export const estimateTransport = (inputs) => {
  const {
    primaryMode = 'walking',
    secondaryMode = null,
    weeklyCommuteDistance = 0,
    yearlyFlightFrequency = 0,
  } = inputs;

  // Monthly commute distance (4.33 weeks per month)
  const monthlyCommuteDistance = weeklyCommuteDistance * 4.33;

  // CO2 from primary mode
  let commuteCO2 = monthlyCommuteDistance * (TRANSPORT_CONVERSION_FACTORS[primaryMode] || TRANSPORT_CONVERSION_FACTORS.walking);

  // If secondary mode exists, assume it takes 30% of the distance
  if (secondaryMode && TRANSPORT_CONVERSION_FACTORS[secondaryMode]) {
    commuteCO2 = (monthlyCommuteDistance * 0.7 * (TRANSPORT_CONVERSION_FACTORS[primaryMode] || 0)) +
      (monthlyCommuteDistance * 0.3 * TRANSPORT_CONVERSION_FACTORS[secondaryMode]);
  }

  // Monthly average from flights
  // Using domestic as baseline if trip frequency is high (likely domestic), 
  // but if yearly freq is small, it might be more international. 
  // For now, let's stick to a weighted average or domestic baseline.
  const flightImpact = FLIGHT_FACTORS.domestic;
  const monthlyFlightCO2 = (yearlyFlightFrequency * flightImpact) / 12;

  const total = commuteCO2 + monthlyFlightCO2;
  return isNaN(total) ? 0 : total;
};
