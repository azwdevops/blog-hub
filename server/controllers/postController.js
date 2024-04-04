const User = require("#models/postModel.js");
const Post = require("#models/postModel.js");

const { errorHandler } = require("#utils/error.js");
module.exports.createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(400, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "All fields are required"));
  }
  const slug =
    req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "") +
    "-" +
    Math.random().toString(36).slice(-10);
  const newPost = new Post({ ...req.body, slug, user: req.user.id });
  try {
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    return next(error);
  }
};

module.exports.getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { user: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.slug }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
