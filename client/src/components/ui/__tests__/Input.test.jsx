import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { Input } from '../input';

describe('Input', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter name" />);
    const input = screen.getByPlaceholderText(/enter name/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);
    const input = screen.getByPlaceholderText(/type here/i);

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(handleChange).toHaveBeenCalled();
    expect(input.value).toBe('Hello');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText(/disabled input/i);
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Custom" />);
    const input = screen.getByPlaceholderText(/custom/i);
    expect(input).toHaveClass('custom-class');
  });

  it('supports different input types', () => {
    render(<Input type="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText(/password/i);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
