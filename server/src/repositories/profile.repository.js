import Profile from '../models/profile.model.js';

class ProfileRepository {
  async createProfile(profileData) {
    return await Profile.create(profileData);
  }

  async getProfileByUserId(userId) {
    return await Profile.findOne({ userId });
  }

  async updateProfile(userId, profileData) {
    return await Profile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, runValidators: true }
    );
  }

  async updatePreferences(userId, preferences) {
    return await Profile.findOneAndUpdate(
      { userId },
      { $set: preferences },
      { new: true, runValidators: true }
    );
  }

  async upsertProfile(userId, profileData) {
    return await Profile.findOneAndUpdate(
      { userId },
      { $set: { ...profileData, userId } },
      { new: true, upsert: true, runValidators: true }
    );
  }
}

export default new ProfileRepository();
