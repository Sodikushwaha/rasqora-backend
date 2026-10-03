// const Vendor = require('../models/vendor.js');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();
// const secretKey = process.env.JWT_SECRET;

// const verifyToken = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     try {
        
//         const decoded = jwt.verify(token, secretKey);
//         const vendor = await Vendor.findById(decoded.vendorId);

//         if (!vendor) {
//             return res.status(404).json({ message: 'Vendor not found.' });
//         }
//         req.vendorId = vendor._id;
//         next();
//     } catch (error) {
//         return res.status(400).json({ message: 'Invalid token.' });
//         console.error('Error verifying token:', error);
//     }
// };
// module.exports = verifyToken;


const Vendor = require("../models/vendor.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    try {

        // Authorization header se token
        let token = req.headers.authorization?.split(" ")[1];

        // Agar Authorization nahi hai to token header bhi check karega
        if (!token) {
            token = req.headers.token;
        }

        // Token nahi mila
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // JWT secret check
        if (!secretKey) {
            return res.status(500).json({
                message: "JWT_SECRET is not configured."
            });
        }

        // Token verify
        const decoded = jwt.verify(token, secretKey);

        // Vendor find
        const vendor = await Vendor.findById(decoded.vendorId);

        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found."
            });
        }

        // Vendor ID request me store
        req.vendorId = vendor._id;

        // Next controller
        next();

    } catch (error) {

        console.error("Token verification error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = verifyToken;