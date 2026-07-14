const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/listRoutes");
const boardRoutes = require("./routes/boardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Task Manager Backend is Running...");
});

module.exports = app;