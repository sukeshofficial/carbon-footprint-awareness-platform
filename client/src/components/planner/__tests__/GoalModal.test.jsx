import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GoalModal from '../GoalModal';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock Lucide icons to avoid SVGR issues in basic tests
vi.mock('lucide-react', () => ({
  Target: () => <div>TargetIcon</div>,
  Zap: () => <div>ZapIcon</div>,
  Flame: () => <div>FlameIcon</div>,
}));

describe('GoalModal', () => {
  const onSubmit = vi.fn();
  const onClose = vi.fn();

  it('does not render when isOpen is false', () => {
    const { container } = render(<GoalModal isOpen={false} onClose={onClose} onSubmit={onSubmit} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when open', () => {
    render(<GoalModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByText(/New Sustainability Goal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Goal Title/i)).toBeInTheDocument();
  });

  it('handles input and form submission', async () => {
    render(<GoalModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/Goal Title/i);
    const valueInput = screen.getByLabelText(/Target Value/i);
    const submitBtn = screen.getByRole('button', { name: /Create Goal/i });

    fireEvent.change(titleInput, { target: { value: 'Test Goal' } });
    fireEvent.change(valueInput, { target: { value: '15' } });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test Goal',
      targetValue: 15,
      targetType: 'action_completion_count'
    }));
    expect(onClose).toHaveBeenCalled();
  });

  it('switches goal types', () => {
    render(<GoalModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    const footprintTypeBtn = screen.getByText(/Reduce Footprint/i);
    fireEvent.click(footprintTypeBtn);

    expect(screen.getByText(/Cut your CO₂ output by a percentage/i)).toBeInTheDocument();
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });
});
