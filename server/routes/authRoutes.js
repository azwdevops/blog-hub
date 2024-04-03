const express = require("express");

const {
  signup,
  signin,
  googleAuth,
  updateUser,
} = require("#controllers/authController.js");
const { verifyUser } = require("#utils/middleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.patch("/update/:userId", verifyUser, updateUser);

module.exports = router;
