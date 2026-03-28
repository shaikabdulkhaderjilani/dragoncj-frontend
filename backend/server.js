const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); 
const User = require('./models/User'); 
const Contact = require('./models/Contact'); 
const Order = require('./models/Order'); 
const Product = require('./models/Product'); 
const nodemailer = require('nodemailer'); 

// Config
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("❌ ERROR: MONGO_URI not found in .env file!");
}

mongoose.connect(uri)
    .then(() => console.log("🔥 MongoDB Connected Successfully... 🐉"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ==========================================
// 🔥 NEW: OTP MODEL (Auto deletes in 5 mins) 🔥
// ==========================================
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } 
});
const Otp = mongoose.model('Otp', otpSchema);

// ==========================================
// 🔥 PRODUCT & ORDER ROUTES 🔥
// ==========================================
app.get('/api/products/:id', async (req, res, next) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return next(); 
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Server Error fetching single product" });
    }
});

app.patch('/api/orders/status/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = req.body.status || 'Cancelled';
        await order.save();
        res.status(200).json({ message: "Order status updated successfully!", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
});

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// ==========================================
// 🔥 EMAIL DESIGN GENERATOR FUNCTION 🔥
// ==========================================
const generateEmailTemplate = (title, message, otp) => `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #D90429; padding: 25px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 3px; font-weight: bold;">
            DRAGON<span style="color: #000000;">CJ</span>
        </h1>
    </div>
    <div style="padding: 40px 30px; text-align: center;">
        <h2 style="color: #ffffff; margin-top: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">${title}</h2>
        <p style="color: #aaaaaa; font-size: 16px; line-height: 1.5;">${message}</p>
        <div style="margin: 35px 0; padding: 20px; background-color: #111; border: 2px dashed #D90429; border-radius: 8px; display: inline-block;">
            <span style="font-size: 36px; font-weight: bold; color: #D90429; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #aaaaaa; font-size: 14px;">This code will self-destruct in <b style="color: #D90429;">5 minutes</b>.<br/>Do not share this protocol with anyone.</p>
    </div>
    <div style="background-color: #111111; padding: 20px; text-align: center; border-top: 1px solid #333;">
        <p style="color: #666666; font-size: 12px; margin: 0; letter-spacing: 1px;">&copy; ${new Date().getFullYear()} THE DRAGON CLAN. ALL RIGHTS RESERVED.</p>
    </div>
</div>
`;

// ==========================================
// 🔥 AUTHENTICATION (USER) ROUTES 🔥
// ==========================================

// 1. SIGNUP OTP
app.post('/api/auth/signup-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists. Please login." });

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.findOneAndUpdate({ email }, { otp: generatedOtp, createdAt: Date.now() }, { upsert: true });

        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER, to: email,
            subject: `🔥 DragonCJ Signup Verification`,
            html: generateEmailTemplate("Welcome to the Clan!", "You are one step away from joining the ultimate premium apparel vault. Here is your secure verification code.", generatedOtp)
        });

        res.status(200).json({ message: "OTP sent to your email!" });
    } catch (error) { res.status(500).json({ error: "Failed to send OTP" }); }
});

// 2. SIGNUP FINAL
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { fullName, email, password, otp } = req.body;
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) return res.status(400).json({ error: "Invalid or Expired OTP!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();
        await Otp.deleteOne({ _id: validOtp._id }); 

        res.status(201).json({ message: "Account Created Successfully! 🔥" });
    } catch (err) { res.status(500).json({ error: "Server error during signup" }); }
});

// 3. LOGIN OTP
app.post('/api/auth/login-otp', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Wrong password." });

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.findOneAndUpdate({ email }, { otp: generatedOtp, createdAt: Date.now() }, { upsert: true });

        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER, to: email,
            subject: `🔥 DragonCJ Login Security Code`,
            html: generateEmailTemplate("Authentication Required", "A login attempt was made to your Dragon Vault account. Use the secure code below to grant access.", generatedOtp)
        });

        res.status(200).json({ message: "Credentials verified! OTP sent." });
    } catch (error) { res.status(500).json({ error: "Server error" }); }
});

