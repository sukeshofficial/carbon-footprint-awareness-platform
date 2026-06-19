import mongoose from 'mongoose';

const progressSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
      index: true,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
    goalAchievementPercent: {
      type: Number,
      default: 0,
    },
    weeklyPerformance: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0, 0],
    },
    completedActionsCount: {
      type: Number,
      default: 0,
    },
    totalActionsCount: {
      type: Number,
      default: 0,
    },
    estimatedCo2Saved: {
      type: Number,
      default: 0,
    },
    snapshotDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProgressSnapshot = mongoose.model('ProgressSnapshot', progressSnapshotSchema);

export default ProgressSnapshot;
