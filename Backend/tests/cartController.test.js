const request = require('supertest');
const express = require('express');
const app = require('../src/app');
const Cart = require('../src/models/cartModel');
const User = require('../src/models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

jest.mock('../src/models/cartModel');
jest.mock('../src/models/userModel', () => ({
  findById: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));

jest.mock('../src/middlewares/authMiddleware', () => {
  const mongoose = require('mongoose'); // Import inside the mock
  return (req, res, next) => {
    req.user = { id: new mongoose.Types.ObjectId().toString() };
    next();
  };
});

// jest.setTimeout(30000); // 30 seconds

describe('Cart Controller test cases', () => {
  let token;
  let userId;

  beforeEach(() => {
    jest.clearAllMocks();
    userId = new mongoose.Types.ObjectId().toString();
    token = `Bearer mockToken`;
    jwt.verify.mockReturnValue({ id: userId });
    User.findById.mockResolvedValue({ _id: userId, name: "Test User" });
  });

  // Test cases for adding products to cart
  describe('POST /api/cart/add', () => {

    it('should add product to cart', async () => {
      // Mock Cart.findOne to return null (cart does not exist)
      Cart.findOne.mockResolvedValue(null);

      // Mock Cart constructor and save method
      Cart.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ userId, items: [{ productId: '123', quantity: 1 }] }),
        items: [],
      }));

      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', token)
        .send({ productId: '123', quantity: 1 });

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].productId).toBe('123');
      expect(res.body.items[0].quantity).toBe(1);
    });

    it('should update quantity if product already exists in cart', async () => {
      const existingCart = {
        userId,
        items: [{ productId: '123', quantity: 1 }],
        save: jest.fn().mockResolvedValue(true),
      };
      Cart.findOne.mockResolvedValue(existingCart);

      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', token)
        .send({ productId: '123', quantity: 2 });

      expect(res.status).toBe(200);
      expect(existingCart.items[0].quantity).toBe(3);
      expect(res.body.items[0].quantity).toBe(3);
    });
  });

  // Test cases for removing products from cart
  describe('DELETE /api/cart/remove/:productId', () => {
    
    it('should remove product from cart', async () => {
      const existingCart = {
        userId,
        items: [{ productId: '123', quantity: 1 }],
        save: jest.fn().mockResolvedValue({ userId, items: [] }),
      };

      Cart.findOne.mockResolvedValue(existingCart);

      const res = await request(app)
        .delete('/api/cart/remove/123')
        .set('Authorization', token);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(0); // Cart should be empty after removal
    });

    it('should return 404 if cart does not exist', async () => {
      Cart.findOne.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/cart/remove/123')
        .set('Authorization', token);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Cart not found');
    });

    it('should return 200 if product is not in cart', async () => {
      const existingCart = {
        userId,
        items: [{ productId: '124', quantity: 1 }],
        save: jest.fn().mockResolvedValue({ userId, items: [{ productId: '124', quantity: 1 }] }),
      };

      Cart.findOne.mockResolvedValue(existingCart);

      const res = await request(app)
        .delete('/api/cart/remove/123') // Product 123 does not exist in cart
        .set('Authorization', token);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].productId).toBe('124');
    });
  });

  
});
