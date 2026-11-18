import cartSchema from "../models/cartSchema.js";

export const removeFromCart = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can access cart",
      });
    }

    const userId = req.user._id;
    const productId = req.params.id;

    const cart = await cartSchema.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const newItems = [];
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i].productId.toString() !== productId) {
        newItems.push(cart.items[i]);
      }
    }

    cart.items = newItems;
    await cart.save();

    const updatedCart = await cartSchema
      .findOne({ userId: userId })
      .populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: updatedCart.items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
