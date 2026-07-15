const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    createCard,getCards,updateCard,deleteCard} = require("../controllers/cardController");


const router = express.Router();

router.post("/", protect, createCard);
router.get("/:listId", protect, getCards);
router.put("/:id", protect, updateCard);
router.delete("/:id", protect, deleteCard);


module.exports = router;