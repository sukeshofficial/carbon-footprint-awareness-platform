import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileProvider, useProfile } from '../profileStore';
import profileApi from '../../services/profileApi';

// Mock the API
vi.mock('../../services/profileApi', () => ({
  default: {
    getProfile: vi.fn(),
    createProfile: vi.fn(),
    updateProfile: vi.fn(),
    patchPreferences: vi.fn(),
  },
}));

const TestComponent = () => {
  const { profile, loading, fetchProfile, updateProfile } = useProfile();
  if (loading) return <div>Loading Profile...</div>;
  if (!profile) return <button onClick={fetchProfile}>Load Profile</button>;
  return (
    <div>
      <div data-testid="profile-name">{profile.displayName}</div>
      <button onClick={() => updateProfile({ displayName: 'New Name' })}>Update Name</button>
    </div>
  );
};

describe('ProfileContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches profile and updates state', async () => {
    vi.mocked(profileApi.getProfile).mockResolvedValueOnce({
      data: { profile: { id: 'p1', displayName: 'John Carbon' } }
    });

    render(
      <ProfileProvider>
        <TestComponent />
      </ProfileProvider>
    );

    const loadBtn = screen.getByText(/Load Profile/i);
    await act(async () => {
      loadBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('profile-name').textContent).toBe('John Carbon');
    });
    expect(profileApi.getProfile).toHaveBeenCalled();
  });

  it('updates profile correctly', async () => {
    // Initial profile
    vi.mocked(profileApi.getProfile).mockResolvedValueOnce({
      data: { profile: { id: 'p1', displayName: 'John' } }
    });
    vi.mocked(profileApi.updateProfile).mockResolvedValueOnce({
      data: { profile: { id: 'p1', displayName: 'New Name' } }
    });

    render(
      <ProfileProvider>
        <TestComponent />
      </ProfileProvider>
    );

    // Load initial
    await act(async () => {
      screen.getByText(/Load Profile/i).click();
    });
    await waitFor(() => screen.getByTestId('profile-name'));

    // Update
    const updateBtn = screen.getByText(/Update Name/i);
    await act(async () => {
      updateBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('profile-name').textContent).toBe('New Name');
    });
    expect(profileApi.updateProfile).toHaveBeenCalledWith({ displayName: 'New Name' });
  });
});
