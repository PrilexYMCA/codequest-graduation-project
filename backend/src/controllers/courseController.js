const courseService = require('../services/courseService');

async function listCourses(req, res, next) {
  try {
    const courses = await courseService.getCourses();
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

async function getCourse(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Невірний ідентифікатор курсу' });
    }
    const course = await courseService.getCourse(id);
    res.json(course);
  } catch (err) {
    next(err);
  }
}

async function getLesson(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Невірний ідентифікатор уроку' });
    }
    const lesson = await courseService.getLesson(id);
    res.json(lesson);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCourses, getCourse, getLesson };
