const { errorHandler } = require("#utils/error.js");
const Comment = require("#models/commentModel.js");

module.exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(errorHandler(403, "Permission to comment denied"));
    }
    const newComment = new Comment({ content, post: postId, user: userId });
    await newComment.save();

    return res.status(201).json(newComment);
  } catch (error) {
    return next(error);
  }
};

module.exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({
        createdAt: -1,
      })
      .populate({ path: "user", select: "username profilePicture createdAt" });
    return res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
};

module.exports.likeUnlikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment does not exist"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    return res.status(200).json(comment);
  } catch (error) {
    return next(error);
  }
};

module.exports.editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment does not exist"));
    }
    if (comment.user !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "permission to edit comment denied"));
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );
    return res.status(200).json(editedComment);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.user !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "Permission to delete comment denied"));
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
