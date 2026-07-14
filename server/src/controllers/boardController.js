const Board = require("../models/Board");


const createBoard = async (req, res) => {
    const { title } = req.body;
    if (!title) {
    return res.status(400).json({
        message: "Title is required"
    });
}
try {
        const board = await Board.create({
    title,
    owner: req.user.id
});

        return res.status(201).json({
            message: "Board created successfully",
            board
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
const getBoards = async (req, res) => {
    try {
        const boards = await Board.find({
    owner: req.user.id
});

        return res.status(200).json({
            message: "Boards fetched successfully",
            boards
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const updateBoard = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    try {
       const board = await Board.findOneAndUpdate(
    {
        _id: id,
        owner: req.user.id
    },
    {
        title
    },
    {
        new: true
    }
);

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        return res.status(200).json({
            message: "Board updated successfully",
            board
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const deleteBoard = async (req, res) => {
    const { id } = req.params;
     try {
        const board = await Board.findOneAndDelete({
    _id: id,
    owner: req.user.id
});

        if (!board) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        return res.status(200).json({
            message: "Board deleted successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};




module.exports = {
    createBoard,
    getBoards,
    updateBoard,
    deleteBoard
};