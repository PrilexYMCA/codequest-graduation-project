const prisma = require('../config/prisma');
const gamificationService = require('./gamificationService');

async function getTask(taskId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      testCases: {
        select: {
          id: true,
          input: true,
          expectedOutput: true,
          isHidden: true,
        },
      },
      lesson: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!task) {
    const err = new Error('Задачу не знайдено');
    err.statusCode = 404;
    throw err;
  }

  return task;
}

async function submitSolution(userId, taskId, { code, status }) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    const err = new Error('Задачу не знайдено');
    err.statusCode = 404;
    throw err;
  }

  const previousPass = await prisma.submission.findFirst({
    where: { userId, taskId, status: 'PASSED' },
  });

  const submission = await prisma.submission.create({
    data: { userId, taskId, code, status },
  });

  let gamification = null;
  if (status === 'PASSED' && !previousPass) {
    gamification = await gamificationService.awardXp(userId, task.xpReward);
  }

  return { submission, gamification, alreadyPassed: !!previousPass };
}

async function getSubmissionHistory(userId, taskId) {
  return await prisma.submission.findMany({
    where: { userId, taskId },
    orderBy: { submittedAt: 'desc' },
    take: 10,
    select: {
      id: true,
      status: true,
      submittedAt: true,
    },
  });
}

module.exports = { getTask, submitSolution, getSubmissionHistory };
