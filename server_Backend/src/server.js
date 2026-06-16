import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer.routes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));
app.use(express.json());

app.use("/api/customers", customerRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});