import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmissionsBreakdownCard from '../EmissionsBreakdownCard';

// Mock Recharts since it doesn't render well in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>, // NOSONAR
  PieChart: ({ children }) => <div>{children}</div>, // NOSONAR
  Pie: () => <div>Pie</div>,
  Cell: () => <div>Cell</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
  BarChart: ({ children }) => <div>{children}</div>, // NOSONAR
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
}));

describe('EmissionsBreakdownCard', () => {
  const categoryBreakdown = {
    transport: 100,
    food: 50,
    energy: 200,
    shopping: 30,
  };

  const coachInsight = "You are doing great in transport!";

  it('renders correctly and shows insight', () => {
    render(<EmissionsBreakdownCard categoryBreakdown={categoryBreakdown} coachInsight={coachInsight} />);

    expect(screen.getByText(/Carbon Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(coachInsight)).toBeInTheDocument();
  });

  it('switches between views using icons', () => {
    render(<EmissionsBreakdownCard categoryBreakdown={categoryBreakdown} coachInsight={coachInsight} />);

    const compareButton = screen.getByLabelText('comparison view');
    fireEvent.click(compareButton);

    expect(screen.getByText(/Compare/i)).toBeInTheDocument();
  });

  it('shows empty state when no data provided', () => {
    render(<EmissionsBreakdownCard categoryBreakdown={{}} coachInsight="No data yet" />);
    expect(screen.getByText(/No emissions data recorded/i)).toBeInTheDocument();
  });
});
