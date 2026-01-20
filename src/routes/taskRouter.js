import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  createTaskController,
  getMyTasks,
} from "../controller/task.controller.js";
export const taskRouter = express.Router();

taskRouter.post("/create", auth, createTaskController);
taskRouter.get("/my-tasks", auth, getMyTasks);
