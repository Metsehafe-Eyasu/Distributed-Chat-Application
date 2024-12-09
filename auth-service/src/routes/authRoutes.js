const express = require("express");
const { login, register, user_by_username } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.get("/user-by-username", user_by_username);

module.exports = router;
