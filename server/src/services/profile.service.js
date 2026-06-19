import profileRepository from '../infrastructure/repositories/profile.repository.js';
import carbonContextService from './carbonContext.service.js';
import carbonEstimationService from './carbonEstimation.service.js';

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

    // Trigger Carbon Recalculation
    try {
      await carbonEstimationService.calculateForUser(userId);
    } catch (e) {
      console.warn(`[ProfileService] Automatic carbon recalculation failed: ${e.message}`);
    }

    return profile;
  }

  async getProfile(userId) {
    let profile = await profileRepository.getProfileByUserId(userId);

    // Try to sync from Carbon Context if profile is missing fields
    try {
      const syncResult = await carbonContextService.syncToProfile(userId, profile || { userId });
      if (syncResult.changed) {
        // If profile didn't exist, we return a virtual object that the form can use
        // If it did exist, we return the merged data
        return syncResult.data;
      }
    } catch (e) {
      console.warn(`[ProfileService] Failed to sync from context: ${e.message}`);
    }

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

    // Trigger Carbon Recalculation
    try {
      await carbonEstimationService.calculateForUser(userId);
    } catch (e) {
      console.warn(`[ProfileService] Automatic carbon recalculation failed: ${e.message}`);
    }

    return updatedProfile;
  }

  async patchPreferences(userId, preferences) {
    const updatedProfile = await profileRepository.updatePreferences(userId, preferences);

    if (!updatedProfile) {
      throw new Error('Profile not found');
    }

    // Sync to Carbon Context
    await carbonContextService.syncFromProfile(userId, updatedProfile);

    // Trigger Carbon Recalculation
    try {
      await carbonEstimationService.calculateForUser(userId);
    } catch (e) {
      console.warn(`[ProfileService] Automatic carbon recalculation failed: ${e.message}`);
    }

    return updatedProfile;
  }
}

export default new ProfileService();
