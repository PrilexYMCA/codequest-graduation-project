const adminService = require('../services/adminService');

async function listUsers(req, res, next) {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: 'Невірний ідентифікатор користувача' });
    }
    const { name } = req.body;
    if (typeof name !== 'string') {
      return res.status(400).json({ error: "Параметр name обовʼязковий" });
    }
    const updated = await adminService.updateUserName(userId, name);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function toggleUserActive(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: 'Невірний ідентифікатор користувача' });
    }
    const updated = await adminService.toggleUserActive(userId, req.user.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function getStructure(req, res, next) {
  try {
    const structure = await adminService.getStructure();
    res.json(structure);
  } catch (err) {
    next(err);
  }
}

async function createLesson(req, res, next) {
  try {
    const { moduleId, title, content } = req.body;
    if (!Number.isInteger(moduleId)) {
      return res.status(400).json({ error: 'Невірний ідентифікатор модуля' });
    }
    const lesson = await adminService.createLesson({ moduleId, title, content });
    res.status(201).json(lesson);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { lessonId, title, description, starterCode, xpReward, testCases } = req.body;
    if (!Number.isInteger(lessonId)) {
      return res.status(400).json({ error: 'Невірний ідентифікатор уроку' });
    }
    const task = await adminService.createTask({
      lessonId,
      title,
      description,
      starterCode,
      xpReward,
      testCases,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  updateUser,
  toggleUserActive,
  getStructure,
  createLesson,
  createTask,
};
