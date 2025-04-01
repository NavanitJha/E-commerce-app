// tests/orderController.test.js

const request = require('supertest');
const app = require('../src/app');
const Cart = require('../src/models/cartModel');
const Order = require('../src/models/orderModel');
const User = require('../src/models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

jest.mock('../src/models/cartModel');
jest.mock('../src/models/orderModel');
jest.mock('../src/models/userModel', () => ({
  findById: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));

jest.mock('../src/middlewares/authMiddleware', () => {
  const mongoose = require('mongoose');
  return (req, res, next) => {
    req.user = { id: new mongoose.Types.ObjectId().toString() };
    next();
  };
});

describe('Test cases for order creation and checkout', () => {
  let token;
  let userId;

  beforeEach(() => {
    jest.clearAllMocks();
    userId = new mongoose.Types.ObjectId().toString();
    token = `Bearer mockToken`;
    jwt.verify.mockReturnValue({ id: userId });
    User.findById.mockResolvedValue({ _id: userId, name: "Test User" });
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should create an order and clear the cart', async () => {
    const mockCart = {
      userId: 'user123',
      items: [
        { productId: { price: 100 }, quantity: 1 },
        { productId: { price: 200 }, quantity: 2 },
      ],
      save: jest.fn().mockResolvedValue(true),
    };
  
    // Mock Cart.findOne().populate()
    Cart.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockCart),
    }));
  
    const mockOrder = {
      userId: 'user123',
      totalAmount: 500,
      address: '123 Main St',
      items: mockCart.items,
      status: 'pending',
      save: jest.fn().mockResolvedValue(true),
    };
  
    Order.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockOrder),
    }));
  
    const res = await request(app)
        .post('/api/order/checkout')
        .set('Authorization', token)
        .send({ address: '123 Main St' });
  
    expect(res.status).toBe(201);
    expect(Cart.deleteOne).toHaveBeenCalled();
  });
  
  it('should return 400 if the cart is empty', async () => {
    Cart.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(null),
    }));

    const res = await request(app)
      .post('/api/order/checkout')
      .set('Authorization', token)
      .send({ address: '123 Main St' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cart is empty');
  });

 it('should return 500 if there is a server error', async () => { 
    Cart.findOne.mockImplementation(() => {
      throw new Error('Database error');
    });

    const res = await request(app)
      .post('/api/order/checkout')
      .set('Authorization', token)
      .send({ address: '123 Main St' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Database error');
  });
});

describe('Test cases for getting all orders for a user', () => {

  let token;
  let userId;

  beforeEach(() => {
    jest.clearAllMocks();
    userId = new mongoose.Types.ObjectId().toString();
    token = `Bearer mockToken`;
    jwt.verify.mockReturnValue({ id: userId });
    User.findById.mockResolvedValue({ _id: userId, name: "Test User" });
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return all orders for a user', async () => {
    const mockOrders = [
      {_id: "67bea16f4ddea0bbf7699989", 
        address: "123 Main St", 
        items: [{"productId": {"name": "Product 1", "price": 100}, "quantity": 2}], 
        totalAmount: 200, 
        userId
      }, 
      {_id: "67bea16f4ddea0bbf769998a", 
        address: "456 Another St", 
        items: [{"productId": {"name": "Product 2", "price": 150}, "quantity": 1}], 
        totalAmount: 150, 
        userId
      },
    ];
  
    Order.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockOrders),
    }));
  
    const res = await request(app)
      .get('/api/order')
      .set('Authorization', token);
  
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOrders);
  });
  
  it('should return 404 if no orders are found', async () => {
    Order.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue([]),
    }));
  
    const res = await request(app)
      .get('/api/order')
      .set('Authorization', token);
  
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No orders found');
  });
  
  it('should return 500 if there is a server error', async () => {
    Order.find.mockImplementation(() => {
      throw new Error('Database error');
    });
  
    const res = await request(app)
      .get('/api/order')
      .set('Authorization', token);
  
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Database error');
  });

});