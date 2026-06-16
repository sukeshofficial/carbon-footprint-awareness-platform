/**
 * Templates for Carbon Footprint Explanations
 * These phrases should be calm, direct, and supportive.
 */
export const summaryTemplates = {
  high_transport: "Your footprint is highest because of frequent travel and commuting.",
  high_food: "Sustainable food choices could significantly lower your current footprint.",
  high_energy: "Home energy consumption is the primary driver of your carbon footprint.",
  high_shopping: "Frequent shopping habits are contributing most to your overall impact.",
  balanced: "Your footprint is evenly distributed across different life categories.",
  improved: "Great progress! Your footprint has decreased compared to your last check.",
  stable: "Your footprint remains consistent with your previous assessment.",
  increased: "Your footprint has increased slightly. Let's look at what changed.",
};

export const categoryTemplates = {
  transport: {
    long_commute: "Transport is your top category because you travel long distances regularly.",
    car_dependent: "Your reliance on a car for daily needs makes transport your main driver.",
    frequent_flights: "Air travel contributes significantly to your transport emissions this year.",
    moderate: "Your transport emissions are moderate due to balanced travel habits.",
    low: "Excellent! Your transport footprint is low thanks to active travel or public transit.",
  },
  food: {
    meat_heavy: "Food is high because your diet includes a high proportion of meat products.",
    mixed: "Your food footprint is average for a standard mixed diet.",
    plant_forward: "Your footprint is lower because you prefer plant-based food options.",
    low_impact: "Your diet has a very low carbon impact. Well done!",
  },
  energy: {
    high_usage: "Large household size or frequent appliance use drives your energy footprint.",
    ac_intensive: "High AC usage during warm months is a major factor in your energy costs.",
    moderate: "Your home energy consumption is within the expected range for your home type.",
    efficient: "Your energy use is quite efficient for your living situation.",
  },
  shopping: {
    high_frequency: "Frequent online and fashion shopping increases your shopping footprint.",
    tech_heavy: "Upgrading gadgets often adds a significant 'hidden' footprint to your lifestyle.",
    mindful: "Your mindful shopping habits keep this category's impact relatively low.",
  },
};

export const habitTemplates = {
  daily_car_use: "Daily car use contributes more than your occasional shopping behavior.",
  long_distance_commute: "Long distance travel for work is your single largest regular impact.",
  frequent_flying: "Even occasional flights can outweigh many small daily green habits.",
  high_meat_consumption: "Reducing meat intake even slightly could have a larger impact than you'd expect.",
  large_home_heating: "Heating or cooling a larger space naturally requires more energy.",
  fast_fashion: "Frequent fashion purchases have a surprisingly high cumulative impact.",
};

export const recommendationTemplates = {
  reduce_commute: "Reducing commute travel will help more than small electricity changes.",
  shift_transport: "Switching to public transit would be your most effective single change.",
  diet_shift: "A slight shift towards plant-based meals offers a high-impact, low-effort win.",
  energy_efficiency: "Simple energy-saving habits at home will quickly add up to significant savings.",
  mindful_shopping: "Choosing quality over quantity in shopping reduces waste and emissions.",
};
