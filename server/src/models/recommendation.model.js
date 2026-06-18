import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recommendationKey: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['transport', 'food', 'energy', 'shopping', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    co2SavedEstimate: {
      type: Number,
      required: true,
    },
    moneySavedEstimate: {
      type: Number,
      default: 0,
    },
    effortLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    impactScore: {
      type: Number,
      required: true,
    },
    confidenceScore: {
      type: Number,
      default: 100,
    },
    rankScore: {
      type: Number,
      default: 0,
    },
    reasonText: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'accepted', 'dismissed', 'completed'],
      default: 'active',
      index: true,
    },
    isTopPriority: {
      type: Boolean,
      default: false,
    },
    metadataJson: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
recommendationSchema.index({ userId: 1, status: 1 });
recommendationSchema.index({ userId: 1, recommendationKey: 1 });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
