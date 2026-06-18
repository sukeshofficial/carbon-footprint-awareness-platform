import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastCompletionDate: {
      type: Date,
    },
    graceSkipsUsedThisWeek: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Streak = mongoose.model('Streak', streakSchema);

export default Streak;
