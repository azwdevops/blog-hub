const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2024/04/02/12/21/spring-8670808_960_720.jpg",
    },
    category: { type: String, default: "uncategorized" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
