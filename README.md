# Backend uploads

Uploaded firm and product images use the directory configured by `UPLOADS_DIR`.
If it is not set, the backend uses `backend/uploads` for local development.

For the Render backend service, attach a persistent disk mounted at
`/var/data`, set the `UPLOADS_DIR` environment variable to
`/var/data/uploads`, and redeploy. The backend serves images at
`/uploads/<filename>`.

Images that were already lost from Render's temporary filesystem cannot be
restored from their database filenames. Upload those images again after the
persistent disk is mounted. A logged-in vendor can replace their firm image
from the dashboard's **Replace Firm Image** form after the disk is configured.
