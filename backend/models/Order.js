const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            size: { type: String },
            img: { type: String }
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentMethod: { type: String, default: 'COD' },
    status: { type: String, default: 'Processing' }, // 'Processing', 'Shipped', 'Delivered'
    trackingId: { type: String, default: 'PENDING' }
    
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);