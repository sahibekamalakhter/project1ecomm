import express from "express";
import { getAllProducts } from "../controllers/getAllProducts.js";
import { createProduct } from "../controllers/createProduct.js";
import { getMyProducts } from "../controllers/getMyProducts.js";
import { deleteProduct } from "../controllers/deleteProduct.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const productRoute = express.Router();

productRoute.get("/getAll", getAllProducts);
productRoute.post("/create", authMiddleware, upload.single("image"), createProduct);
productRoute.get("/myProducts", authMiddleware, getMyProducts);
productRoute.delete("/delete/:id", authMiddleware, deleteProduct);

export default productRoute;
