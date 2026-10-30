const path = require("path");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const uploadDir = require("../config/uploads");

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const isLocalUploadMode =
  process.env.NODE_ENV !== "production" && !hasCloudinaryConfig();

const storage = isLocalUploadMode
  ? multer.diskStorage({
      destination: (_req, _file, callback) => callback(null, uploadDir),
      filename: (_req, file, callback) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        callback(null, uniqueName + path.extname(file.originalname));
      },
    })
  : multer.memoryStorage();

const upload = multer({ storage });

const cloudinaryImageUpload = (folder) => [
  upload.single("image"),
  (req, res, next) => {
    if (!req.file) {
      return next();
    }

    if (isLocalUploadMode) {
      req.file.filename = `/uploads/${req.file.filename}`;
      return next();
    }

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
      process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.error("Cloudinary image upload is not configured.");
      return res.status(503).json({
        message: "Image storage is not configured on the server.",
      });
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary image upload failed:", error.message);
          return res.status(502).json({
            message: "Image upload failed. Please try again.",
          });
        }

        if (!result?.secure_url) {
          console.error("Cloudinary upload returned no secure image URL.");
          return res.status(502).json({
            message: "Image upload failed. Please try again.",
          });
        }

        req.file.filename = result.secure_url;
        req.file.public_id = result.public_id;
        next();
      }
    );

    stream.end(req.file.buffer);
  },
];

module.exports = cloudinaryImageUpload;
