import carbonEstimationRepository from '../repositories/carbonEstimation.repository.js';
import profileRepository from '../repositories/profile.repository.js';
import CarbonContext from '../models/carbonContext.model.js'; // Directly using model as repository for CC might not exist yet or I haven't seen it
import { normalizeInputs } from './carbonEstimation/inputNormalizer.js';
import { estimateTransport } from './carbonEstimation/transportEstimator.js';
import { estimateFood } from './carbonEstimation/foodEstimator.js';
import { estimateEnergy } from './carbonEstimation/energyEstimator.js';
import { estimateShopping } from './carbonEstimation/shoppingEstimator.js';
import { aggregateResults } from './carbonEstimation/carbonAggregation.service.js';
import { ESTIMATION_MODEL_VERSION } from '../config/carbonEstimation.config.js';
import aiService from './ai.service.js';

class CarbonEstimationService {
  async calculateForUser(userId) {
    // 1. Load normalized user inputs
    const profile = await profileRepository.getProfileByUserId(userId);
    const carbonContext = await CarbonContext.findOne({ userId });

    console.log(`[CarbonEstimationService] Data check for ${userId}: profile=${!!profile}, cc=${!!carbonContext}`);
    if (carbonContext) {
      console.log(`[CarbonEstimationService] CC Status for ${userId}: ${carbonContext.draftStatus}, ready: ${carbonContext.carbonContextReady}`);
    }

    if (!profile && !carbonContext) {
      console.warn(`[CarbonEstimationService] No profile or CC found for user ${userId}`);
      throw new Error('User profile or carbon context not found. Please complete onboarding.');
    }

    console.log(`[CarbonEstimationService] Normalizing inputs for user ${userId}...`);
    const normalizedInputs = normalizeInputs(profile, carbonContext);

    // 2. Run category estimators
    console.log(`[CarbonEstimationService] Calculating categories for user ${userId}...`);
    const transportCO2 = estimateTransport(normalizedInputs);
    const foodCO2 = estimateFood(normalizedInputs);
    const energyCO2 = estimateEnergy(normalizedInputs);
    const shoppingCO2 = estimateShopping(normalizedInputs);

    // 3. Get previous calculation for trend
    const previousEstimation = await carbonEstimationRepository.getLatestByUserId(userId);

    // 4. Aggregate results
    const aggregated = aggregateResults(
      {
        transport: transportCO2,
        food: foodCO2,
        energy: energyCO2,
        shopping: shoppingCO2,
      },
      previousEstimation
    );

    // 5. Generate AI Insights (Fire-and-forget background task for initial run)
    // We don't await this to keep the response time fast.
    aiService.generateCarbonInsights(aggregated, normalizedInputs)
      .then(aiInsights => {
        if (aiInsights) {
          carbonEstimationRepository.updateByUserId(userId, { aiInsights });
        }
      })
      .catch(err => console.warn('[CarbonEstimationService] Background AI Insights generation failed:', err.message));

    // 6. Build record
    const estimationData = {
      userId,
      version: ESTIMATION_MODEL_VERSION,
      ...aggregated,
      aiInsights: null, // Initially null, updated by background task
      inputSnapshotJson: normalizedInputs,
      calculatedAt: new Date(),
    };

    // 6. Persist result
    return await carbonEstimationRepository.saveEstimation(estimationData);
  }

  async getLatestEstimation(userId) {
    let latest = await carbonEstimationRepository.getLatestByUserId(userId);

    // If no estimation exists, trigger first calculation if data is available
    if (!latest) {
      try {
        latest = await this.calculateForUser(userId);
      } catch (error) {
        console.error(`[CarbonEstimationService] Auto-calculation failed for user ${userId}:`, error.message);
        return null; // Gracefully return null if data missing
      }
    }

    return latest;
  }

  async getEstimationHistory(userId) {
    return await carbonEstimationRepository.getHistoryByUserId(userId);
  }

  async updateEstimation(estimationId, updateData) {
    return await carbonEstimationRepository.updateById(estimationId, updateData);
  }
}

export default new CarbonEstimationService();
