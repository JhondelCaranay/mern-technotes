const router = require("express").Router();

const notesController = require("../controllers/notesController");

router.get("/", notesController.getAllNotes);

// router.get("/:id", notesController.getNoteById);

router.post("/", notesController.createNewNote);

router.patch("/:id", notesController.updateNote);

router.delete("/:id", notesController.deleteNote);

module.exports = router;
