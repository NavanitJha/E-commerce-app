// controllers/productController.js

const Product = require('../models/productModel');

// Get product list with optional filtering and sorting
exports.getProducts = async (req, res) => {
    try {
        let filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }

        const sortOrder = req.query.sort === 'desc' ? -1 : 1;

        const products = await Product.find(filter).sort({ price: sortOrder });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
