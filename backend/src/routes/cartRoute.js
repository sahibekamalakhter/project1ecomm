import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getCart } from "../controllers/getCart.js";
import { addToCart } from "../controllers/addToCart.js";
import { removeFromCart } from "../controllers/removeFromCart.js";

const cartRoute = express.Router();

cartRoute.get("/get", authMiddleware, getCart);
cartRoute.post("/add", authMiddleware, addToCart);
cartRoute.delete("/remove/:id", authMiddleware, removeFromCart);

export default cartRoute;
