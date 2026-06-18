/**
 * Carbon Conversion Factors (kg CO2 per unit)
 * Reference: Compiled from IPCC, IEA, and India-specific grid intensity data.
 */
export const TRANSPORT_CONVERSION_FACTORS = {
  car: 0.18,      // Average petrol sedan (kg/km)
  bike: 0.06,     // Motorcycle (kg/km)
  bus: 0.04,      // Public transit per passenger-km
  metro: 0.02,    // Electric train/metro per passenger-km
  train: 0.03,    // Long-distance rail per passenger-km
  cab: 0.22,      // Ride-hailing service (higher due to idling/cruising)
  walking: 0,
};

export const FLIGHT_FACTORS = {
  domestic: 250,  // Average short-haul trip (kg per flight)
  international: 850, // Average long-haul trip (kg per flight)
};

export const DIET_FACTORS = {
  vegetarian: 5.5,    // kg CO2 per day
  eggetarian: 6.5,    // kg CO2 per day
  mixed_diet: 8.5,    // kg CO2 per day
  non_vegetarian: 12.0, // kg CO2 per day (High meat consumption)
};

export const ENERGY_FACTORS = {
  gridIntensity: 0.82, // kg CO2 per kWh (India Grid Average)

  // Power Consumption Estimates (kWh per month)
  ac: {
    none: 0,
    rarely: 40,
    occasionally: 120,
    frequently: 300,
    very_frequently: 500,
  },
  fan: {
    none: 0,
    rarely: 10,
    occasionally: 30,
    frequently: 60,
    very_frequently: 100,
  },

  // Base household impact (lights, fridge, etc.) per person
  householdBasePerPerson: 50, // kWh/month
};

export const SHOPPING_FACTORS = {
  // Monthly estimates (kg CO2)
  onlineFrequency: {
    minimal: 5,
    occasional: 15,
    frequent_online: 30,
  },
  fashionFrequency: {
    rarely: 10,
    annually: 20,
    semi_annually: 40,
    quarterly: 60,
    monthly: 100,
  },
  gadgetCycle: {
    more_than_5_years: 10,
    every_3_to_5_years: 25,
    every_2_years: 50,
    every_year: 100,
  }
};

export const SEVERITY_THRESHOLDS = {
  low: 250,    // kg CO2/month (Target for sustainable living)
  medium: 600, // kg CO2/month
  // > 600 is high
};

export const ESTIMATION_MODEL_VERSION = '2.0.0'; // Updated to 2.0 for production-grade logic

export const RECOMMENDATION_WEIGHTS = {
  impact: 0.4,
  effort: 0.2, // Inverse weight (higher effort = lower score)
  savings: 0.2,
  urgency: 0.2,
};

export const RANKING_THRESHOLDS = {
  effort: {
    low: 10,
    medium: 6,
    high: 2,
    default: 5,
  },
  savings: {
    high: 10,  // > 500
    medium: 7, // > 200
    low: 4,    // > 0
    none: 1,
  },
};
