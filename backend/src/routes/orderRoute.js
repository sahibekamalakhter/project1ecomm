import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder } from "../controllers/createOrder.js";
import { getMyOrders } from "../controllers/getMyOrders.js";

const orderRoute = express.Router();

orderRoute.post("/create", authMiddleware, createOrder);
orderRoute.get("/myOrders", authMiddleware, getMyOrders);

export default orderRoute;
