const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // 🔥 Kothaga add chesina fields (Elite & Points) 🔥
    isElite: { type: Boolean, default: false },
    dragonPoints: { type: Number, default: 0 },
    eliteValidThru: { type: Date, default: null },
    cart: { type: Array, default: [] }
    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);