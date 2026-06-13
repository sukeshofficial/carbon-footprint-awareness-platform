import api from './api';

export const createProfile = async (profileData) => {
  const response = await api.post('/profile/me', profileData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.post('/profile/me', profileData); // Repository uses upsert or controller handles PUT. Wait, controller has updateProfileController for PUT.
  // Actually, I defined PUT /me in routes.
  const res = await api.put('/profile/me', profileData);
  return res.data;
};

export const patchPreferences = async (preferences) => {
  const response = await api.patch('/profile/me/preferences', preferences);
  return response.data;
};

export default {
  createProfile,
  getProfile,
  updateProfile,
  patchPreferences,
};
