import CarbonContext from '../models/carbonContext.model.js';

class CarbonContextRepository {
  async findByUserId(userId) {
    return await CarbonContext.findOne({ userId });
  }

  async create(data) {
    return await CarbonContext.create(data);
  }

  async updateByUserId(userId, updateData) {
    return await CarbonContext.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async upsert(userId, data) {
    return await CarbonContext.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  }

  async updateStep(userId, stepKey, stepData, completionStep) {
    const update = {
      [`${stepKey}Profile`]: stepData,
      completionStep,
      lastAnsweredAt: new Date(),
    };

    // Special handling for workRoutine which is not suffixed with 'Profile' in the model for some reason?
    // Looking at the model: transportProfile, foodProfile, energyProfile, shoppingProfile, workRoutine, lifestyleContext, wasteProfile.

    let fieldName = `${stepKey}Profile`;
    if (stepKey === 'routine') fieldName = 'workRoutine';
    if (stepKey === 'lifestyle') fieldName = 'lifestyleContext';
    if (stepKey === 'travel') fieldName = 'transportProfile';
    if (stepKey === 'diet') fieldName = 'foodProfile';

    const finalUpdate = {
      [fieldName]: stepData,
      completionStep,
      lastAnsweredAt: new Date(),
    };

    return await CarbonContext.findOneAndUpdate(
      { userId },
      { $set: finalUpdate },
      { new: true, upsert: true }
    );
  }

  async markAsComplete(userId, derivedSignals) {
    return await CarbonContext.findOneAndUpdate(
      { userId },
      {
        $set: {
          draftStatus: 'completed',
          carbonContextReady: true,
          derivedCarbonSignals: derivedSignals,
          completedAt: new Date(),
        },
      },
      { new: true }
    );
  }
}

export default new CarbonContextRepository();
