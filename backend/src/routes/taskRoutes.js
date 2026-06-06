const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', authenticate, taskController.getTask);
router.post('/:id/submit', authenticate, taskController.submitSolution);
router.get('/:id/history', authenticate, taskController.getSubmissionHistory);

module.exports = router;
