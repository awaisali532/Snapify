const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/user-routes");
const accountRoutes = require("./routes/account-routes");
const uploadRoutes = require("./routes/upload-routes");
const orderRoutes = require("./routes/order-routes");
const reviewRoutes = require("./routes/review-routes");
const scorePackageRoutes = require("./routes/score-package-routes");
const paymentMethodRoutes = require("./routes/payment-method-routes");

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/score-packages", scorePackageRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);

app.get("/", (req, res) => {
  res.send("Snapify Backend is Running Perfectly! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
