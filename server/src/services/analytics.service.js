import progressSnapshotRepository from '../repositories/progressSnapshot.repository.js';
import actionRepository from '../repositories/action.repository.js';
import goalRepository from '../repositories/goal.repository.js';

class AnalyticsService {
  async updateProgressSnapshot(userId, goalId) {
    if (!goalId) {
      const activeGoal = await goalRepository.findActiveByUserId(userId);
      if (!activeGoal) return null;
      goalId = activeGoal._id;
    }

    const goal = await goalRepository.findById(goalId);
    if (!goal) return null;

    // Calculate metrics
    const actions = await actionRepository.findByUserId(userId);
    const completedActions = actions.filter(a => a.status === 'completed');

    const totalActionsCount = actions.length;
    const completedActionsCount = completedActions.length;
    const completionRate = totalActionsCount > 0 ? (completedActionsCount / totalActionsCount) * 100 : 0;

    const estimatedCo2Saved = completedActions.reduce((sum, a) => sum + (a.impactEstimate || 0), 0);

    // Calculate goal achievement percent
    let goalAchievementPercent = 0;
    if (goal.targetType === 'action_completion_count') {
      goalAchievementPercent = goal.targetValue > 0 ? (completedActionsCount / goal.targetValue) * 100 : 0;
    } else if (goal.targetType === 'footprint_reduction_percent') {
      // For MVP, simplified: 1kg saved = 0.1% progress? No, we need a better mapping or just use co2 targets.
      // Let's assume targetValue is in percentage of reduction.
      // This would require baseline footprint.
      goalAchievementPercent = 0; // Placeholder for more advanced logic
    }

    // Weekly performance (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActions = await actionRepository.findByDateRange(userId, sevenDaysAgo, new Date());

    const weeklyPerformance = [0, 0, 0, 0, 0, 0, 0];
    recentActions.forEach(a => {
      if (a.status === 'completed') {
        const dayIdx = new Date(a.scheduledDate).getDay();
        weeklyPerformance[dayIdx]++;
      }
    });

    const snapshot = await progressSnapshotRepository.create({
      userId,
      goalId,
      completionRate,
      goalAchievementPercent,
      weeklyPerformance,
      completedActionsCount,
      totalActionsCount,
      estimatedCo2Saved,
      snapshotDate: new Date()
    });

    // Also update goal's currentValue if it's based on count
    if (goal.targetType === 'action_completion_count') {
      await goalRepository.updateCurrentValue(goalId, completedActionsCount);
    }

    return snapshot;
  }

  async getDashboardMetrics(userId) {
    const activeGoal = await goalRepository.findActiveByUserId(userId);
    if (!activeGoal) return null;

    const latestSnapshot = await progressSnapshotRepository.findLatestByGoalId(activeGoal._id);
    return latestSnapshot;
  }
}

export default new AnalyticsService();
