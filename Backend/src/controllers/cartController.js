// controllers/cartController.js

const Cart = require('../models/cartModel');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body; // Ensure default quantity
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] }); 
        }

        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (productIndex > -1) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart); // Explicit success response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;  // Use params instead of body
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
