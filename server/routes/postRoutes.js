const express = require("express");
const { verifyUser, upload } = require("#utils/middleware.js");
const { createPost, getPosts } = require("#controllers/postController.js");

const router = express.Router();

router.post("/create-post", verifyUser, upload.single("image"), createPost);
router.get("/get-posts", getPosts);

module.exports = router;
