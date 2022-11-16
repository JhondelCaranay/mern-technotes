const authController = require("../controllers/authController");
const loginLimiter = require("../middlewares/loginLimiter");

const router = require("express").Router();

router.post("/login", loginLimiter, authController.login);

router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout);

module.exports = router;

// const express = require('express')
// const router = express.Router()
// const authController = require('../controllers/authController')
// const loginLimiter = require('../middleware/loginLimiter')

// router.route('/')
//     .post(loginLimiter, authController.login)

// router.route('/refresh')
//     .get(authController.refresh)

// router.route('/logout')
//     .post(authController.logout)

// module.exports = router
