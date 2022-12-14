const router = require("express").Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT);
router.get("/", usersController.getAllUsers);

// router.get("/:id", usersController.getUserById);

router.post("/", usersController.createNewUser);

router.patch("/:id", usersController.updateUser);

router.delete("/:id", usersController.deleteUser);

module.exports = router;
