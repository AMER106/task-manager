import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupController = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    console.log(newUser);
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully" }, newUser);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Verify password (assuming you have comparePassword method)
    const isPasswordValid = await user.validatePassword(password);
    // Alternative without method:
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. Generate token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // consider shorter: '15m' or '30m'
    );

    // 5. Cookie options - safer defaults
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    // 6. Response - NEVER send full user object or sensitive data
    return res.status(200).json({
      success: true,
      message: "Login successful",
      // You can send minimal user info if frontend needs it
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      // token is in cookie - no need to send it in body (more secure)
    });
  } catch (error) {
    console.error("Login error:", error);

    // Safe error response
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};
