// controllers/cartController.js

const Cart = require('../models/cartModel');

// Add product to cart
const addToCart = async (req, res) => {
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
        res.status(200).json(cart); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Remove product from cart
const removeFromCart = async (req, res) => {
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
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        // if (!cart) {
        //     return res.status(404).json({ message: 'Cart is empty' });
        // }

        if (!cart) {
            return res.status(200).json([]); // Return 200 OK with an empty array
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Decrease product quantity in cart
const decreaseQuantity = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body; 
        const userId = req.user.id; 

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        if (cart.items[productIndex].quantity > quantity) {
            cart.items[productIndex].quantity -= quantity;
        } else {
            cart.items.splice(productIndex, 1);
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear all items from cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({ message: 'Cart is already empty' });
        }

        await Cart.deleteOne({ userId });

        res.status(200).json({ message: 'Cart cleared successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { addToCart, removeFromCart, getCart, decreaseQuantity, clearCart };