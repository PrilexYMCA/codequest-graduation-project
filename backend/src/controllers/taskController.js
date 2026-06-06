const taskService = require('../services/taskService');

async function getTask(req, res, next) {
  try {
    const taskId = parseInt(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ error: 'Невірний ідентифікатор задачі' });
    }

    const task = await taskService.getTask(taskId);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function submitSolution(req, res, next) {
  try {
    const taskId = parseInt(req.params.id);
    const { code, status } = req.body;

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ error: 'Невірний ідентифікатор задачі' });
    }
    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: 'Параметр code обовʼязковий і має бути непорожнім рядком' });
    }
    if (code.length > 50000) {
      return res.status(400).json({ error: 'Розв\u02bcязок перевищує максимально допустимий обсяг' });
    }
    if (!['PASSED', 'FAILED', 'ERROR'].includes(status)) {
      return res.status(400).json({ error: 'Параметр status має бути PASSED, FAILED або ERROR' });
    }

    const result = await taskService.submitSolution(req.user.id, taskId, { code, status });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function getSubmissionHistory(req, res, next) {
  try {
    const taskId = parseInt(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ error: 'Невірний ідентифікатор задачі' });
    }

    const history = await taskService.getSubmissionHistory(req.user.id, taskId);
    res.json(history);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTask, submitSolution, getSubmissionHistory };
