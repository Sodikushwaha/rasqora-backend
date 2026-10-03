
const Firm = require("../models/firm.js");
const Vendor = require("../models/vendor.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


// uploads folder ka exact path
const uploadDir = path.join(__dirname, "../uploads");
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


const addFirm = async (req, res) => {
  try {

    const {
      firmName,
      area,
      category,
      region,
      offer
    } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      return res.status(404).json({
        error: "Vendor not found"
      });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id
    });

    // await firm.save();
    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    return res.status(200).json({
      message: "Firm added successfully",
      firm: savedFirm
    });

  } catch (error) {

    console.error("Add Firm Error:", error);

    return res.status(500).json({
      error: error.message
    });
  }
};


const getAllFirms = async (req, res) => {
  try {
    const firms = await Firm.find().populate('products');
    res.status(200).json({ firms });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve firms',
      details: error.message

    });
};
}

const getFirmsByVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    const firms = await Firm.find({
      vendor: vendorId
    }).populate('products');

    res.status(200).json({ firms });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve firms',
      details: error.message
    });
  }
};


// Delete Firm
const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({
        error: 'Firm not found'
      });
    }

    await Firm.findByIdAndDelete(firmId);

    return res.status(200).json({
      message: 'Firm deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete firm',
      details: error.message
    });
  }
};


module.exports = { addFirm: [
    upload.single("image"),
    addFirm
  ],

  getAllFirms: getAllFirms,
  getFirmsByVendor: getFirmsByVendor,

  deleteFirmById: deleteFirmById
};