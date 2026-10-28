const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');
 const router = express.Router();


 router.post('/add-firm', verifyToken, firmController.addFirm);
 router.get('/get-firms', firmController.getAllFirms);
 router.get('/get-firms/:vendorId', firmController.getFirmsByVendor);
 router.put('/update-image/:firmId', verifyToken, firmController.updateFirmImage);
 router.delete('/delete-firm/:firmId', firmController.deleteFirmById);

 module.exports = router;