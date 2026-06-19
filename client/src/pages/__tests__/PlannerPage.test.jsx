import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PlannerPage from '../PlannerPage';

// Mock planner store
vi.mock('../../store/plannerStore', () => ({
  default: vi.fn()
}));

// Mock WeeklyPlanner to avoid sub-component complexity in page test
vi.mock('../../components/planner/WeeklyPlanner', () => ({
  default: () => <div data-testid="weekly-planner">Weekly Planner Content</div>
}));

vi.mock('../../components/planner/GoalModal', () => ({
  default: () => <div data-testid="goal-modal">Goal Modal Content</div>
}));

import usePlannerStore from '../../store/plannerStore';

describe('PlannerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePlannerStore).mockReturnValue({
      fetchInitialData: vi.fn(),
      createGoal: vi.fn(),
      activeGoal: { id: 'g1', title: 'Test Goal' }
    });
  });
  it('renders title and new goal button', () => {
    render(
      <MemoryRouter>
        <PlannerPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Action Planner/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Sustainability Goal/i })).toBeInTheDocument();
  });

  it('renders weekly planner by default', () => {
    render(
      <MemoryRouter>
        <PlannerPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('weekly-planner')).toBeInTheDocument();
  });

  it('switches to monthly roadmap tab', () => {
    render(
      <MemoryRouter>
        <PlannerPage />
      </MemoryRouter>
    );

    const monthlyTab = screen.getByText(/30-Day Roadmap/i);
    fireEvent.click(monthlyTab);

    expect(screen.getByText(/Monthly Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });
});
