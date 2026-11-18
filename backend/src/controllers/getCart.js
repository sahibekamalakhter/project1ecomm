import cartSchema from "../models/cartSchema.js";

export const getCart = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can access cart",
      });
    }

    const userId = req.user._id;

    const cart = await cartSchema
      .findOne({ userId: userId })
      .populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart.items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
