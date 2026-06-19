import mongoose from 'mongoose';

const recommendationFeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recommendationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recommendation',
      required: true,
      index: true,
    },
    recommendationKey: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'accepted', 'dismissed', 'completed'],
      required: true,
    },
    metadataJson: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const RecommendationFeedback = mongoose.model('RecommendationFeedback', recommendationFeedbackSchema);

export default RecommendationFeedback;
