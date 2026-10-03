// const dotenv = require("dotenv");
// const express = require("express");
// const cors = require("cors");
// const vendorRoutes = require("./routes/vendorRoutes");
// const connectDB = require("./config/db");
// const bodyParser = require("body-parser");
// const firmRoutes = require("./routes/firmRoutes");
// const productRoutes = require("./routes/productRoutes");
// const path = require("path");

// const app = express();
// dotenv.config();
// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'uploads')));


// const PORT = process.env.PORT || 8000;

// connectDB();
// app.use(bodyParser.json());
// app.use("/vendors", vendorRoutes);
// app.use("/firms", firmRoutes);
// app.use("/products", productRoutes);

// app.get("/", (req, res) => {
//   res.json({
//     message: "Welcome to RasQora API"
//   });
// });


// app.listen(PORT, () => {
//   console.log(`RasQora server running on port ${PORT}`);
// });



const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const vendorRoutes = require("./routes/vendorRoutes");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 8000;

connectDB();

app.use(bodyParser.json());
app.use("/vendors", vendorRoutes);
app.use("/firms", firmRoutes);
app.use("/products", productRoutes);

// app.get("/", (req, res) => {
//   res.json({
//     message: "<h1>Welcome to RasQora API</h1>"
//   });
// });

app.get("/", (req, res) => {
  res.send("<h1>Welcome to RasQora Restaurant</h1>");
});

app.listen(PORT, () => {
  console.log(`RasQora server running on port ${PORT}`);
});