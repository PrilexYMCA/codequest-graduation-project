jest.mock('../src/config/prisma', () => ({
  task: {
    findUnique: jest.fn(),
  },
  submission: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));

jest.mock('../src/services/gamificationService', () => ({
  awardXp: jest.fn(),
}));

const prisma = require('../src/config/prisma');
const gamificationService = require('../src/services/gamificationService');
const {
  getTask,
  submitSolution,
  getSubmissionHistory,
} = require('../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTask', () => {
    test('returns task with lesson and test cases', async () => {
      const task = {
        id: 7,
        title: 'FizzBuzz',
        testCases: [{ id: 1, input: '[3]', expectedOutput: '"Fizz"', isHidden: false }],
        lesson: { id: 2, title: 'Loops' },
      };
      prisma.task.findUnique.mockResolvedValue(task);

      await expect(getTask(7)).resolves.toBe(task);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 7 },
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
    });

    test('throws 404 when task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(getTask(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('submitSolution', () => {
    test('awards XP for the first passed submission', async () => {
      const task = { id: 3, xpReward: 75 };
      const submission = { id: 10, userId: 1, taskId: 3, status: 'PASSED' };
      const gamification = { xpAwarded: 75, newXp: 575 };

      prisma.task.findUnique.mockResolvedValue(task);
      prisma.submission.findFirst.mockResolvedValue(null);
      prisma.submission.create.mockResolvedValue(submission);
      gamificationService.awardXp.mockResolvedValue(gamification);

      await expect(
        submitSolution(1, 3, { code: 'return true;', status: 'PASSED' })
      ).resolves.toEqual({
        submission,
        gamification,
        alreadyPassed: false,
      });

      expect(gamificationService.awardXp).toHaveBeenCalledWith(1, 75);
    });

    test('does not award XP when task was already passed', async () => {
      const previousPass = { id: 8 };
      const submission = { id: 11, userId: 1, taskId: 3, status: 'PASSED' };

      prisma.task.findUnique.mockResolvedValue({ id: 3, xpReward: 75 });
      prisma.submission.findFirst.mockResolvedValue(previousPass);
      prisma.submission.create.mockResolvedValue(submission);

      await expect(
        submitSolution(1, 3, { code: 'return true;', status: 'PASSED' })
      ).resolves.toEqual({
        submission,
        gamification: null,
        alreadyPassed: true,
      });

      expect(gamificationService.awardXp).not.toHaveBeenCalled();
    });

    test('does not award XP for failed submissions', async () => {
      const submission = { id: 12, userId: 1, taskId: 3, status: 'FAILED' };

      prisma.task.findUnique.mockResolvedValue({ id: 3, xpReward: 75 });
      prisma.submission.findFirst.mockResolvedValue(null);
      prisma.submission.create.mockResolvedValue(submission);

      await expect(
        submitSolution(1, 3, { code: 'throw Error();', status: 'FAILED' })
      ).resolves.toEqual({
        submission,
        gamification: null,
        alreadyPassed: false,
      });

      expect(gamificationService.awardXp).not.toHaveBeenCalled();
    });

    test('throws 404 when submitting to missing task', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(
        submitSolution(1, 404, { code: '', status: 'FAILED' })
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(prisma.submission.create).not.toHaveBeenCalled();
    });
  });

  test('getSubmissionHistory returns latest ten submissions', async () => {
    const history = [{ id: 1, status: 'PASSED' }];
    prisma.submission.findMany.mockResolvedValue(history);

    await expect(getSubmissionHistory(2, 5)).resolves.toBe(history);
    expect(prisma.submission.findMany).toHaveBeenCalledWith({
      where: { userId: 2, taskId: 5 },
      orderBy: { submittedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        status: true,
        submittedAt: true,
      },
    });
  });
});
