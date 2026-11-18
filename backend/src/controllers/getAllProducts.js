import productSchema from "../models/productSchema.js";

export const getAllProducts = async (req, res) => {
  try {
    const data = await productSchema.find({});
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
