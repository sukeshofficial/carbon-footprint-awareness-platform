import profileRepository from '../repositories/profile.repository.js';
import carbonContextService from './carbonContext.service.js';

class ProfileService {
  normalizeProfileData(data) {
    const normalized = { ...data };

    if (normalized.displayName) {
      normalized.displayName = normalized.displayName.trim();
    }

    if (normalized.cityRegion) {
      normalized.cityRegion = normalized.cityRegion.trim().toLowerCase();
    }

    return normalized;
  }

  async createProfile(userId, profileData) {
    const normalizedData = this.normalizeProfileData(profileData);
    normalizedData.userId = userId;

    // Use upsert to handle draft saves during progressive onboarding
    const profile = await profileRepository.upsertProfile(userId, normalizedData);

    // Sync to Carbon Context
    await carbonContextService.syncFromProfile(userId, profile);

    return profile;
  }

  async getProfile(userId) {
    const profile = await profileRepository.getProfileByUserId(userId);
    if (!profile) {
      return null;
    }
    return profile;
  }

  async updateProfile(userId, profileData) {
    const normalizedData = this.normalizeProfileData(profileData);
    const updatedProfile = await profileRepository.updateProfile(userId, normalizedData);

    if (!updatedProfile) {
      throw new Error('Profile not found');
    }

    // Sync to Carbon Context
    await carbonContextService.syncFromProfile(userId, updatedProfile);

    return updatedProfile;
  }

  async patchPreferences(userId, preferences) {
    const updatedProfile = await profileRepository.updatePreferences(userId, preferences);

    if (!updatedProfile) {
      throw new Error('Profile not found');
    }

    // Sync to Carbon Context
    await carbonContextService.syncFromProfile(userId, updatedProfile);

    return updatedProfile;
  }
}

export default new ProfileService();
