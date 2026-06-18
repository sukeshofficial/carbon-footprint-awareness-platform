import actionService from '../services/action.service.js';
import catchAsync from '../utils/catchAsync.js';

class ActionController {
  getActions = catchAsync(async (req, res) => {
    const { planId } = req.query;
    const actions = await actionService.getActions(req.user.id, planId);
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
    const action = await actionService.completeAction(req.user.id, req.params.id);
    res.status(200).json({
      status: 'success',
      data: { action }
    });
  });

  skipAction = catchAsync(async (req, res) => {
    const action = await actionService.skipAction(req.user.id, req.params.id);
    res.status(200).json({
      status: 'success',
      data: { action }
    });
  });
}

export default new ActionController();
