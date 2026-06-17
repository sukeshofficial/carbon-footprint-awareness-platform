import mongoose from 'mongoose';

const whatIfResultSchema = new mongoose.Schema(
  {
    scenarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WhatIfScenario',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    baselineCO2: {
      type: Number,
      required: true,
    },
    projectedCO2: {
      type: Number,
      required: true,
    },
    co2Saved: {
      type: Number,
      required: true,
    },
    monthlySavingsCO2: {
      type: Number,
      required: true,
    },
    yearlySavingsCO2: {
      type: Number,
      required: true,
    },
    moneySavingsEstimate: {
      type: Number,
      default: 0,
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    explanationText: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WhatIfResult = mongoose.model('WhatIfResult', whatIfResultSchema);

export default WhatIfResult;
