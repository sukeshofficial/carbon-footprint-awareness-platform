import api from './api';

const plannerApi = {
  getActions: async (planId) => {
    const params = planId ? { planId } : {};
    const response = await api.get('/planner/actions', { params });
    return response.data;
  },
  getTodayAction: async () => {
    const response = await api.get('/planner/actions/today');
    return response.data;
  },
  completeAction: async (id) => {
    const response = await api.patch(`/planner/actions/${id}/complete`);
    return response.data;
  },
  skipAction: async (id) => {
    const response = await api.patch(`/planner/actions/${id}/skip`);
    return response.data;
  },
  generatePlan: async (goalId, planType) => {
    const response = await api.post('/planner/generate', { goalId, planType });
    return response.data;
  },
  getStreaks: async () => {
    const response = await api.get('/planner/streaks');
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/planner/analytics/progress');
    return response.data;
  },
  refreshAnalytics: async () => {
    const response = await api.post('/planner/analytics/refresh');
    return response.data;
  },
};

export default plannerApi;
