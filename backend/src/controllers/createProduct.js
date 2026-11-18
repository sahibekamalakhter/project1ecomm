import productSchema from "../models/productSchema.js";

export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can create products",
      });
    }

    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product photo is required",
      });
    }

    const imagePath = "/uploads/" + req.file.filename;

    const data = await productSchema.create({
      name: name,
      description: description,
      price: Number(price),
      image: imagePath,
      sellerId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Product listed successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
