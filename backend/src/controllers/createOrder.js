import cartSchema from "../models/cartSchema.js";
import orderSchema from "../models/orderSchema.js";

export const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can place orders",
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before placing an order",
      });
    }

    const userId = req.user._id;
    const cart = await cartSchema
      .findOne({ userId: userId })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      if (!item.productId) {
        return res.status(400).json({
          success: false,
          message: "Some products in your cart are not available",
        });
      }

      const itemTotal = item.productId.price * item.quantity;
      totalAmount = totalAmount + itemTotal;

      orderItems.push({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
      });
    }

    const order = await orderSchema.create({
      userId: userId,
      items: orderItems,
      totalAmount: totalAmount,
      status: "Confirmed",
      orderDate: new Date(),
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
