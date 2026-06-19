import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CarbonDashboardCard from '../CarbonDashboardCard';

// Mock the stores
vi.mock('@/store/carbonEstimationStore', () => {
  return {
    useCarbonEstimation: () => ({
      estimation: {
        categoryBreakdown: { transport: 100, food: 50, energy: 200, shopping: 30 },
        weeklyEstimate: 380,
        monthlyEstimate: 1520,
        severityLevel: 'moderate',
        trendLabel: 'stable',
        explanation: 'Test explanation',
      },
      loading: false,
      fetchMyEstimation: vi.fn(),
      recalculate: vi.fn(),
    }),
  };
});

vi.mock('../../store/explanationStore', () => ({
  default: {
    getState: () => ({
      explanation: {
        recommendation_reasoning: [],
      },
    }),
  },
}));

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>, // NOSONAR
  PieChart: ({ children }) => <div>{children}</div>, // NOSONAR
  Pie: () => <div>Pie</div>,
  Cell: () => <div>Cell</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}));

describe('CarbonDashboardCard', () => {
  it('renders footprints and units correctly', () => {
    render(<CarbonDashboardCard />);

    expect(screen.getByText('1,520')).toBeInTheDocument();
    expect(screen.getByText('kg CO₂')).toBeInTheDocument();
    expect(screen.getByText(/PER MONTH/i)).toBeInTheDocument();
  });

  it('toggles between weekly and monthly views', () => {
    render(<CarbonDashboardCard />);

    // Monthly is default in my mock (or the component)
    expect(screen.getByText('1,520')).toBeInTheDocument();

    const weeklyButton = screen.getByText(/Weekly/i);
    fireEvent.click(weeklyButton);

    expect(screen.getByText('380')).toBeInTheDocument();
    expect(screen.getByText(/PER WEEK/i)).toBeInTheDocument();
  });

  it('renders coach insight from estimation', () => {
    render(<CarbonDashboardCard />);
    expect(screen.getByText('Test explanation')).toBeInTheDocument();
  });
});
