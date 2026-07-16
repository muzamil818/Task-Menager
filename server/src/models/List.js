const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
    {
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        position: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const List = mongoose.model("List", listSchema);

module.exports = List;