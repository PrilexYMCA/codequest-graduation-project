const prisma = require('../config/prisma');
const userService = require('../services/userService');

async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        rank: true,
        xp: true,
        streakDays: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const { name } = req.body;
    if (typeof name !== 'string') {
      return res.status(400).json({ error: "Параметр name обовʼязковий" });
    }
    const updated = await userService.updateProfile(req.user.id, { name });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user.id, {
      currentPassword,
      newPassword,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, changePassword };
