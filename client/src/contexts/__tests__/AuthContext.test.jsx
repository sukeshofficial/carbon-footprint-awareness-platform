import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import api from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

const TestComponent = () => {
  const { user, loading, login, logout } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return (
    <div>
      <span>Not Logged In</span>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
    </div>
  );
  return (
    <div>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('checks auth on mount and sets user if token exists', async () => {
    localStorageMock.setItem('accessToken', 'fake-token');
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { data: { user: { id: '1', name: 'John Doe', email: 'john@example.com' } } }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Welcome, John Doe/i)).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/auth/me');
  });

  it('performs login and updates state', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { data: { user: { id: '1', name: 'Jane Doe' }, accessToken: 'new-token' } }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state: not logged in
    await waitFor(() => expect(screen.getByText(/Not Logged In/i)).toBeInTheDocument());

    const loginBtn = screen.getByRole('button', { name: /login/i });
    await act(async () => {
      fireEvent.click(loginBtn);
    });

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password',
      rememberMe: false
    });

    await waitFor(() => {
      expect(screen.getByText(/Welcome, Jane Doe/i)).toBeInTheDocument();
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'new-token');
  });

  it('performs logout and clears state', async () => {
    // Initial logged in state
    localStorageMock.setItem('accessToken', 'existing-token');
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { data: { user: { id: '1', name: 'John Doe' } } }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText(/Welcome, John Doe/i)).toBeInTheDocument());

    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    await act(async () => {
      fireEvent.click(logoutBtn);
    });

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
    expect(screen.getByText(/Not Logged In/i)).toBeInTheDocument();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
  });
});
