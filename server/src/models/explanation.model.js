import mongoose from 'mongoose';

const explanationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    estimationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarbonEstimation',
      required: true,
    },
    summaryText: {
      type: String,
      required: true,
    },
    categoryExplanationsJson: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    habitExplanationsJson: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    recommendationReasoningJson: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    version: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

explanationSchema.index({ userId: 1, createdAt: -1 });

const CarbonExplanation = mongoose.model('CarbonExplanation', explanationSchema);

export default CarbonExplanation;
