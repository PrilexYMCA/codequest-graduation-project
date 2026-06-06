function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function isValidName(name) {
  return typeof name === 'string' && name.trim().length >= 2;
}

module.exports = { isValidEmail, isValidPassword, isValidName };
