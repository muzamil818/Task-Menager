const express = require("express");
const protect = require("../middleware/authMiddleware");
const {createList, getLists, updateList, deleteList} = require("../controllers/listController");

const router = express.Router();

router.post("/", protect, createList);
router.get("/", protect, getLists);
router.put("/:id", protect, updateList);
router.delete("/:id", protect, deleteList);


module.exports = router;