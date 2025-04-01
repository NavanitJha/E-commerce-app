// controllers/orderController.js

const Order = require('../models/orderModel');
const Cart = require('../models/cartModel'); 

// Checkout and create an order
exports.checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address } = req.body;

        // Find the user's cart and populate product details
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

        // Create new order
        const order = new Order({
            userId,
            items: cart.items, 
            totalAmount,
            address
        });

        await order.save();

        // Clear the user's cart after order placement
        await Cart.deleteOne({ userId });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all orders for a user
exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }).populate('items.productId');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

