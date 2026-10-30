const Product = require('../models/product');
const Firm = require('../models/firm');
const cloudinaryImageUpload = require('../middlewares/cloudinaryImageUpload');

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params?.firmId;

        if (!firmId) {
            return res.status(400).json({ error: 'Firm ID is required' });
        }

        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: 'Firm not found' });
        }

        firm.category = firm.category.map(value => value.trim().toLowerCase());
        firm.region = firm.region.map(value => value.trim().toLowerCase());

        const product = new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm: firm._id
        });

        const savedProduct = await product.save();


        if (!firm.products.includes(savedProduct._id)) {
            firm.products.push(savedProduct._id);
            await firm.save();
        }

        res.status(201).json({ message: 'Product added successfully', product: savedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product', details: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products', details: error.message });
    }
};



const getProductsByFirm = async (req, res) => {
    try {
        const firmId = req.params?.firmId;

        if (!firmId) {
            return res.status(400).json({
                error: "Firm ID is required"
            });
        }

        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({
                error: "Firm not found"
            });
        }

        const restaurantName = firm.firmName;

        const products = await Product.find({
            firm: firmId
        });

        res.status(200).json({
            restaurantName,
            products
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve products",
            details: error.message
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const productId = req.params?.productId;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product', details: error.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const productId = req.params?.productId;

        const {
            productName,
            price,
            category,
            bestSeller,
            description
        } = req.body;

        if (!productId) {
            return res.status(400).json({
                error: "Product ID is required"
            });
        }

        const updatedData = {
            productName,
            price,
            category,
            bestSeller,
            description
        };

        // Agar new image upload hui hai
        if (req.file) {
            updatedData.image = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updatedData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to update product",
            details: error.message
        });
    }
};




module.exports = {
    addProduct: [...cloudinaryImageUpload('rasqora/products'), addProduct],
    getProductsByFirm,
    getAllProducts,
    deleteProduct,
    updateProduct: [
        ...cloudinaryImageUpload('rasqora/products'),
        updateProduct
    ]
};