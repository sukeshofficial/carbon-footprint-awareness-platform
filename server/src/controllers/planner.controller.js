import planGenerator from '../services/planGenerator.service.js';
import analyticsService from '../services/analytics.service.js';
import catchAsync from '../utils/catchAsync.js';

class PlannerController {
  generatePlan = catchAsync(async (req, res) => {
    const { goalId, planType } = req.body;
    const plan = await planGenerator.generatePlan(req.user.id, goalId, planType);
    res.status(201).json({
      status: 'success',
      data: { plan }
    });
  });

  getAnalytics = catchAsync(async (req, res) => {
    const metrics = await analyticsService.getDashboardMetrics(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { metrics }
    });
  });

  refreshAnalytics = catchAsync(async (req, res) => {
    const metrics = await analyticsService.updateProgressSnapshot(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { metrics }
    });
  });
}

export default new PlannerController();
