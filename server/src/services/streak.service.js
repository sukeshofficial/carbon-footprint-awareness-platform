import streakRepository from '../repositories/streak.repository.js';

class StreakService {
  async getStreak(userId) {
    return await streakRepository.getOrCreate(userId);
  }

  async updateStreakOnCompletion(userId) {
    const streak = await streakRepository.getOrCreate(userId);
    const now = new Date();
    const lastDate = streak.lastCompletionDate;

    let currentStreak = streak.currentStreak;
    let longestStreak = streak.longestStreak;

    if (!lastDate) {
      currentStreak = 1;
    } else {
      const diffTime = Math.abs(now - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        currentStreak += 1;
      } else if (diffDays > 1) {
        // Day skipped, reset streak
        currentStreak = 1;
      }
      // If same day, don't increment (already done)
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    return await streakRepository.updateStreak(userId, {
      currentStreak,
      longestStreak,
      lastCompletionDate: now,
    });
  }

  async resetExpiredStreaks() {
    // This could be run by a background job
  }
}

export default new StreakService();
