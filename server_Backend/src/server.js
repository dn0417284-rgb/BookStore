import dotenv from "dotenv";
dotenv.config();
import "./config/db.js"; // kết nối DB
import app from "./app.js"; // import app đã cấu hình

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
