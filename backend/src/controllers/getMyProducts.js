import productSchema from "../models/productSchema.js";

export const getMyProducts = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can access this page",
      });
    }

    const data = await productSchema.find({ sellerId: req.user._id });

    return res.status(200).json({
      success: true,
      message: "Seller products fetched successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
