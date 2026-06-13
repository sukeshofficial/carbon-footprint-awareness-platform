import profileRepository from '../repositories/profile.repository.js';

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
    return await profileRepository.upsertProfile(userId, normalizedData);
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

    return updatedProfile;
  }

  async patchPreferences(userId, preferences) {
    const updatedProfile = await profileRepository.updatePreferences(userId, preferences);

    if (!updatedProfile) {
      throw new Error('Profile not found');
    }

    return updatedProfile;
  }
}

export default new ProfileService();
