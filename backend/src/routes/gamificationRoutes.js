const express = require('express');
const gamificationController = require('../controllers/gamificationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/leaderboard', authenticate, gamificationController.getLeaderboard);
router.get('/achievements', authenticate, gamificationController.getMyAchievements);
router.post('/test-award', authenticate, gamificationController.testAwardXp);

module.exports = router;
