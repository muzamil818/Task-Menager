const Task = require("../models/Task");

const createTask = async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    try {
        const task = await Task.create({
            title,
            user: req.user.id
        });

        return res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            {
                title
            },
            {
                new: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};