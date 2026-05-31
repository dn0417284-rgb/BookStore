import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
export default app;
