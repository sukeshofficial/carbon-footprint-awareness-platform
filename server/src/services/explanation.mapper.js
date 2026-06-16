/**
 * Mapper for converting raw estimation and context data into signals for the explanation rules.
 */
export const mapToSignals = (estimation) => {
  if (!estimation) return null;

  return {
    topSource: estimation.topSource,
    trendLabel: estimation.trendLabel,
    totalMonthlyCO2: estimation.totalMonthlyCO2,
  };
};

export const mapToExplanationSignals = (estimation, normalizedInputs) => {
  return {
    signals: mapToSignals(estimation),
    inputs: normalizedInputs,
  };
};
