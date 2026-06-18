import { create } from 'zustand';
import plannerApi from '../services/plannerApi';
import goalApi from '../services/goalApi';

const usePlannerStore = create((set, get) => ({
  goals: [],
  activeGoal: null,
  actions: [],
  todayAction: null,
  streak: null,
  analytics: null,
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [goalsRes, activeGoalRes, streakRes, analyticsRes, todayActionRes] = await Promise.all([
        goalApi.getGoals(),
        goalApi.getActiveGoal(),
        plannerApi.getStreaks(),
        plannerApi.getAnalytics(),
        plannerApi.getTodayAction(),
      ]);

      set({
        goals: goalsRes.data.goals,
        activeGoal: activeGoalRes.data.goal,
        streak: streakRes.data.streak,
        analytics: analyticsRes.data.metrics,
        todayAction: todayActionRes.data.action,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchActions: async (planId) => {
    set({ isLoading: true });
    try {
      const response = await plannerApi.getActions(planId);
      set({ actions: response.data.actions, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await goalApi.createGoal(goalData);
      set((state) => ({ goals: [response.data.goal, ...state.goals], activeGoal: response.data.goal }));
      return response.data.goal;
    } catch (err) {
      set({ error: err.message });
    }
  },

  generatePlan: async (goalId, planType) => {
    set({ isLoading: true });
    try {
      await plannerApi.generatePlan(goalId, planType);
      await get().fetchActions();
      set({ isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  completeAction: async (actionId) => {
    try {
      await plannerApi.completeAction(actionId);
      // Refresh analytics and streak
      const [streakRes, analyticsRes] = await Promise.all([
        plannerApi.getStreaks(),
        plannerApi.getAnalytics(),
      ]);
      set((state) => ({
        streak: streakRes.data.streak,
        analytics: analyticsRes.data.metrics,
        actions: state.actions.map(a => a._id === actionId ? { ...a, status: 'completed' } : a),
        todayAction: state.todayAction?._id === actionId ? { ...state.todayAction, status: 'completed' } : state.todayAction
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  skipAction: async (actionId) => {
    try {
      await plannerApi.skipAction(actionId);
      set((state) => ({
        actions: state.actions.map(a => a._id === actionId ? { ...a, status: 'skipped' } : a),
        todayAction: state.todayAction?._id === actionId ? { ...state.todayAction, status: 'skipped' } : state.todayAction
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default usePlannerStore;
