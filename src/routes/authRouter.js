import express from "express";
import rateLimit from "express-rate-limit";
import {
  validateSignup,
  validateSignin,
} from "../middleware/auth.middleware.js";
import {
  signupController,
  signinController,
} from "../controller/auth.controller.js";
export const authRouter = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per window
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
authRouter.post("/signup", validateSignup, signupController);
authRouter.post("/signin", loginLimiter, validateSignin, signinController);
