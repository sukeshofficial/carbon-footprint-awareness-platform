import { describe, it, expect, vi, beforeEach } from 'vitest';
import usePlannerStore from '../plannerStore';
import plannerApi from '../../services/plannerApi';
import goalApi from '../../services/goalApi';

// Mock the APIs
vi.mock('../../services/plannerApi', () => ({
  default: {
    getActions: vi.fn(),
    getTodayAction: vi.fn(),
    completeAction: vi.fn(),
    skipAction: vi.fn(),
    generatePlan: vi.fn(),
    getStreaks: vi.fn(),
    getAnalytics: vi.fn(),
  },
}));

vi.mock('../../services/goalApi', () => ({
  default: {
    getGoals: vi.fn(),
    getActiveGoal: vi.fn(),
    createGoal: vi.fn(),
  },
}));

describe('plannerStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store state manually if needed, or rely on clear isolation if not persisting
    usePlannerStore.setState({
      goals: [],
      activeGoal: null,
      actions: [],
      todayAction: null,
      streak: null,
      analytics: null,
      isLoading: false,
      error: null,
    });
  });

  it('initially has default state', () => {
    const state = usePlannerStore.getState();
    expect(state.goals).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it('fetchInitialData updates state correctly', async () => {
    vi.mocked(goalApi.getGoals).mockResolvedValueOnce({ data: { goals: [{ id: '1', title: 'Goal 1' }] } });
    vi.mocked(goalApi.getActiveGoal).mockResolvedValueOnce({ data: { goal: { id: '1' } } });
    vi.mocked(plannerApi.getStreaks).mockResolvedValueOnce({ data: { streak: 5 } });
    vi.mocked(plannerApi.getAnalytics).mockResolvedValueOnce({ data: { metrics: { progress: 50 } } });
    vi.mocked(plannerApi.getTodayAction).mockResolvedValueOnce({ data: { action: { id: 'a1', title: 'Action 1' } } });

    await usePlannerStore.getState().fetchInitialData();

    const state = usePlannerStore.getState();
    expect(state.goals).toHaveLength(1);
    expect(state.activeGoal.id).toBe('1');
    expect(state.streak).toBe(5);
    expect(state.analytics.progress).toBe(50);
    expect(state.todayAction.id).toBe('a1');
    expect(state.isLoading).toBe(false);
  });

  it('createGoal adds new goal and sets as active', async () => {
    const newGoal = { id: '2', title: 'New Goal' };
    vi.mocked(goalApi.createGoal).mockResolvedValueOnce({ data: { goal: newGoal } });

    await usePlannerStore.getState().createGoal({ title: 'New Goal' });

    const state = usePlannerStore.getState();
    expect(state.goals).toContainEqual(newGoal);
    expect(state.activeGoal).toEqual(newGoal);
  });

  it('completeAction updates action status and refreshes data', async () => {
    const initialAction = { _id: 'a1', title: 'Action 1', status: 'pending' };
    usePlannerStore.setState({
      actions: [initialAction],
      todayAction: initialAction
    });

    vi.mocked(plannerApi.completeAction).mockResolvedValueOnce({ data: { success: true } });
    vi.mocked(plannerApi.getStreaks).mockResolvedValueOnce({ data: { streak: 6 } });
    vi.mocked(plannerApi.getAnalytics).mockResolvedValueOnce({ data: { metrics: { progress: 60 } } });

    await usePlannerStore.getState().completeAction('a1');

    const state = usePlannerStore.getState();
    expect(state.actions[0].status).toBe('completed');
    expect(state.todayAction.status).toBe('completed');
    expect(state.streak).toBe(6);
    expect(state.analytics.progress).toBe(60);
  });

  it('handles errors during data fetching', async () => {
    vi.mocked(goalApi.getGoals).mockRejectedValueOnce(new Error('Fetch failed'));

    await usePlannerStore.getState().fetchInitialData();

    const state = usePlannerStore.getState();
    expect(state.error).toBe('Fetch failed');
    expect(state.isLoading).toBe(false);
  });
});
