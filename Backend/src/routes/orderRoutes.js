// routes/orderRoutes.js

const express = require('express');
const { checkout, getOrders } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/checkout', authMiddleware, checkout);
router.get('/', authMiddleware, getOrders);

module.exports = router;