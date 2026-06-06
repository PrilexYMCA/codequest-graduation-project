const prisma = require('../config/prisma');
const { isValidName } = require('../utils/validation');

async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      rank: true,
      xp: true,
      streakDays: true,
      isActive: true,
      createdAt: true,
    },
  });
}

async function updateUserName(userId, name) {
  if (!isValidName(name)) {
    const err = new Error("Імʼя має містити щонайменше 2 символи");
    err.statusCode = 400;
    throw err;
  }
  return await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      rank: true,
      xp: true,
      streakDays: true,
      isActive: true,
      createdAt: true,
    },
  });
}

async function toggleUserActive(userId, requesterId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('Користувача не знайдено');
    err.statusCode = 404;
    throw err;
  }

  if (user.id === requesterId) {
    const err = new Error('Не можна заблокувати самого себе');
    err.statusCode = 400;
    throw err;
  }

  if (user.role === 'ADMIN') {
    const err = new Error('Не можна заблокувати адміністратора');
    err.statusCode = 400;
    throw err;
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      rank: true,
      xp: true,
      streakDays: true,
      isActive: true,
      createdAt: true,
    },
  });
}

async function getStructure() {
  return await prisma.course.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      title: true,
      modules: {
        orderBy: { position: 'asc' },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: 'asc' },
            select: {
              id: true,
              title: true,
              position: true,
            },
          },
        },
      },
    },
  });
}

async function createLesson({ moduleId, title, content }) {
  const moduleRecord = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!moduleRecord) {
    const err = new Error('Модуль не знайдено');
    err.statusCode = 404;
    throw err;
  }
  if (typeof title !== 'string' || title.trim().length < 2) {
    const err = new Error('Назва уроку має містити щонайменше 2 символи');
    err.statusCode = 400;
    throw err;
  }
  if (typeof content !== 'string' || content.trim().length < 10) {
    const err = new Error('Зміст уроку має містити щонайменше 10 символів');
    err.statusCode = 400;
    throw err;
  }

  const lastLesson = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { position: 'desc' },
  });
  const nextPosition = (lastLesson?.position || 0) + 1;

  return await prisma.lesson.create({
    data: {
      moduleId,
      title: title.trim(),
      content: content.trim(),
      position: nextPosition,
    },
  });
}

async function createTask({ lessonId, title, description, starterCode, xpReward, testCases }) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    const err = new Error('Урок не знайдено');
    err.statusCode = 404;
    throw err;
  }
  if (typeof title !== 'string' || title.trim().length < 2) {
    const err = new Error("Назва задачі обовʼязкова");
    err.statusCode = 400;
    throw err;
  }
  if (typeof description !== 'string' || description.trim().length < 5) {
    const err = new Error("Опис задачі обовʼязковий");
    err.statusCode = 400;
    throw err;
  }
  if (typeof starterCode !== 'string') {
    const err = new Error("Стартовий код обовʼязковий");
    err.statusCode = 400;
    throw err;
  }
  if (!Number.isInteger(xpReward) || xpReward < 1 || xpReward > 1000) {
    const err = new Error('XP-винагорода має бути цілим числом від 1 до 1000');
    err.statusCode = 400;
    throw err;
  }
  if (!Array.isArray(testCases) || testCases.length === 0) {
    const err = new Error('Потрібен щонайменше один тестовий випадок');
    err.statusCode = 400;
    throw err;
  }

  for (const tc of testCases) {
    if (typeof tc.input !== 'string' || tc.input.trim().length === 0) {
      const err = new Error('У кожному тестовому випадку має бути вхід');
      err.statusCode = 400;
      throw err;
    }
    if (typeof tc.expectedOutput !== 'string' || tc.expectedOutput.trim().length === 0) {
      const err = new Error('У кожному тестовому випадку має бути очікуваний результат');
      err.statusCode = 400;
      throw err;
    }
    try {
      JSON.parse(tc.input);
      JSON.parse(tc.expectedOutput);
    } catch (e) {
      const err = new Error('Вхід та очікуваний результат мають бути коректним JSON');
      err.statusCode = 400;
      throw err;
    }
  }

  return await prisma.task.create({
    data: {
      lessonId,
      title: title.trim(),
      description: description.trim(),
      starterCode,
      xpReward,
      testCases: {
        create: testCases.map((tc) => ({
          input: tc.input.trim(),
          expectedOutput: tc.expectedOutput.trim(),
          isHidden: false,
        })),
      },
    },
    include: { testCases: true },
  });
}

module.exports = {
  getAllUsers,
  updateUserName,
  toggleUserActive,
  getStructure,
  createLesson,
  createTask,
};
