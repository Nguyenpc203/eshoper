const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    reviews: {
        type: Array,
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    size: {
        type: Array,
        default: []
    },
    count_sold: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    created_by: {
        type: String,
        required: true
    },
    updated_by: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    view: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
