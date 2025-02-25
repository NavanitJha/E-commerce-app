// tests/authController.test.js

const request = require('supertest');
const app = require('../src/app');  
const User = require('../src/models/userModel');
const { generateToken } = require('../src/utils/tokenUtils');

// Mocking
jest.mock('../src/models/userModel');
jest.mock('../src/utils/tokenUtils', () => ({
  generateToken: jest.fn(),
}));


describe('Auth Controller test cases ', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  // registration test cases
  describe('POST /api/auth/register', () => {
    
    it('should register a user successfully', async () => {
      User.findOne.mockResolvedValue(null); // Simulate no existing user
      User.create.mockResolvedValue({ _id: '1', email: 'test@test.com' });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password@123',
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(generateToken).toHaveBeenCalledWith({ _id: '1', email: 'test@test.com' }, '1d');
    });

    it('should return error if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@test.com' });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password@123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('should return error if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('All fields are required');
    });

    it('should return server error on unexpected failure', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });


  // login test cases
  describe('POST /api/auth/login', () => {

    it('should login a user successfully', async () => {
      const mockUser = {
        _id: '1',
        email: 'test@test.com',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('mocked-token'); // Ensure it returns a token

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(generateToken).toHaveBeenCalled();
    });


    it('should return error if credentials are invalid', async () => {
      User.findOne.mockResolvedValue(null); // Simulate user not found

      const res = await request(app).post('/api/auth/login').send({
        email: 'wrong@test.com',
        password: 'password@123',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return error if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('All fields are required');
    });

    it('should return error if password does not match', async () => {
      User.findOne.mockResolvedValue({
        _id: '1',
        email: 'test@test.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@test.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return server error on unexpected failure', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@test.com',
        password: 'password123',
      });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });
});
