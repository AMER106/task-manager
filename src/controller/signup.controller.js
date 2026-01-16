import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

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
