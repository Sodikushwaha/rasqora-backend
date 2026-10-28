const express = require('express');
const productController = require('../controllers/productController');
// const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/add-product/:firmId', productController.addProduct);
router.get('/get-products/:firmId', productController.getProductsByFirm);
router.get('/get-all-products', productController.getAllProducts);
router.delete('/delete-product/:productId', productController.deleteProduct);
router.put('/update-product/:productId', productController.updateProduct);

module.exports = router;