// tests/productController.test.js

const request = require('supertest');
const Product = require('../src/models/productModel');
const app = require('../src/app');

jest.mock('../src/models/productModel');

describe('Product Controller - GET /api/products', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it('should return a list of products', async () => {
        const mockProducts = [
            { _id: '1', name: 'Product 1', price: 100, category: 'Electronics' },
            { _id: '2', name: 'Product 2', price: 200, category: 'Clothing' },
        ];
        Product.find.mockImplementation(() => ({
            sort: jest.fn().mockResolvedValue(mockProducts),
        }));
        
        const res = await request(app).get('/api/products');
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProducts);
    });

    it('should filter products by category', async () => {
        const mockProducts = [{ _id: '1', name: 'Product 1', price: 100, category: 'Electronics' }];
        Product.find.mockImplementation(() => ({
            sort: jest.fn().mockResolvedValue(mockProducts),
        }));
        

        const res = await request(app).get('/api/products?category=Electronics');
        
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({ category: 'Electronics' });
    });

    it('should sort products by price in ascending order', async () => {
        const mockProducts = [
            { _id: '1', name: 'Product A', price: 100 },
            { _id: '2', name: 'Product B', price: 200 },
        ];
        Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockProducts) });

        const res = await request(app).get('/api/products?sort=asc');
        
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProducts);
    });

    it('should sort products by price in descending order', async () => {
        const mockProducts = [
            { _id: '1', name: 'Product A', price: 200 },
            { _id: '2', name: 'Product B', price: 100 },
        ];
        Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockProducts) });

        const res = await request(app).get('/api/products?sort=desc');
        
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProducts);
    });

    it('should handle server errors', async () => {
        Product.find.mockImplementation(() => ({
            sort: jest.fn().mockRejectedValue(new Error('Database error')),
        }));
        
        const res = await request(app).get('/api/products');
        
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Database error' });
    });
});