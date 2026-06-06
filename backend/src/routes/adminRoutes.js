const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/users', adminController.listUsers);
router.patch('/users/:id', adminController.updateUser);
router.post('/users/:id/toggle-active', adminController.toggleUserActive);

router.get('/structure', adminController.getStructure);
router.post('/lessons', adminController.createLesson);
router.post('/tasks', adminController.createTask);

module.exports = router;
