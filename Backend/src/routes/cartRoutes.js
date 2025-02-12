// routes/cartRoutes.js

const express = require('express');
const { addToCart, removeFromCart, getCart } = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addToCart);
router.delete('/remove/:productId', authMiddleware, removeFromCart);
router.get('/', authMiddleware, getCart);

module.exports = router;

