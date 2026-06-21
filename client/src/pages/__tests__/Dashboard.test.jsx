import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock all the hooks and stores using the EXACT paths from the component for best matching
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../store/profileStore', () => ({
  useProfile: vi.fn()
}));

vi.mock('../../store/carbonEstimationStore', () => ({
  useCarbonEstimation: vi.fn()
}));

vi.mock('../../store/plannerStore', () => ({
  default: vi.fn()
}));

vi.mock('../../hooks/useCarbonInsightsStream', () => ({
  useCarbonInsightsStream: vi.fn()
}));

// Mock sub-components
vi.mock('../../components/carbon/EmissionsBreakdownCard', () => ({
  default: () => <div data-testid="emissions-breakdown">Emissions Breakdown</div>
}));
vi.mock('../../components/carbon/what-if/WhatIfSimulator', () => ({
  default: () => <div data-testid="what-if-simulator">What-If Simulator</div>
}));
vi.mock('../../components/carbon/MetricStatCard', () => ({
  default: ({ title, value }) => <div data-testid={`metric-${title}`}>{value}</div>
}));
vi.mock('../../components/planner/WeeklyPlanner', () => ({
  default: () => <div data-testid="weekly-planner">Weekly Planner</div>
}));
vi.mock('../../components/planner/DailyActionHero', () => ({
  default: () => <div data-testid="daily-hero">Daily Hero</div>
}));
vi.mock('../../components/planner/GoalModal', () => ({
  default: () => <div data-testid="goal-modal">Goal Modal</div>
}));
vi.mock('../../components/carbon/WeeklyMonthlyToggle', () => ({
  default: ({ view, onChange }) => (
    <div>
      <button onClick={() => onChange('weekly')}>Weekly</button>
      <button onClick={() => onChange('monthly')}>Monthly</button>
      <span>Current: {view}</span>
    </div>
  )
}));
vi.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }) => <div data-testid="tabs">{children}</div>, // NOSONAR
  TabsList: ({ children }) => <div data-testid="tabs-list">{children}</div>, // NOSONAR
  TabsTrigger: ({ label, value, onClick }) => <button onClick={onClick}>{label}</button>, // NOSONAR
  TabsContent: ({ children, value }) => <div data-testid={`content-${value}`}>{children}</div>, // NOSONAR
}));

// Import the mocked hooks to set their return values
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../store/profileStore';
import { useCarbonEstimation } from '../../store/carbonEstimationStore';
import usePlannerStore from '../../store/plannerStore';
import { useCarbonInsightsStream } from '../../hooks/useCarbonInsightsStream';

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({ user: { name: 'Test User' } });
    vi.mocked(useProfile).mockReturnValue({ profile: { id: 'p1' } });
    vi.mocked(useCarbonEstimation).mockReturnValue({
      estimation: {
        weeklyEstimate: 100,
        monthlyEstimate: 400,
        categoryBreakdown: { transport: 50 },
        severityLevel: 'moderate',
        trendLabel: 'stable',
        explanation: 'Test insight'
      },
      history: [],
      loading: false,
      fetchMyEstimation: vi.fn(),
      recalculate: vi.fn(),
      fetchHistory: vi.fn()
    });
    vi.mocked(usePlannerStore).mockReturnValue({
      todayAction: { _id: 'a1', title: 'Action 1', status: 'pending' },
      activeGoal: { id: 'g1', title: 'Goal 1' },
      analytics: { progress: 20 },
      streak: { currentStreak: 3 },
      fetchInitialData: vi.fn(),
      completeAction: vi.fn(),
      skipAction: vi.fn(),
      createGoal: vi.fn()
    });
    vi.mocked(useCarbonInsightsStream).mockReturnValue({
      streamedInsights: null,
      isStreaming: false,
      streamedToken: '',
      streamError: false,
      streamingDone: true,
      resetStream: vi.fn()
    });
  });

  it('renders welcome message and basic info', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
