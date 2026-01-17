// models/task.model.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description is too long (max 2000 characters)"],
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
      lowercase: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      lowercase: true,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    // Very important: ownership
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // → much faster queries
    },

    // Useful optional fields
    tags: {
      type: [String],
      default: [],
      trim: true,
      lowercase: true,
    },

    isImportant: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // For future features / soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // hidden by default in queries
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// Optional: Virtual field - days left until due date
taskSchema.virtual("daysLeft").get(function () {
  if (!this.dueDate) return null;
  const diff = this.dueDate - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Important indexes for performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, isImportant: -1, createdAt: -1 });

export const Task = mongoose.model("Task", taskSchema);
