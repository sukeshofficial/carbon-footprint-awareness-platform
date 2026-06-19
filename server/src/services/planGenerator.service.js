import actionPlanRepository from '../infrastructure/repositories/actionPlan.repository.js';
import actionRepository from '../infrastructure/repositories/action.repository.js';
import recommendationService from './recommendation.service.js';
import AppError from '../utils/appError.js';

class PlanGenerator {
  async generatePlan(userId, goalId, planType = 'weekly') {
    // 1. Get recommendations
    // getRecommendations returns a formatted object { topActions, categorySuggestions, summary }
    const formatted = await recommendationService.getRecommendations(userId);

    // Flatten categorySuggestions into a single deduplicated array; fall back to topActions
    let recommendations = [];
    if (formatted?.categorySuggestions) {
      const seen = new Set();
      for (const recs of Object.values(formatted.categorySuggestions)) {
        for (const rec of recs) {
          const key = rec._id?.toString() || rec.recommendationKey;
          if (!seen.has(key)) { seen.add(key); recommendations.push(rec); }
        }
      }
    }
    if (recommendations.length === 0 && formatted?.topActions?.length) {
      recommendations = formatted.topActions;
    }
    if (!recommendations || recommendations.length === 0) {
      throw new AppError('No recommendations available to generate a plan. Please complete profiling first.', 400);
    }

    // 2. Determine dates
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const durationDays = planType === 'weekly' ? 7 : 30;

    // 3. Create Plan record
    const plan = await actionPlanRepository.create({
      userId,
      goalId,
      planType,
      startDate,
      endDate: new Date(startDate.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    // 4. Generate Actions using static logic
    const actionsToCreate = PlanGenerator.distributeActions(recommendations, durationDays, startDate).map(action => ({
      ...action,
      planId: plan._id,
      userId
    }));

    await actionRepository.createMany(actionsToCreate);

    return plan;
  }

  /**
   * Pure logic to distribute recommendations into daily actions
   */
  static distributeActions(recommendations, durationDays, startDate) {
    // Sort recommendations by effort (easy first)
    const effortMap = { low: 1, medium: 2, high: 3 };
    const sortedRecs = [...recommendations].sort((a, b) => {
      const effortA = effortMap[a.effortLevel] || 2;
      const effortB = effortMap[b.effortLevel] || 2;
      return effortA - effortB;
    });

    const actions = [];
    for (let i = 0; i < durationDays; i++) {
      const rec = sortedRecs[i % sortedRecs.length];
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(startDate.getDate() + i);

      actions.push({
        title: rec.title,
        description: rec.description,
        recommendationId: rec._id, // Used for testing verification
        impactEstimate: rec.co2SavedEstimate,
        effortLevel: rec.effortLevel,
        scheduledDate,
        status: 'pending',
        category: rec.category,
        carbonUnit: 'kg CO2e',
        savingsCurrencyEstimate: rec.moneySavedEstimate || 0
      });
    }
    return actions;
  }
}

export { PlanGenerator };
export default new PlanGenerator();
