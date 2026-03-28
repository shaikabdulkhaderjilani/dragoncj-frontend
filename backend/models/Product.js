const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    img: { type: String, required: true },
    isHot: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    description: { type: String }
});

module.exports = mongoose.model('Product', productSchema);