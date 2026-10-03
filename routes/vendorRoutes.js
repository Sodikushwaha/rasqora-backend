const vendorsController = require('../controllers/vendorController');
const express = require('express');
const router = express.Router();

router.post('/register', vendorsController.vendorRegister);
router.post('/login', vendorsController.vendorLogin);
router.get('/vendors', vendorsController.getAllVendors);
router.get('/vendors/:vendorId', vendorsController.getVendorById);
module.exports = router;