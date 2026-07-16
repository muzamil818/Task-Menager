const Card = require("../models/Card");

const createCard = async (req, res) => {
    const {
        listId,
        title,
        description,
        assignedTo,
        priority,
        dueDate,
        position
    } = req.body;

    if (!listId || !title) {
        return res.status(400).json({
            message: "List ID and Title are required"
        });
    }

    try {
        const card = await Card.create({
            listId,
            title,
            description,
            assignedTo,
            priority,
            dueDate,
            position
        });

        return res.status(201).json({
            message: "Card created successfully",
            card
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const getCards = async (req, res) => {
    const { listId } = req.params;

    try {
        const cards = await Card.find({ listId }).sort({ position: 1 });

        return res.status(200).json({
            message: "Cards fetched successfully",
            cards
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const updateCard = async (req, res) => {
    const { id } = req.params;

    const {
        title,
        description,
        assignedTo,
        priority,
        dueDate,
        position
    } = req.body;

    try {
        const card = await Card.findByIdAndUpdate(
            id,
            {
                title,
                description,
                assignedTo,
                priority,
                dueDate,
                position
            },
            {
                new: true
            }
        );

        if (!card) {
            return res.status(404).json({
                message: "Card not found"
            });
        }

        return res.status(200).json({
            message: "Card updated successfully",
            card
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const deleteCard = async (req, res) => {
    const { id } = req.params;

    try {
        const card = await Card.findByIdAndDelete(id);

        if (!card) {
            return res.status(404).json({
                message: "Card not found"
            });
        }

        return res.status(200).json({
            message: "Card deleted successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createCard,
    getCards,
    updateCard,
    deleteCard
};