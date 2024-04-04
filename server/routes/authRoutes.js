const express = require("express");

const {
  signup,
  signin,
  googleAuth,
  updateUser,
  deleteUser,
  signout,
} = require("#controllers/authController.js");
const { verifyUser, upload } = require("#utils/middleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.patch(
  "/update/:userId",
  verifyUser,
  upload.single("profilePicture"),
  updateUser
);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.post("/signout", signout);

module.exports = router;
