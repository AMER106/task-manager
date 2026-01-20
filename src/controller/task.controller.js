// controllers/task.controller.js
import { Task } from "../models/task.model.js";

export const createTaskController = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body, // spread all fields the user sent
      user: req.user._id, // ← very important – ownership!
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    // Handle common errors nicely
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

// controllers/task.controller.js

// Example: Get all my tasks with user details
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .populate({
        path: "user", // field name in Task schema
        select: "firstName lastName email", // only these fields (never password!)
      })
      .sort({ createdAt: -1 }); // optional: newest first

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};
