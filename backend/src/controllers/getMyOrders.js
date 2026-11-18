import orderSchema from "../models/orderSchema.js";

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await orderSchema.find({ userId: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
