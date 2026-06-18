import api from './api';

export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const refreshRecommendations = async () => {
  const response = await api.post('/recommendations/refresh');
  return response.data;
};

export const updateRecommendationStatus = async (id, status) => {
  const response = await api.patch(`/recommendations/${id}/status`, { status });
  return response.data;
};

export const getRecommendationHistory = async () => {
  const response = await api.get('/recommendations/history');
  return response.data;
};
