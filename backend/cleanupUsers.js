import mongoose from "mongoose";
import dotenv from "dotenv";
import userSchema from "./src/models/userSchema.js";
import cartSchema from "./src/models/cartSchema.js";
import orderSchema from "./src/models/orderSchema.js";
import productSchema from "./src/models/productSchema.js";

dotenv.config();

const url = process.env.mongoUrl;

async function cleanupUsers() {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");

    const userCount = await userSchema.countDocuments();
    const cartCount = await cartSchema.countDocuments();
    const orderCount = await orderSchema.countDocuments();
    const productCount = await productSchema.countDocuments();

    console.log("Before cleanup:");
    console.log("Users:", userCount);
    console.log("Carts:", cartCount);
    console.log("Orders:", orderCount);
    console.log("Products:", productCount);

    const deletedCarts = await cartSchema.deleteMany({});
    console.log("Deleted carts:", deletedCarts.deletedCount);

    const deletedOrders = await orderSchema.deleteMany({});
    console.log("Deleted orders:", deletedOrders.deletedCount);

    const deletedUsers = await userSchema.deleteMany({});
    console.log("Deleted users:", deletedUsers.deletedCount);

    const remainingUsers = await userSchema.countDocuments();
    const remainingCarts = await cartSchema.countDocuments();
    const remainingOrders = await orderSchema.countDocuments();
    const remainingProducts = await productSchema.countDocuments();

    console.log("After cleanup:");
    console.log("Users:", remainingUsers);
    console.log("Carts:", remainingCarts);
    console.log("Orders:", remainingOrders);
    console.log("Products:", remainingProducts);

    if (remainingUsers === 0) {
      console.log("User collection is empty. Cleanup completed successfully.");
    } else {
      console.log("Warning: User collection is not empty.");
    }

    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.log("Cleanup error:", error.message);
    process.exit(1);
  }
}

cleanupUsers();
