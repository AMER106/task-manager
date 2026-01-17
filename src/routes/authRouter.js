import express from "express";
import rateLimit from "express-rate-limit";

import {
  signupController,
  signinController,
} from "../controller/auth.controller.js";
import { validateSignin, validateSignup } from "../utils/validation.js";
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
