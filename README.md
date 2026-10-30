# Image uploads

New firm and product image uploads are stored in Cloudinary. Configure these
backend environment variables locally and on Render:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The backend saves each uploaded image's secure Cloudinary URL in MongoDB.
Existing records that contain only a filename continue to resolve through the
legacy `/uploads/<filename>` endpoint; images missing from that local folder
must be uploaded again to Cloudinary.

The local `backend/uploads` folder remains available for legacy images and
local development. New uploads no longer depend on Render's temporary disk.
