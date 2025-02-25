const request = require('supertest');
const app = require('../src/app');
const Cart = require('../src/models/cartModel');
const Order = require('../src/models/orderModel');
const User = require('../src/models/userModel');
const jwt = require('jsonwebtoken');

// Mocks
jest.mock('../src/models/cartModel');
jest.mock('../src/models/orderModel');
jest.mock('../src/models/userModel', () => ({
  findById: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ id: 'user123' }), // Mock JWT verify
}));

// Middleware mock to attach user info
jest.mock('../src/middlewares/authMiddleware', () => {
  const mongoose = require('mongoose');
  return (req, res, next) => {
    req.user = { id: new mongoose.Types.ObjectId().toString() };
    next();
  };
});

describe('Order Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should create an order and clear the cart', async () => {
    // Mock the cart data
    const mockCart = {
      userId: 'user123',
      items: [
        { productId: '123', quantity: 1, price: 100 },
        { productId: '456', quantity: 2, price: 200 },
      ],
      totalAmount: 500,
      save: jest.fn().mockResolvedValue(true),
    };

    // Mock Cart findOne method to return mock cart
    Cart.findOne.mockResolvedValue(mockCart);
    Cart.deleteOne.mockResolvedValue({});

    // Mock Order save method
    const mockOrder = {
      userId: 'user123',
      totalAmount: 500,
      address: '123 Main St',
      items: mockCart.items,
      save: jest.fn().mockResolvedValue(true),
    };

    Order.prototype.save = jest.fn().mockResolvedValue(mockOrder); 

    // Make the request
    const res = await request(app)
      .post('/api/order/checkout')
      .send({ address: '123 Main St' });

    // Assertions
    expect(res.status).toBe(201);
    expect(Cart.deleteOne).toHaveBeenCalledWith({ userId: 'user123' }); // Ensure cart is cleared
    expect(Order.prototype.save).toHaveBeenCalledTimes(1); // Ensure order is saved
    expect(res.body).toHaveProperty('userId', 'user123');
    expect(res.body).toHaveProperty('totalAmount', 500);
  });
});
