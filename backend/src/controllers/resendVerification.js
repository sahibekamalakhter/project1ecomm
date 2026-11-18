import crypto from "crypto";
import userSchema from "../models/userSchema.js";
import { sendVerificationEmail } from "../config/mail.js";

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userSchema.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This email is already verified. Please login.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = tokenExpiry;
    await user.save();

    await sendVerificationEmail(user.email, user.name, rawToken);

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
