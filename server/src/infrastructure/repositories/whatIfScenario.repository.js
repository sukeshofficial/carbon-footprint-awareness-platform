/**
 * whatIfScenario.repository.js
 * Data access layer for what-if scenarios and results.
 */

import WhatIfScenario from '../models/whatIfScenario.model.js';
import WhatIfResult from '../models/whatIfResult.model.js';

class WhatIfScenarioRepository {
  async createScenario(scenarioData) {
    return WhatIfScenario.create(scenarioData);
  }

  async getScenarioById(id, userId) {
    return WhatIfScenario.findOne({ _id: id, userId });
  }

  async getScenariosByUserId(userId, limit = 20) {
    return WhatIfScenario.find({ userId, isSaved: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getAllScenariosByUserId(userId, limit = 20) {
    return WhatIfScenario.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async createResult(resultData) {
    return WhatIfResult.create(resultData);
  }

  async getResultByScenarioId(scenarioId) {
    return WhatIfResult.findOne({ scenarioId }).sort({ createdAt: -1 }).lean();
  }
}

export default new WhatIfScenarioRepository();
