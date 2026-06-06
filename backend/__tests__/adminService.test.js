jest.mock('../src/config/prisma', () => ({
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  course: {
    findMany: jest.fn(),
  },
  module: {
    findUnique: jest.fn(),
  },
  lesson: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  task: {
    create: jest.fn(),
  },
}));

const prisma = require('../src/config/prisma');
const {
  updateUserName,
  toggleUserActive,
  createLesson,
  createTask,
} = require('../src/services/adminService');

describe('adminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserName', () => {
    test('trims valid names before saving', async () => {
      const updatedUser = { id: 1, name: 'Ada Lovelace' };
      prisma.user.update.mockResolvedValue(updatedUser);

      await expect(updateUserName(1, '  Ada Lovelace  ')).resolves.toBe(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 1 },
        data: { name: 'Ada Lovelace' },
      }));
    });

    test('rejects invalid names before touching database', async () => {
      await expect(updateUserName(1, 'A')).rejects.toMatchObject({ statusCode: 400 });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('toggleUserActive', () => {
    test('toggles regular user activity', async () => {
      const user = { id: 2, role: 'STUDENT', isActive: true };
      const updated = { ...user, isActive: false };
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.update.mockResolvedValue(updated);

      await expect(toggleUserActive(2, 1)).resolves.toBe(updated);
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 2 },
        data: { isActive: false },
      }));
    });

    test('rejects missing users', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(toggleUserActive(404, 1)).rejects.toMatchObject({ statusCode: 404 });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    test('prevents admin from blocking own account', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, role: 'STUDENT', isActive: true });

      await expect(toggleUserActive(1, 1)).rejects.toMatchObject({ statusCode: 400 });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    test('prevents blocking administrator accounts', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 2, role: 'ADMIN', isActive: true });

      await expect(toggleUserActive(2, 1)).rejects.toMatchObject({ statusCode: 400 });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('createLesson', () => {
    test('creates lesson at the next module position', async () => {
      const lesson = { id: 9, moduleId: 4, position: 3 };
      prisma.module.findUnique.mockResolvedValue({ id: 4 });
      prisma.lesson.findFirst.mockResolvedValue({ position: 2 });
      prisma.lesson.create.mockResolvedValue(lesson);

      await expect(
        createLesson({ moduleId: 4, title: '  Arrays  ', content: '  Useful lesson body  ' })
      ).resolves.toBe(lesson);

      expect(prisma.lesson.create).toHaveBeenCalledWith({
        data: {
          moduleId: 4,
          title: 'Arrays',
          content: 'Useful lesson body',
          position: 3,
        },
      });
    });

    test('rejects missing module', async () => {
      prisma.module.findUnique.mockResolvedValue(null);

      await expect(
        createLesson({ moduleId: 404, title: 'Arrays', content: 'Useful lesson body' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    test('rejects too short lesson content', async () => {
      prisma.module.findUnique.mockResolvedValue({ id: 4 });

      await expect(
        createLesson({ moduleId: 4, title: 'Arrays', content: 'short' })
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('createTask', () => {
    const validTask = {
      lessonId: 7,
      title: '  Sum numbers  ',
      description: '  Add all values from the array  ',
      starterCode: 'function sum(values) {}',
      xpReward: 50,
      testCases: [
        { input: '[1,2,3]', expectedOutput: '6' },
      ],
    };

    test('creates task with trimmed fields and test cases', async () => {
      const task = { id: 12, title: 'Sum numbers' };
      prisma.lesson.findUnique.mockResolvedValue({ id: 7 });
      prisma.task.create.mockResolvedValue(task);

      await expect(createTask(validTask)).resolves.toBe(task);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          lessonId: 7,
          title: 'Sum numbers',
          description: 'Add all values from the array',
          starterCode: 'function sum(values) {}',
          xpReward: 50,
          testCases: {
            create: [
              { input: '[1,2,3]', expectedOutput: '6', isHidden: false },
            ],
          },
        },
        include: { testCases: true },
      });
    });

    test('rejects invalid XP reward', async () => {
      prisma.lesson.findUnique.mockResolvedValue({ id: 7 });

      await expect(
        createTask({ ...validTask, xpReward: 0 })
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(prisma.task.create).not.toHaveBeenCalled();
    });

    test('rejects invalid JSON in test cases', async () => {
      prisma.lesson.findUnique.mockResolvedValue({ id: 7 });

      await expect(
        createTask({
          ...validTask,
          testCases: [{ input: 'not-json', expectedOutput: '6' }],
        })
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(prisma.task.create).not.toHaveBeenCalled();
    });
  });
});