// 4. LOGIN FINAL
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) return res.status(400).json({ error: "Invalid or Expired OTP!" });

        const user = await User.findOne({ email });
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({ message: "Access Granted! 🔥", user: { name: user.fullName, email: user.email } });
    } catch (err) { res.status(500).json({ error: "Server error during login" }); }
});

// 5. 🔥 FORGOT PASSWORD OTP 🔥
app.post('/api/auth/forgot-password-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found! No account exists with this email." });

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.findOneAndUpdate({ email }, { otp: generatedOtp, createdAt: Date.now() }, { upsert: true });

        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER, to: email,
            subject: `🔥 DragonCJ Password Reset`,
            html: generateEmailTemplate("Password Reset Protocol", "We received a request to reset your security key. Enter the code below to authorize the change.", generatedOtp)
        });

        res.status(200).json({ message: "Password reset OTP sent to your email!" });
    } catch (error) { res.status(500).json({ error: "Server error" }); }
});

// 6. 🔥 FORGOT PASSWORD RESET FINAL 🔥
app.post('/api/auth/forgot-password-reset', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) return res.status(400).json({ error: "Invalid or Expired OTP!" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        
        await user.save();
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({ message: "Password successfully updated! 🔥" });
    } catch (err) { res.status(500).json({ error: "Server error during password reset" }); }
});


// ==========================================
// 🔥 CART SYNC ROUTES 🔥
// ==========================================
app.get('/api/cart/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user.cart || []);
    } catch (err) { res.status(500).json({ error: "Failed to fetch cart" }); }
});

app.post('/api/cart/sync', async (req, res) => {
    try {
        const { email, cartItems } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        user.cart = cartItems; 
        await user.save();
        res.status(200).json({ message: "Cart synced with Dragon Vault! 🐉" });
    } catch (err) { res.status(500).json({ error: "Failed to sync cart" }); }
});

// ==========================================
// 🔥 ALL MISSING ROUTES (RESTORED PERFECTLY) 🔥
// ==========================================
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found!" });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect Current Password!" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Server error during password reset" });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { email, items, totalAmount, shippingAddress, paymentMethod } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const newOrder = new Order({ userId: user._id, items, totalAmount, shippingAddress, paymentMethod });
        await newOrder.save();
        res.status(201).json({ message: "Order Placed Successfully! 🔥", orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ error: "Failed to place order" });
    }
});

app.get('/api/orders/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ error: "User not found" });
        const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) { res.status(500).json({ error: "Failed to fetch orders" }); }
});

app.get('/api/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password'); 
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) { res.status(500).json({ error: "Failed to fetch user data" }); }
});

app.post('/api/user/elite', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });
        user.isElite = true;
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        user.eliteValidThru = nextYear;
        await user.save();
        res.status(200).json({ message: "Welcome to the Elite Clan! 💎" });
    } catch (error) { res.status(500).json({ error: "Failed to upgrade to Elite" }); }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        await transporter.sendMail({
            from: process.env.EMAIL_USER, to: process.env.EMAIL_USER, replyTo: email || process.env.EMAIL_USER, 
            subject: `🔥 New Message from ${name}`, text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
        });
        res.status(200).json({ success: true, message: 'Transmission Successful' });
    } catch (error) { res.status(500).json({ success: false, message: 'Transmission Failed' }); }
});

app.delete('/api/user/:email', async (req, res) => {
    try {
        const { email } = req.params;
        await Order.deleteMany({ email: email });
        await Contact.deleteMany({ email: email });
        const result = await User.deleteOne({ email: email });
        if (result.deletedCount === 0) return res.status(404).json({ error: "User not found!" });
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) { res.status(500).json({ error: "Failed to delete user" }); }
});

app.get('/', (req, res) => { res.send("🔥 DragonCJ Server is Running... 🐉"); });
app.use((err, req, res, next) => { res.status(500).send('Something broke!'); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`🚀 Server running on port ${PORT}`); });