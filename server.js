const express = require("express");
const dotenv = require("dotenv");
const connectMongoDB = require("./configuration/database");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// This is to connect to the Database
connectMongoDB();

// This is to add the envirnment variables
dotenv.config();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/category", require("./routes/categoryRoute"));
app.use("/api/v1/product", require("./routes/productRoute"));
app.use("/api/v1/order", require("./routes/orderRoute"));
app.use("/api/v1/user", require("./routes/userRoute"));

app.get("/", (req, res) => {
  res.send("Hello this is my ecommerce backend");
});

// This is to Listen the App on the port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
