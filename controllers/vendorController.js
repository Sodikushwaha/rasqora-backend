
const vendor = require('../models/vendor.js');
const Firm = require('../models/firm.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.JWT_SECRET;

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const vendorEmail = await vendor.findOne({ email });

        if (vendorEmail) {
            return res.status(400).json({
                message: 'Vendor already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();

        console.log('Vendor registered successfully');

        res.status(201).json({
            message: 'Vendor registered successfully'
        });

    } catch (error) {
        console.error('Error registering vendor:', error);

        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendorData = await vendor.findOne({ email });

        if (!vendorData) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            vendorData.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Logged-in vendor ki actual ID
        const vendorId = vendorData._id;
        const firm = await Firm.findOne({ vendor: vendorId }).select('_id firmName');
        const linkedFirm = firm || vendorData.firm?.[0];

        const token = jwt.sign(
            { vendorId: vendorId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Vendor logged in successfully',
            token,
            vendorId,
            firmId: linkedFirm?._id || null,
            firmName: linkedFirm?.firmName || null
        });

        console.log('Logged-in Vendor ID:', vendorId);

    } catch (error) {
        console.error('Error logging in vendor:', error);

        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};




const  getAllVendors = async (req, res) => {
    try {

        const vendors = await vendor.find().populate('firm');
        res.status(200).json({ vendors });
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getVendorById = async (req, res) => {
    const { vendorId } = req.params;
    try {
        const vendorData = await vendor.findById(vendorId).populate('firm');

        if (!vendorData) {
            return res.status(404).json({
                message: 'Vendor not found'
            });
        }
        // const vendorFirmId = vendorData.firm[0]._id
        const vendorFirmId = vendorData.firm?.[0]?._id || null;

        res.status(200).json({ vendor: vendorData , vendorFirmId});
        // console.log(vendorData , vendorFirmId);
    } catch (error) {
        console.error('Error fetching vendor:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    vendorRegister,
    vendorLogin,
    getAllVendors,
    getVendorById
};