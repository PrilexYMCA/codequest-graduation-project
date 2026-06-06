const prisma = require('../config/prisma');

async function getCourses() {
  return await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      level: true,
      coverUrl: true,
      _count: { select: { modules: true } },
    },
  });
}

async function getCourse(id) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { position: 'asc' },
        include: {
          lessons: {
            orderBy: { position: 'asc' },
            select: {
              id: true,
              title: true,
              position: true,
              _count: { select: { tasks: true } },
            },
          },
        },
      },
    },
  });
  if (!course) {
    const err = new Error('Курс не знайдено');
    err.statusCode = 404;
    throw err;
  }
  return course;
}

async function getLesson(id) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      tasks: {
        include: {
          testCases: {
            select: {
              id: true,
              input: true,
              expectedOutput: true,
              isHidden: true,
            },
          },
        },
      },
      module: {
        select: {
          id: true,
          title: true,
          position: true,
          courseId: true,
        },
      },
    },
  });

  if (!lesson) {
    const err = new Error('Урок не знайдено');
    err.statusCode = 404;
    throw err;
  }

  const nextLessonInfo = await findNextLesson(lesson);

  return {
    ...lesson,
    ...nextLessonInfo,
  };
}

async function findNextLesson(currentLesson) {
  const nextInSameModule = await prisma.lesson.findFirst({
    where: {
      moduleId: currentLesson.module.id,
      position: { gt: currentLesson.position },
    },
    orderBy: { position: 'asc' },
    select: { id: true, title: true },
  });

  if (nextInSameModule) {
    return {
      nextLesson: nextInSameModule,
      nextLessonInNewModule: false,
    };
  }

  const nextModule = await prisma.module.findFirst({
    where: {
      courseId: currentLesson.module.courseId,
      position: { gt: currentLesson.module.position },
    },
    orderBy: { position: 'asc' },
    include: {
      lessons: {
        orderBy: { position: 'asc' },
        take: 1,
        select: { id: true, title: true },
      },
    },
  });

  if (nextModule && nextModule.lessons.length > 0) {
    return {
      nextLesson: nextModule.lessons[0],
      nextLessonInNewModule: true,
      nextModuleTitle: nextModule.title,
    };
  }

  return {
    nextLesson: null,
    nextLessonInNewModule: false,
  };
}

module.exports = { getCourses, getCourse, getLesson };
