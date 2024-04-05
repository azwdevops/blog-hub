const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: Array, default: [] },
    numberOfLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
