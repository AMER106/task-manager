import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const validateSignup = (req, res, next) => {
  try {
    signupSchema.parse(req.body); // throws on error
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const validateSignin = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
