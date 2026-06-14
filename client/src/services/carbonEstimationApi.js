import api from './api';

const API_URL = '/carbon-estimation';

export const getMyEstimation = async () => {
  const response = await api.get(`${API_URL}/me`);
  return response.data;
};

export const recalculateEstimation = async () => {
  const response = await api.post(`${API_URL}/recalculate`);
  return response.data;
};

export const getEstimationHistory = async () => {
  const response = await api.get(`${API_URL}/history`);
  return response.data;
};

export const getLatestInsights = async () => {
  const response = await api.get(`${API_URL}/me/insights`);
  return response.data;
};

export default {
  getMyEstimation,
  recalculateEstimation,
  getEstimationHistory,
  getLatestInsights,
};
