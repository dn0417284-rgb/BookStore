import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use('/api/auth', authRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});