import express from "express";
import cors from "cors";
import path from "path";

import productRoutes from "./routes/product.routes.js";
// import authRoutes from "./src/routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/products", productRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);

// Home
app.get("/", (req, res) => {
  res.send("BookStore API Running...");
});

// MoMo return URL
app.get("/payment-return", (req, res) => {
  const orderId = req.query.orderId;
  const realId = orderId.split("_")[0];
  res.redirect(`http://localhost:4200/orders/${realId}`);
});

export default app;
