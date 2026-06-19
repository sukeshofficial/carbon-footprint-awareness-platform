import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GoalProgress from '../GoalProgress';

// Mock Progress UI component since it likely uses some Radix primitives or complex styling
vi.mock('../../components/ui/progress', () => ({
  Progress: ({ value }) => <div data-testid="mock-progress" data-value={value} />
}));

const mockGoal = {
  title: 'Monthly Savings',
  description: 'Try to save 100kg CO2',
  targetType: 'action_completion_count',
  targetValue: 20,
  currentValue: 10
};

const mockAnalytics = {
  goalAchievementPercent: 50,
  estimatedCo2Saved: 25.5,
  completionRate: 75
};

describe('GoalProgress', () => {
  it('renders goal information correctly', () => {
    render(<GoalProgress goal={mockGoal} analytics={mockAnalytics} />);

    expect(screen.getByText('Monthly Savings')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText(/10 actions completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Target: 20/i)).toBeInTheDocument();
  });

  it('renders impact analytics when available', () => {
    render(<GoalProgress goal={mockGoal} analytics={mockAnalytics} />);

    expect(screen.getByText(/25.5 kg CO2e saved/i)).toBeInTheDocument();
    expect(screen.getByText(/75%/i)).toBeInTheDocument();
  });

  it('returns null if no goal is provided', () => {
    const { container } = render(<GoalProgress goal={null} />);
    expect(container.firstChild).toBeNull();
  });
});
