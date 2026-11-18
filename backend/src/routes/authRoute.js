import express from "express";
import { validateData } from "../middleware/validateData.js";
import { registerSchema, loginSchema } from "../validators/authValidate.js";
import { registerUser } from "../controllers/registerUser.js";
import { loginUser } from "../controllers/loginUser.js";
import { verifyEmail } from "../controllers/verifyEmail.js";
import { resendVerification } from "../controllers/resendVerification.js";

const authRoute = express.Router();

authRoute.post("/register", validateData(registerSchema), registerUser);
authRoute.post("/login", validateData(loginSchema), loginUser);
authRoute.post("/verify-email", verifyEmail);
authRoute.post("/resend-verification", resendVerification);

export default authRoute;
