import api from './api';

export const getMyExplanation = async () => {
  const response = await api.get('/explanations/me');
  return response.data;
};

export default {
  getMyExplanation,
};
