import mongoose from 'mongoose';

const whatIfScenarioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    templateId: {
      type: String,
      required: true,
    },
    scenarioType: {
      type: String,
      enum: ['transport', 'food', 'energy', 'shopping'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    inputPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const WhatIfScenario = mongoose.model('WhatIfScenario', whatIfScenarioSchema);

export default WhatIfScenario;
