const express = require('express');
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', authenticate, courseController.getLesson);

module.exports = router;
