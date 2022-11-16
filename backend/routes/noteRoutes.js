const router = require("express").Router();
const notesController = require("../controllers/notesController");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT); // all routes in this file will be protected

router.get("/", notesController.getAllNotes);

// router.get("/:id", notesController.getNoteById);

router.post("/", notesController.createNewNote);

router.patch("/:id", notesController.updateNote);

router.delete("/:id", notesController.deleteNote);

module.exports = router;
