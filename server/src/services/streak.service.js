import streakRepository from '../infrastructure/repositories/streak.repository.js';

/**
 * Returns the UTC calendar date string (YYYY-MM-DD) for a given Date object.
 * Used to compare dates by calendar day, not by millisecond difference.
 */
const toUTCDateString = (date) => date.toISOString().slice(0, 10);

class StreakService {
  async getStreak(userId) {
    return await streakRepository.getOrCreate(userId);
  }

  /**
   * Called on every login. Increments the streak once per calendar day.
   * Same-day logins are ignored; missing a day resets the streak to 1.
   */
  async updateStreakOnLogin(userId) {
    const streak = await streakRepository.getOrCreate(userId);
    const now = new Date();
    const todayStr = toUTCDateString(now);

    let currentStreak = streak.currentStreak;
    let longestStreak = streak.longestStreak;
    const lastDate = streak.lastLoginDate;

    if (lastDate) {
      const lastStr = toUTCDateString(new Date(lastDate));

      if (lastStr === todayStr) {
        // Already logged in today — do nothing
        return streak;
      }

      // Calculate how many calendar days apart the two dates are
      const msPerDay = 1000 * 60 * 60 * 24;
      const diffDays = Math.round(
        (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
          Date.UTC(
            new Date(lastDate).getUTCFullYear(),
            new Date(lastDate).getUTCMonth(),
            new Date(lastDate).getUTCDate()
          )) / msPerDay
      );

      if (diffDays === 1) {
        // Consecutive calendar day — extend streak
        currentStreak += 1;
      } else {
        // Missed one or more days — reset
        currentStreak = 1;
      }
    } else {
      // First ever login
      currentStreak = 1;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    return await streakRepository.updateStreak(userId, {
      currentStreak,
      longestStreak,
      lastLoginDate: now,
    });
  }
}

export default new StreakService();
