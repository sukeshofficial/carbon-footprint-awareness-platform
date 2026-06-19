import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MetricStatCard from '../MetricStatCard';

describe('MetricStatCard', () => {
  it('renders title and value correctly', () => {
    render(<MetricStatCard title="Total Carbon" value="150.5" unit="kg" />);

    expect(screen.getByText(/TOTAL CARBON/i)).toBeInTheDocument();
    expect(screen.getByText('150.5')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('renders trend badge when provided', () => {
    render(<MetricStatCard title="Carbon" value="100" trend="+12%" />);

    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<MetricStatCard title="Carbon" value="100" description="Weekly Average" />);

    expect(screen.getByText(/WEEKLY AVERAGE/i)).toBeInTheDocument();
  });

  it('renders fallback when value is null', () => {
    render(<MetricStatCard title="Carbon" value={null} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
