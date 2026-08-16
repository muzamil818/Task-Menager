const List = require("../models/List");
const Board = require("../models/Board");
const { getIo } = require("../socket");

// Create List
const createList = async (req, res) => {
    const { boardId, title, position } = req.body;

    if (!boardId || !title) {
        return res.status(400).json({
            message: "Board ID and Title are required"
        });
    }

    try {
        const board = await Board.findOne({
            _id: boardId,
            owner: req.user.id
        });

        if (!board) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const list = await List.create({
            boardId,
            title,
            position
        });

        // Socket.IO: notify clients about new list
        getIo().emit("listCreated", {
            list
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
        const board = await Board.findOne({
            _id: boardId,
            owner: req.user.id
        });

        if (!board) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const lists = await List.find({ boardId }).sort({ position: 1 });

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
        const existingList = await List.findById(id);

        if (!existingList) {
            return res.status(404).json({
                message: "List not found"
            });
        }

        const board = await Board.findOne({
            _id: existingList.boardId,
            owner: req.user.id
        });

        if (!board) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const updatedList = await List.findByIdAndUpdate(
            id,
            {
                title,
                position
            },
            {
                new: true
            }
        );

        // Socket.IO: notify clients about updated list
        getIo().emit("listUpdated", {
            list: updatedList
        });

        return res.status(200).json({
            message: "List updated successfully",
            list: updatedList
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
        const list = await List.findById(id);

        if (!list) {
            return res.status(404).json({
                message: "List not found"
            });
        }

        const board = await Board.findOne({
            _id: list.boardId,
            owner: req.user.id
        });

        if (!board) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        await List.findByIdAndDelete(id);

        // Socket.IO: notify clients about deleted list
        getIo().emit("listDeleted", {
            listId: id
        });

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


// Move List
const moveList = async (req, res) => {
    const { id } = req.params;
    const { position } = req.body;

    try {
        const list = await List.findById(id);

        if (!list) {
            return res.status(404).json({
                message: "List not found"
            });
        }

        const board = await Board.findOne({
            _id: list.boardId,
            owner: req.user.id
        });

        if (!board) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const updatedList = await List.findByIdAndUpdate(
            id,
            {
                position
            },
            {
                new: true
            }
        );

        // Socket.IO: notify clients about moved list
        getIo().emit("listMoved", {
            list: updatedList
        });

        return res.status(200).json({
            message: "List moved successfully",
            list: updatedList
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