
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const vendorRoutes = require("./routes/vendorRoutes");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadDir = require("./config/uploads");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));
// app.use(express.static(uploadDir));



app.get("/check-image/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const imagePath = path.join(uploadDir, filename);

  res.json({
    uploadDir: uploadDir,
    folderExists: fs.existsSync(uploadDir),
    imageExists: fs.existsSync(imagePath),
    filename: filename,
    sampleFiles: fs.existsSync(uploadDir)
      ? fs.readdirSync(uploadDir).slice(0, 10)
      : [],
  });
});

const PORT = process.env.PORT || 8000;

connectDB();

app.use(bodyParser.json());
app.use("/vendors", vendorRoutes);
app.use("/firms", firmRoutes);
app.use("/products", productRoutes);



app.get("/", (req, res) => {
  res.send("<h5>Welcome to RasQora Restaurant mere website hai ye mai khud bana rhi hu</h5>");
});

app.listen(PORT, () => {
  console.log(`RasQora server running on port ${PORT}`);
});