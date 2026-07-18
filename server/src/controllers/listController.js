const List = require("../models/List");

// Create List
const createList = async (req, res) => {
    const { boardId, title, position } = req.body;

    if (!boardId || !title) {
        return res.status(400).json({
            message: "Board ID and Title are required"
        });
    }

    try {
        const list = await List.create({
            boardId,
            title,
            position
        });

        return res.status(201).json({
            message: "List created successfully",
            list
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Get Lists
const getLists = async (req, res) => {
    const { boardId } = req.query;

    try {
        const query = boardId ? { boardId } : {};

        const lists = await List.find(query);

        return res.status(200).json({
            message: "Lists fetched successfully",
            lists
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Update List
const updateList = async (req, res) => {
    const { id } = req.params;
    const { title, position } = req.body;

    try {
        const list = await List.findByIdAndUpdate(
            id,
            {
                title,
                position
            },
            {
                new: true
            }
        );

        if (!list) {
            return res.status(404).json({
                message: "List not found"
            });
        }

        return res.status(200).json({
            message: "List updated successfully",
            list
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Delete List
const deleteList = async (req, res) => {
    const { id } = req.params;

    try {
        const list = await List.findByIdAndDelete(id);

        if (!list) {
            return res.status(404).json({
                message: "List not found"
            });
        }

        return res.status(200).json({
            message: "List deleted successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const moveList = async (req, res) => {
    const { id } = req.params;
    const { position } = req.body;

    try {
        const list = await List.findByIdAndUpdate(
            id,
            {
                position
            },
            {
                new: true
            }
        );

        if (!list) {
            return res.status(404).json({
                message: "List not found"
            });
        }

        return res.status(200).json({
            message: "List moved successfully",
            list
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createList,
    getLists,
    updateList,
    deleteList,
    moveList
};