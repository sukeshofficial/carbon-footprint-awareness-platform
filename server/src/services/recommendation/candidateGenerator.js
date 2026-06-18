import RECOMMENDATION_CATALOG from './recommendationCatalog.js';
import RECOMMENDATION_RULES from './recommendationRules.js';

class CandidateGenerator {
  generateCandidates(context, estimation) {
    const candidates = [];

    for (const action of RECOMMENDATION_CATALOG) {
      const rule = RECOMMENDATION_RULES[action.key];

      if (rule && rule(context, estimation)) {
        candidates.push({
          ...action,
          // You can add more dynamic data here if needed
        });
      }
    }

    return candidates;
  }
}

export default new CandidateGenerator();
