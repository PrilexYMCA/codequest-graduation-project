const authService = require('../services/authService');
const { isValidEmail, isValidPassword, isValidName } = require('../utils/validation');

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Некоректний формат електронної пошти' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Пароль має містити щонайменше 8 символів' });
    }
    if (!isValidName(name)) {
      return res.status(400).json({ error: "Ім'я має містити щонайменше 2 символи" });
    }

    const result = await authService.register({ email, password, name });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Пошта та пароль обовʼязкові' });
    }

    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
