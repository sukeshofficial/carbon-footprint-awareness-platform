import { create } from 'zustand';
import explanationApi from '../services/explanationApi';

const useExplanationStore = create((set, get) => ({
  explanation: null,
  loading: false,
  error: null,
  lastFetched: null,

  fetchExplanation: async (force = false) => {
    const { lastFetched, explanation } = get();

    // Cache for 5 minutes unless forced
    const now = Date.now();
    if (!force && explanation && lastFetched && (now - lastFetched < 5 * 60 * 1000)) {
      return explanation;
    }

    set({ loading: true, error: null });
    try {
      const response = await explanationApi.getMyExplanation();
      if (response.success) {
        set({
          explanation: response.data,
          loading: false,
          lastFetched: now
        });
        return response.data;
      } else {
        set({ error: response.message, loading: false });
        return null;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch explanations';
      set({ error: message, loading: false });
      return null;
    }
  },

  clearExplanation: () => set({ explanation: null, lastFetched: null, error: null }),
}));

export default useExplanationStore;
