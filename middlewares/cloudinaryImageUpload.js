const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
});

const cloudinaryImageUpload = (folder) => [
  upload.single("image"),
  (req, res, next) => {
    if (!req.file) {
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
