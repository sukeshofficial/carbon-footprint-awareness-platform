import streakService from '../services/streak.service.js';
import catchAsync from '../utils/catchAsync.js';

class StreakController {
  getStreak = catchAsync(async (req, res) => {
    const streak = await streakService.getStreak(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { streak }
    });
  });
}

export default new StreakController();
