import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActionCard from '../ActionCard';

const mockAction = {
  _id: 'a1',
  title: 'Unplug Electronics',
  description: 'Unplug devices when not in use to save phantom energy.',
  effortLevel: 'easy',
  impactEstimate: 2.5,
  carbonUnit: 'kg',
  savingsCurrencyEstimate: 10,
  status: 'pending'
};

describe('ActionCard', () => {
  it('renders pending action correctly', () => {
    render(<ActionCard action={mockAction} onComplete={vi.fn()} onSkip={vi.fn()} />);

    expect(screen.getByText('Unplug Electronics')).toBeInTheDocument();
    expect(screen.getByText(/Unplug devices when not in use/i)).toBeInTheDocument();
    expect(screen.getByText(/easy effort/i)).toBeInTheDocument();
    expect(screen.getByText(/2.5 kg saved/i)).toBeInTheDocument();
    expect(screen.getByText(/₹10 saved/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
  });

  it('renders completed action correctly', () => {
    const completedAction = { ...mockAction, status: 'completed' };
    render(<ActionCard action={completedAction} onComplete={vi.fn()} onSkip={vi.fn()} />);

    const title = screen.getByText('Unplug Electronics');
    expect(title).toHaveClass('line-through');
    expect(screen.queryByRole('button', { name: /complete/i })).not.toBeInTheDocument();
  });

  it('triggers onComplete when complete button is clicked', () => {
    const onComplete = vi.fn();
    render(<ActionCard action={mockAction} onComplete={onComplete} onSkip={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /complete/i }));
    expect(onComplete).toHaveBeenCalledWith('a1');
  });

  it('renders in compact mode', () => {
    render(<ActionCard action={mockAction} onComplete={vi.fn()} onSkip={vi.fn()} compact={true} />);

    expect(screen.getByText('Unplug Electronics')).toBeInTheDocument();
    // Description should be hidden in compact mode
    expect(screen.queryByText(/Unplug devices when not in use/i)).not.toBeInTheDocument();
  });
});
