import cartSchema from "../models/cartSchema.js";
import productSchema from "../models/productSchema.js";

export const addToCart = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can add products to cart",
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before adding products to cart",
      });
    }

    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    const product = await productSchema.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await cartSchema.findOne({ userId: userId });

    if (!cart) {
      cart = await cartSchema.create({
        userId: userId,
        items: [{ productId: productId, quantity: 1 }],
      });
    } else {
      let found = false;
      for (let i = 0; i < cart.items.length; i++) {
        if (cart.items[i].productId.toString() === productId) {
          cart.items[i].quantity = cart.items[i].quantity + 1;
          found = true;
        }
      }

      if (!found) {
        cart.items.push({ productId: productId, quantity: 1 });
      }

      await cart.save();
    }

    const updatedCart = await cartSchema
      .findOne({ userId: userId })
      .populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: updatedCart.items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
