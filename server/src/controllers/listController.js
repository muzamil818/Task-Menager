const List = require("../models/List");
const Board = require("../models/Board");

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
            position,
            owner: req.user.id
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
        // Find boards where current user is owner or a member
        const userBoards = await Board.find({
            $or: [{ owner: req.user.id }, { members: req.user.id }]
        }).select("_id");

        const allowedBoardIds = userBoards.map((b) => b._id);

        const query = {
            $or: [
                { owner: req.user.id },
                { boardId: { $in: allowedBoardIds } }
            ]
        };

        if (boardId) {
            query.boardId = boardId;
        }

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
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        // Verify access: owner or member of list's board
        if (list.owner && list.owner.toString() !== req.user.id) {
            const board = await Board.findById(list.boardId);
            const isMember = board && (board.owner.toString() === req.user.id || board.members.some(m => m.toString() === req.user.id));
            if (!isMember) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }
        }

        if (title !== undefined) list.title = title;
        if (position !== undefined) list.position = position;

        await list.save();

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
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        if (list.owner && list.owner.toString() !== req.user.id) {
            const board = await Board.findById(list.boardId);
            const isMember = board && (board.owner.toString() === req.user.id || board.members.some(m => m.toString() === req.user.id));
            if (!isMember) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }
        }

        await List.findByIdAndDelete(id);

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
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        if (list.owner && list.owner.toString() !== req.user.id) {
            const board = await Board.findById(list.boardId);
            const isMember = board && (board.owner.toString() === req.user.id || board.members.some(m => m.toString() === req.user.id));
            if (!isMember) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }
        }

        list.position = position;
        await list.save();

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