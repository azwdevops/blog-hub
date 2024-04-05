const express = require("express");
const { verifyUser, upload } = require("#utils/middleware.js");
const {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} = require("#controllers/postController.js");

const router = express.Router();

router.post("/create-post", verifyUser, upload.single("image"), createPost);
router.get("/get-posts", getPosts);
router.delete("/delete-post/:userId/:postId", verifyUser, deletePost);
router.post(
  "/update-post/:userId/:postId",
  verifyUser,
  upload.single("image"),
  updatePost
);

module.exports = router;
