import express from 'express';
import whatIfScenarioController from '../controllers/whatIfScenario.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All what-if routes are protected
router.use(protect);

/** GET  /api/v1/what-if/scenarios     — list all available templates */
router.get('/scenarios', whatIfScenarioController.getTemplates.bind(whatIfScenarioController));

/** POST /api/v1/what-if/scenarios/preview — preview impact without saving */
router.post('/scenarios/preview', whatIfScenarioController.previewScenario.bind(whatIfScenarioController));

/** GET  /api/v1/what-if/scenarios/me  — list user's saved scenarios */
router.get('/scenarios/me', whatIfScenarioController.getMyScenarios.bind(whatIfScenarioController));

/** POST /api/v1/what-if/scenarios     — save a scenario */
router.post('/scenarios', whatIfScenarioController.saveScenario.bind(whatIfScenarioController));

/** GET  /api/v1/what-if/scenarios/:id — get a single saved scenario */
router.get('/scenarios/:id', whatIfScenarioController.getScenarioById.bind(whatIfScenarioController));

export default router;
