import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import { connectDB } from "./src/config/dbConnection.js";
import authRoute from "./src/routes/authRoute.js";
import productRoute from "./src/routes/productRoute.js";
import cartRoute from "./src/routes/cartRoute.js";
import orderRoute from "./src/routes/orderRoute.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

connectDB();
app.listen(PORT, () => {
  console.log(`Server Running at port ${PORT}`);
});
