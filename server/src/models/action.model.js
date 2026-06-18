import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema(
  {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActionPlan',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    impactEstimate: {
      type: Number, // in kg CO2e
      required: true,
    },
    effortLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'easy'], // Including 'easy' to match plan generator logic if needed
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'skipped'],
      default: 'pending',
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    carbonUnit: {
      type: String,
      default: 'kg CO2e',
    },
    savingsCurrencyEstimate: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

actionSchema.index({ userId: 1, scheduledDate: 1 });
actionSchema.index({ planId: 1, status: 1 });

const Action = mongoose.model('Action', actionSchema);

export default Action;
