import express from "express";

import { connectDB } from "./config/db.js";
const app = express();

connectDB(); // ← waits until DB is ready or crashes
// Only if DB connects successfully we reach here
app.listen(3000, () => {
  console.log("Server started");
});

app.get("/", (req, res) => {
  res.json("Welcome to Task Manager API");
});
