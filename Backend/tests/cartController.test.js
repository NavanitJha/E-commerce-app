// tests/cartController.test.js

const request = require('supertest');
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
  const mongoose = require('mongoose'); 
  return (req, res, next) => {
    req.user = { id: new mongoose.Types.ObjectId().toString() };
    next();
  };
});

describe('Test cases for adding products to cart', () => {
  let token;
  let userId;

  beforeEach(() => {
    jest.clearAllMocks();
    userId = new mongoose.Types.ObjectId().toString();
    token = `Bearer mockToken`;
    jwt.verify.mockReturnValue({ id: userId });
    User.findById.mockResolvedValue({ _id: userId, name: "Test User" });
  });

  it('should add product to cart', async () => {
    Cart.findOne.mockResolvedValue(null);

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

  it('should default quantity to 1 when not provided', async () => {
    Cart.findOne.mockResolvedValue(null);
  
    Cart.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ userId, items: [{ productId: '123', quantity: 1 }] }),
      items: [],
    }));
  
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', token)
      .send({ productId: '123' });
  
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

  it('should return 500 if an error occurs while adding to cart', async () => {
    Cart.findOne.mockRejectedValue(new Error('Database error'));

    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', token)
      .send({ productId: '123', quantity: 1 });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Database error');
  });
});

describe('Test cases for removing products from cart', () => {
  let token;
  let userId;

  beforeEach(() => {
    jest.clearAllMocks();
    userId = new mongoose.Types.ObjectId().toString();
    token = `Bearer mockToken`;
    jwt.verify.mockReturnValue({ id: userId });
    User.findById.mockResolvedValue({ _id: userId, name: "Test User" });
  });
    
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
    expect(res.body.items).toHaveLength(0); 
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
      .delete('/api/cart/remove/123')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].productId).toBe('124');
  });

  it('should return 500 if an error occurs while removing from cart', async () => {
    Cart.findOne.mockRejectedValue(new Error('Database error'));

    const res = await request(app)
      .delete('/api/cart/remove/123')
      .set('Authorization', token);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Database error');
  });
});

describe('Test cases for getting user cart', () => {
  let token;
  let userId;

  beforeEach(() => {
    jest.clearAllMocks();
    userId = new mongoose.Types.ObjectId().toString();
    token = `Bearer mockToken`;
    jwt.verify.mockReturnValue({ id: userId });
    User.findById.mockResolvedValue({ _id: userId, name: "Test User" });
  });

  it("should return the user's cart", async () => {
    const mockCart = {
      userId,
      items: [{ productId: { _id: '123', name: 'Test Product' }, quantity: 2 }],
    };

    Cart.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockCart),
    }));

    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].productId._id).toBe('123');
    expect(res.body.items[0].quantity).toBe(2);
  });

  it('should return 404 if cart is empty', async () => {
    Cart.findOne.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(null),
    }));

    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', token);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Cart is empty');
  });

  it('should return 500 if an error occurs while fetching the cart', async () => {
    Cart.findOne.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error('Database error')),
    }));
  
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', token);
  
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Database error');
  });  
});

describe('Test cases for decreasing product quantity in cart', () => {
  let token;
  let userId;

  beforeEach(() => {
    jest.clearAllMocks();
    userId = new mongoose.Types.ObjectId().toString();
    token = `Bearer mockToken`;
    jwt.verify.mockReturnValue({ id: userId });
    User.findById.mockResolvedValue({ _id: userId, name: "Test User" });
  });

  it('should decrease product quantity in cart', async () => {
    const existingCart = {
      userId,
      items: [{ productId: '123', quantity: 5 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockResolvedValue(existingCart);

    const res = await request(app)
      .patch('/api/cart/decrease')
      .set('Authorization', token)
      .send({ productId: '123', quantity: 2 });

    expect(res.status).toBe(200);
    expect(existingCart.items[0].quantity).toBe(3);
    expect(res.body.items[0].quantity).toBe(3);
  });

  it('should default quantity to 1 when not provided', async () => {
    const existingCart = {
      userId,
      items: [{ productId: '123', quantity: 5 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockResolvedValue(existingCart);

    const res = await request(app)
      .patch('/api/cart/decrease')
      .set('Authorization', token)
      .send({ productId: '123'});

    expect(res.status).toBe(200);
    expect(existingCart.items[0].quantity).toBe(4);
    expect(res.body.items[0].quantity).toBe(4);
  });

  it('should remove product from cart if quantity becomes zero', async () => {
    const existingCart = {
      userId,
      items: [{ productId: '123', quantity: 2 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockResolvedValue(existingCart);

    const res = await request(app)
      .patch('/api/cart/decrease')
      .set('Authorization', token)
      .send({ productId: '123', quantity: 2 });

    expect(res.status).toBe(200);
    expect(existingCart.items).toHaveLength(0);
  });

  it('should return 404 if cart does not exist', async () => {
    Cart.findOne.mockResolvedValue(null);

    const res = await request(app)
      .patch('/api/cart/decrease')
      .set('Authorization', token)
      .send({ productId: '123', quantity: 1 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Cart not found');
  });

  it('should return 404 if product is not found in cart', async () => {
    const existingCart = {
      userId,
      items: [{ productId: '124', quantity: 2 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockResolvedValue(existingCart);

    const res = await request(app)
      .patch('/api/cart/decrease')
      .set('Authorization', token)
      .send({ productId: '123', quantity: 1 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Product not found in cart');
  });

  it('should return 500 if an error occurs while decreasing quantity', async () => {
    Cart.findOne.mockRejectedValue(new Error('Database error'));

    const res = await request(app)
      .patch('/api/cart/decrease')
      .set('Authorization', token)
      .send({ productId: '123', quantity: 1 });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Database error');
  });
});
