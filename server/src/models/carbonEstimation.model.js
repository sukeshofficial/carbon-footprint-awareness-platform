import mongoose from 'mongoose';

const carbonEstimationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    version: {
      type: String,
      required: true,
    },
    transportCO2: {
      type: Number,
      default: 0,
    },
    foodCO2: {
      type: Number,
      default: 0,
    },
    energyCO2: {
      type: Number,
      default: 0,
    },
    shoppingCO2: {
      type: Number,
      default: 0,
    },
    totalWeeklyCO2: {
      type: Number,
      required: true,
    },
    totalMonthlyCO2: {
      type: Number,
      required: true,
    },
    topSource: {
      type: String,
      required: true,
    },
    severityLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'unknown'],
      required: true,
    },
    trendLabel: {
      type: String,
      enum: ['improved', 'stable', 'increased', 'new'],
      default: 'new',
    },
    confidenceScore: {
      type: Number,
      default: 100,
    },
    assumptionsJson: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    inputSnapshotJson: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    aiInsights: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
carbonEstimationSchema.index({ userId: 1, calculatedAt: -1 });

const CarbonEstimation = mongoose.model('CarbonEstimation', carbonEstimationSchema);

export default CarbonEstimation;
