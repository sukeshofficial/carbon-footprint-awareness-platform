import { create } from 'zustand';
import * as recommendationApi from '../services/recommendationApi';

const useRecommendationStore = create((set, get) => ({
  topActions: [],
  categorySuggestions: {
    transport: [],
    food: [],
    energy: [],
    shopping: [],
  },
  summary: null,
  history: [],
  isLoading: false,
  error: null,

  fetchRecommendations: async (forceRefresh = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await (forceRefresh
        ? recommendationApi.refreshRecommendations()
        : recommendationApi.getRecommendations());

      if (response.success) {
        set({
          topActions: response.data.topActions,
          categorySuggestions: response.data.categorySuggestions,
          summary: response.data.summary,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateStatus: async (id, status) => {
    // Optimistic update
    const previousTopActions = get().topActions;
    const previousCategorySuggestions = get().categorySuggestions;

    // Helper to update status in arrays
    const updateInArray = (arr) => arr.map(item => item._id === id ? { ...item, status } : item);

    set({
      topActions: updateInArray(get().topActions),
      categorySuggestions: {
        transport: updateInArray(get().categorySuggestions.transport),
        food: updateInArray(get().categorySuggestions.food),
        energy: updateInArray(get().categorySuggestions.energy),
        shopping: updateInArray(get().categorySuggestions.shopping),
      }
    });

    try {
      const response = await recommendationApi.updateRecommendationStatus(id, status);
      if (!response.success) {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      // Rollback on error
      set({
        topActions: previousTopActions,
        categorySuggestions: previousCategorySuggestions,
        error: error.message
      });
    }
  },

  fetchHistory: async () => {
    try {
      const response = await recommendationApi.getRecommendationHistory();
      if (response.success) {
        set({ history: response.data });
      }
    } catch (error) {
      set({ error: error.message });
    }
  }
}));

export default useRecommendationStore;
