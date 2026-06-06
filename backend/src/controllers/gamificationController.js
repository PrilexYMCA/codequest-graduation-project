const gamificationService = require('../services/gamificationService');

async function getLeaderboard(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const leaderboard = await gamificationService.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
}

async function getMyAchievements(req, res, next) {
  try {
    const achievements = await gamificationService.getAchievementsForUser(req.user.id);
    res.json(achievements);
  } catch (err) {
    next(err);
  }
}

async function testAwardXp(req, res, next) {
  try {
    const { amount } = req.body;
    if (!Number.isInteger(amount) || amount <= 0 || amount > 5000) {
      return res.status(400).json({
        error: 'Параметр amount має бути цілим числом від 1 до 5000',
      });
    }

    const result = await gamificationService.awardXp(req.user.id, amount);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getLeaderboard, getMyAchievements, testAwardXp };
