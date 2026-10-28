

const Firm = require("../models/firm.js");
const Vendor = require("../models/vendor.js");
const multer = require("multer");
const path = require("path");
const uploadDir = require("../config/uploads");

// Multer storage configuration
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

const upload = multer({ storage });

// Add Firm
const addFirm = async (req, res) => {
  try {
    const {
      firmName,
      area,
      category,
      region,
      offer,
    } = req.body;

    // Validate vendor ID
    if (!req.vendorId) {
      return res.status(401).json({
        message: "Vendor authentication required",
      });
    }

    // Validate required fields
    if (!firmName || !area || !category || !region) {
      return res.status(400).json({
        message: "Please provide firmName, area, category and region",
      });
    }

    // Find logged-in vendor
    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    // Safely handle missing firm array
    if (!Array.isArray(vendor.firm)) {
      vendor.firm = [];
    }

    // Allow only one firm per vendor
    if (vendor.firm.length > 0) {
      return res.status(400).json({
        message: "Vendor can have only one firm",
        firmId: vendor.firm[0].toString(),
      });
    }

    // Create firm
    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image: req.file ? req.file.filename : undefined,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();

    // Link firm to vendor
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    console.log("Firm created successfully:", {
      vendorId: vendor._id.toString(),
      firmId: savedFirm._id.toString(),
    });

    return res.status(201).json({
      message: "Firm added successfully",
      firmId: savedFirm._id.toString(),
      firmName: savedFirm.firmName,
    });
  } catch (error) {
    console.error("Add Firm Error:", error.stack || error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get all firms
const getAllFirms = async (req, res) => {
  try {
    const firms = await Firm.find().populate("products");

    return res.status(200).json({ firms });
  } catch (error) {
    console.error("Get All Firms Error:", error);

    return res.status(500).json({
      message: "Failed to retrieve firms",
    });
  }
};

// Get firms by vendor
const getFirmsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const firms = await Firm.find({
      vendor: vendor._id,
    }).populate("products");

    return res.status(200).json({ firms });
  } catch (error) {
    console.error("Get Firms By Vendor Error:", error);

    return res.status(500).json({
      message: "Failed to retrieve firms",
    });
  }
};

const updateFirmImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    const firm = await Firm.findOne({
      _id: req.params.firmId,
      vendor: req.vendorId,
    });

    if (!firm) {
      return res.status(404).json({
        message: "Firm not found",
      });
    }

    firm.image = req.file.filename;
    await firm.save();

    return res.status(200).json({
      message: "Firm image updated successfully",
      image: firm.image,
    });
  } catch (error) {
    console.error("Update Firm Image Error:", error);

    return res.status(500).json({
      message: "Failed to update firm image",
    });
  }
};

// Delete firm
const deleteFirmById = async (req, res) => {
  try {
    const { firmId } = req.params;

    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({
        message: "Firm not found",
      });
    }

    // Remove firm reference from its vendor
    if (firm.vendor) {
      await Vendor.findByIdAndUpdate(firm.vendor, {
        $pull: { firm: firm._id },
      });
    }

    await Firm.findByIdAndDelete(firmId);

    return res.status(200).json({
      message: "Firm deleted successfully",
    });
  } catch (error) {
    console.error("Delete Firm Error:", error);

    return res.status(500).json({
      message: "Failed to delete firm",
    });
  }
};

module.exports = {
  addFirm: [upload.single("image"), addFirm],
  updateFirmImage: [upload.single("image"), updateFirmImage],
  getAllFirms,
  getFirmsByVendor,
  deleteFirmById,
};
