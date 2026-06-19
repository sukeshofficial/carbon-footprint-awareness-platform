import actionService from '../services/action.service.js';
import catchAsync from '../utils/catchAsync.js';
import { sanitizeObjectId } from '../utils/mongooseUtils.js';

class ActionController {
  getActions = catchAsync(async (req, res) => {
    const { planId } = req.query;

    // Normalize and sanitize planId to prevent NoSQL injection
    const normalizedPlanId = planId ? sanitizeObjectId(planId, 'planId') : null;

    const actions = await actionService.getActions(req.user.id, normalizedPlanId);
    res.status(200).json({
      status: 'success',
      data: { actions }
    });
  });

  getTodayAction = catchAsync(async (req, res) => {
    const action = await actionService.getTodayAction(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { action }
    });
  });

  completeAction = catchAsync(async (req, res) => {
    const { id } = req.params;
    const sanitizedId = sanitizeObjectId(id, 'actionId');

    const action = await actionService.completeAction(req.user.id, sanitizedId);
    res.status(200).json({
      status: 'success',
      data: { action }
    });
  });

  skipAction = catchAsync(async (req, res) => {
    const { id } = req.params;
    const sanitizedId = sanitizeObjectId(id, 'actionId');

    const action = await actionService.skipAction(req.user.id, sanitizedId);
    res.status(200).json({
      status: 'success',
      data: { action }
    });
  });
}

export default new ActionController();
