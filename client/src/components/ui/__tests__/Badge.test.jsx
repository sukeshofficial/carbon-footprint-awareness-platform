import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders correctly with default props', () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText(/new/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-slot', 'badge');
    expect(badge).toHaveAttribute('data-variant', 'default');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    let badge = screen.getByText(/secondary/i);
    expect(badge).toHaveAttribute('data-variant', 'secondary');

    rerender(<Badge variant="destructive">Critical</Badge>);
    badge = screen.getByText(/critical/i);
    expect(badge).toHaveAttribute('data-variant', 'destructive');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Styled</Badge>);
    const badge = screen.getByText(/styled/i);
    expect(badge).toHaveClass('custom-badge');
  });

  it('renders as a child component when asChild is true', () => {
    render(
      <Badge asChild>
        <a href="/status">Active</a>
      </Badge>
    );
    const link = screen.getByRole('link', { name: /active/i });
    expect(link).toBeInTheDocument();
  });
});
