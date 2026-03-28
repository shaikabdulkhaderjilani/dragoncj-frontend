const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. GET ALL PRODUCTS (Front-end ki data pampadaniki)
// URL: GET http://localhost:5000/api/products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. ADD PRODUCT (Kotha data insert cheyadaniki)
// URL: POST http://localhost:5000/api/products
router.post('/add', async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json({ message: "Product Added Successfully! 🔥", product: newProduct });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. 🔥 UPDATE PRODUCT (Unna data ni marchadaniki)
// URL: PUT http://localhost:5000/api/products/id_number_ikkada_ivvali
router.put('/:id', async (req, res) => {
    try {
        // { new: true } pedithe, update ayina kotha data ni return chesthundi
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found bro!" });
        }
        res.json({ message: "Product Updated Successfully! ✏️", product: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. DELETE ALL PRODUCTS (Motham Lepeyadaniki)
// URL: DELETE http://localhost:5000/api/products/deleteAll
router.delete('/deleteAll', async (req, res) => {
    try {
        await Product.deleteMany({}); 
        res.json({ message: "All Data Cleared! 🧹 Database is empty now." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. DELETE SINGLE PRODUCT (Okkati matrame lepeyadaniki)
// URL: DELETE http://localhost:5000/api/products/id_number_ikkada_ivvali
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product Deleted Successfully! 🗑️" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// File ki okkasaare export undali
module.exports = router;