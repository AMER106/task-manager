import express from "express";
import { validateSignup } from "../middleware/validateSignup.js";
import { signupController } from "../controller/signup.controller.js";
export const authRouter = express.Router();
authRouter.post("/signup", validateSignup, signupController);
