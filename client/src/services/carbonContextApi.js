import api from './api';

export const getOnboardingQuestions = async () => {
  const response = await api.get('/onboarding/questions');
  return response.data;
};

export const getMyResponses = async () => {
  const response = await api.get('/onboarding/responses/me');
  return response.data;
};

export const updateOnboardingStep = async (stepKey, stepData) => {
  const response = await api.patch(`/onboarding/responses/step/${stepKey}`, stepData);
  return response.data;
};

export const skipOnboardingStep = async (stepKey) => {
  const response = await api.patch(`/onboarding/responses/step/${stepKey}/skip`);
  return response.data;
};

export const completeOnboarding = async () => {
  const response = await api.post('/onboarding/complete');
  return response.data;
};

export default {
  getOnboardingQuestions,
  getMyResponses,
  updateOnboardingStep,
  skipOnboardingStep,
  completeOnboarding,
};
