// models/productModel.js

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    image: String,
    stock: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('products', ProductSchema);
