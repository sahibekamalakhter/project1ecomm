import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import productSchema from "./src/models/productSchema.js";
import userSchema from "./src/models/userSchema.js";

dotenv.config();

const url = process.env.mongoUrl;

async function seedProducts() {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");

    let seedSeller = await userSchema.findOne({ email: "seed.seller@example.com" });

    if (!seedSeller) {
      const hashedPassword = await bcrypt.hash("seedpassword", 10);
      seedSeller = await userSchema.create({
        name: "Seed Seller",
        email: "seed.seller@example.com",
        password: hashedPassword,
        role: "seller",
        isVerified: true,
      });
      console.log("Seed seller created");
    } else {
      console.log("Seed seller already exists");
    }

    const sampleProducts = [
      {
        name: "Notebook",
        description: "Simple ruled notebook for daily notes.",
        price: 50,
        image: "https://picsum.photos/seed/notebook/300/200",
        sellerId: seedSeller._id,
      },
      {
        name: "Pen",
        description: "Blue ball pen for writing.",
        price: 10,
        image: "https://picsum.photos/seed/pen/300/200",
        sellerId: seedSeller._id,
      },
      {
        name: "Backpack",
        description: "Basic backpack for books and laptop.",
        price: 500,
        image: "https://picsum.photos/seed/backpack/300/200",
        sellerId: seedSeller._id,
      },
      {
        name: "Water Bottle",
        description: "Simple water bottle for everyday use.",
        price: 150,
        image: "https://picsum.photos/seed/bottle/300/200",
        sellerId: seedSeller._id,
      },
      {
        name: "Headphones",
        description: "Simple wired headphones for listening to music.",
        price: 300,
        image: "https://picsum.photos/seed/headphones/300/200",
        sellerId: seedSeller._id,
      },
    ];

    for (let i = 0; i < sampleProducts.length; i++) {
      const existingProduct = await productSchema.findOne({
        name: sampleProducts[i].name,
        sellerId: seedSeller._id,
      });

      if (!existingProduct) {
        await productSchema.create(sampleProducts[i]);
        console.log("Added sample product:", sampleProducts[i].name);
      } else {
        console.log("Sample product already exists:", sampleProducts[i].name);
      }
    }

    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.log("Error seeding products:", error.message);
    process.exit(1);
  }
}

seedProducts();
