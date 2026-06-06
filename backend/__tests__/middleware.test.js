jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('../src/middleware/authMiddleware');
const errorHandler = require('../src/middleware/errorHandler');

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  test('authenticate attaches user from a valid bearer token', () => {
    const req = { headers: { authorization: 'Bearer good-token' } };
    const res = createResponse();
    const next = jest.fn();
    jwt.verify.mockReturnValue({ userId: 4, role: 'ADMIN' });

    authenticate(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('good-token', 'test-secret');
    expect(req.user).toEqual({ id: 4, role: 'ADMIN' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('authenticate rejects requests without bearer token', () => {
    const req = { headers: {} };
    const res = createResponse();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });

  test('authenticate rejects invalid tokens', () => {
    const req = { headers: { authorization: 'Bearer bad-token' } };
    const res = createResponse();
    const next = jest.fn();
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid');
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('authorize allows users with permitted role', () => {
    const req = { user: { role: 'ADMIN' } };
    const res = createResponse();
    const next = jest.fn();

    authorize('ADMIN')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('authorize rejects users without permitted role', () => {
    const req = { user: { role: 'STUDENT' } };
    const res = createResponse();
    const next = jest.fn();

    authorize('ADMIN')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('errorHandler', () => {
  let originalConsoleError;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test('returns explicit status and message for known errors', () => {
    const res = createResponse();
    const err = new Error('Validation failed');
    err.statusCode = 400;

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Validation failed' });
  });

  test('hides message for unexpected errors', () => {
    const res = createResponse();

    errorHandler(new Error('Database exploded'), {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
  });
});
