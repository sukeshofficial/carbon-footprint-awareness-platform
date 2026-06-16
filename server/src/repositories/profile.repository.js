import Profile from '../models/profile.model.js';

class ProfileRepository {
  /**
   * Utility to flatten nested objects for MongoDB dot notation updates
   * E.g. { transportProfile: { primaryMode: 'bus' } } -> { 'transportProfile.primaryMode': 'bus' }
   */
  flattenObject(obj, prefix = '') {
    const flattened = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value.constructor?.name === 'ObjectId')) {
        Object.assign(flattened, this.flattenObject(value, newKey));
      } else {
        flattened[newKey] = value;
      }
    });
    return flattened;
  }

  async createProfile(profileData) {
    return await Profile.create(profileData);
  }

  async getProfileByUserId(userId) {
    return await Profile.findOne({ userId });
  }

  async updateProfile(userId, profileData) {
    const updates = this.flattenObject(profileData);
    return await Profile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async updatePreferences(userId, preferences) {
    const updates = this.flattenObject(preferences);
    return await Profile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async upsertProfile(userId, profileData) {
    const updates = this.flattenObject(profileData);
    return await Profile.findOneAndUpdate(
      { userId },
      { $set: { ...updates, userId } },
      { new: true, upsert: true, runValidators: true }
    );
  }
}

export default new ProfileRepository();
