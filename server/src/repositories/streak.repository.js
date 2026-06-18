import Streak from '../models/streak.model.js';

class StreakRepository {
  async findByUserId(userId) {
    return await Streak.findOne({ userId });
  }

  async create(userId) {
    return await Streak.create({ userId });
  }

  async updateStreak(userId, updateData) {
    return await Streak.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
  }

  async getOrCreate(userId) {
    let streak = await this.findByUserId(userId);
    if (!streak) {
      streak = await this.create(userId);
    }
    return streak;
  }
}

export default new StreakRepository();
