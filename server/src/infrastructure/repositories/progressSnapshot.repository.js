import ProgressSnapshot from '../models/progressSnapshot.model.js';

class ProgressSnapshotRepository {
  async create(snapshotData) {
    return await ProgressSnapshot.create(snapshotData);
  }

  async findLatestByGoalId(goalId) {
    return await ProgressSnapshot.findOne({ goalId }).sort({ snapshotDate: -1 });
  }

  async findHistoryByGoalId(goalId, limit = 30) {
    return await ProgressSnapshot.find({ goalId })
      .sort({ snapshotDate: -1 })
      .limit(limit);
  }

  async findByUserId(userId, limit = 10) {
    return await ProgressSnapshot.find({ userId })
      .sort({ snapshotDate: -1 })
      .limit(limit);
  }
}

export default new ProgressSnapshotRepository();
