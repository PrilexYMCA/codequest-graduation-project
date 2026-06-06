const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { isValidName, isValidPassword } = require('../utils/validation');

const BCRYPT_ROUNDS = 12;

async function updateProfile(userId, { name }) {
  if (!isValidName(name)) {
    const err = new Error("Імʼя має містити щонайменше 2 символи");
    err.statusCode = 400;
    throw err;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
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

  return updated;
}

async function changePassword(userId, { currentPassword, newPassword }) {
  if (typeof currentPassword !== 'string' || currentPassword.length === 0) {
    const err = new Error('Поточний пароль обовʼязковий');
    err.statusCode = 400;
    throw err;
  }
  if (!isValidPassword(newPassword)) {
    const err = new Error('Новий пароль має містити щонайменше 8 символів');
    err.statusCode = 400;
    throw err;
  }
  if (currentPassword === newPassword) {
    const err = new Error('Новий пароль має відрізнятися від поточного');
    err.statusCode = 400;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('Користувача не знайдено');
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Поточний пароль неправильний');
    err.statusCode = 401;
    throw err;
  }

  const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  return { success: true };
}

module.exports = { updateProfile, changePassword };
