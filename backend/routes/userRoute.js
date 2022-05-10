const express = require("express");
const {
	registerUser,
	loginUser,
	logoutUser,
	forgotPassword,
	getUserDetails,
	updatePassword,
} = require("../controller/userController");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticated, getUserDetails);

module.exports = router;
