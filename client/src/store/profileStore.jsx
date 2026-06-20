import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import profileApi from '../services/profileApi';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data.profile);
      setIsFetched(true);
      return response.data.profile;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch profile';
      setError(message);
      setIsFetched(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.createProfile(profileData);
      setProfile(response.data.profile);
      setIsFetched(true);
      return response.data.profile;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.updateProfile(profileData);
      setProfile(response.data.profile);
      return response.data.profile;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const patchPreferences = async (preferences) => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.patchPreferences(preferences);
      setProfile(response.data.profile);
      return response.data.profile;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update preferences';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      profile,
      loading,
      isFetched,
      error,
      isProfileComplete: !!profile?.isOnboardingCompleted,
      fetchProfile,
      saveProfile,
      updateProfile,
      patchPreferences,
    }),
    [profile, loading, isFetched, error, fetchProfile]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
