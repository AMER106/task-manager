import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  createTaskController,
  getMyTasks,
  updateTaskController,
  deleteTaskController,
} from "../controller/task.controller.js";
export const taskRouter = express.Router();

taskRouter.post("/create", auth, createTaskController);
taskRouter.get("/my-tasks", auth, getMyTasks);
taskRouter.patch("/update/:id", auth, updateTaskController);
taskRouter.delete("/delete/:id", auth, deleteTaskController);
