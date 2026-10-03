const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const multer = require('multer');
const Firm = require('../models/firm');

// uploads folder ka exact path
const uploadDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});


const upload = multer({ storage: storage });

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


// const getProductsByFirm = async (req, res) => {
//     try {
//         const firmId = req.params?.firmId;

//         if (!firmId) {
//             return res.status(400).json({
//                 error: "Firm ID is required"
//             });
//         }

// const restaurantName = firm.firmName; // Get the firm name from the firm object
// const products =  await Product.find ({firm: firmId});
// res.status(200).json({ restaurantName, products });




//         const firm = await Firm.findById(firmId).populate("products");

//         if (!firm) {
//             return res.status(404).json({
//                 error: "Firm not found"
//             });
//         }

//         res.status(200).json({
//             products: firm.products
//         });

//     } catch (error) {
//         res.status(500).json({
//             error: "Failed to retrieve products",
//             details: error.message
//         });
//     }
// };

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




module.exports ={ addProduct:[upload.single('image') , addProduct]  , getProductsByFirm  , getAllProducts , deleteProduct , updateProduct };