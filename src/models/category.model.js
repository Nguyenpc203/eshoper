const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: 'presently'
    },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;