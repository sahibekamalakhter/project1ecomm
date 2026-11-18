import bcrypt from "bcryptjs";
import crypto from "crypto";
import userSchema from "../models/userSchema.js";
import { sendVerificationEmail } from "../config/mail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role !== "buyer" && role !== "seller") {
      return res.status(400).json({
        success: false,
        message: "Please select a valid account type",
      });
    }

    const existingUser = await userSchema.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const data = await userSchema.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      isVerified: false,
      verificationToken: hashedToken,
      verificationTokenExpiry: tokenExpiry,
    });

    await sendVerificationEmail(data.email, data.name, rawToken);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      data: {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
