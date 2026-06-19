import mongoose from 'mongoose';
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

      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof mongoose.Types.ObjectId)) {
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
    const safeUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(String(userId)) : userId;
    return await Profile.findOne({ userId: safeUserId });
  }

  async updateProfile(userId, profileData) {
    const safeUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(String(userId)) : userId;
    const updates = this.flattenObject(profileData);
    return await Profile.findOneAndUpdate(
      { userId: safeUserId },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async updatePreferences(userId, preferences) {
    const safeUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(String(userId)) : userId;
    const updates = this.flattenObject(preferences);
    return await Profile.findOneAndUpdate(
      { userId: safeUserId },
      { $set: updates },
      { new: true, runValidators: true }
    );
  }

  async upsertProfile(userId, profileData) {
    const safeUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(String(userId)) : userId;
    const updates = this.flattenObject(profileData);
    return await Profile.findOneAndUpdate(
      { userId: safeUserId },
      { $set: { ...updates, userId: safeUserId } },
      { new: true, upsert: true, runValidators: true }
    );
  }
}

export default new ProfileRepository();
