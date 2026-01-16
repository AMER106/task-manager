import { z } from "zod";
import validator from "validator";

export const validateSignup = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: "Password is not strong enough" });
  }

  next();
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
