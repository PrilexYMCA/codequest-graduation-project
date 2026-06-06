const express = require('express');
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, courseController.listCourses);
router.get('/:id', authenticate, courseController.getCourse);

module.exports = router;
