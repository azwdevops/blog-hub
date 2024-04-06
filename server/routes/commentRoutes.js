const express = require("express");

const {
  createComment,
  getPostComments,
  likeUnlikeComment,
  editComment,
  deleteComment,
  getComments,
} = require("#controllers/commentController.js");
const { verifyUser } = require("#utils/middleware.js");

const router = express.Router();
router.post("/create-comment", verifyUser, createComment);
router.get("/get-post-comments/:postId", getPostComments);
router.get("/get-comments", verifyUser, getComments);
router.put(`/like-unlike-comment/:commentId`, verifyUser, likeUnlikeComment);
router.put(`/edit-comment/:commentId`, verifyUser, editComment);
router.delete(`/delete-comment/:commentId`, verifyUser, deleteComment);

module.exports = router;
