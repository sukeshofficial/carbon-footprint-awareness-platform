import mongoose from 'mongoose';

const actionPlanSchema = new mongoose.Schema(
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
    planType: {
      type: String,
      enum: ['weekly', 'monthly'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },
    sourceRecommendationVersion: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

actionPlanSchema.index({ userId: 1, goalId: 1, status: 1 });

const ActionPlan = mongoose.model('ActionPlan', actionPlanSchema);

export default ActionPlan;
