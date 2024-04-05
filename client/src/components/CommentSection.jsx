import {
  processingFailure,
  processingStart,
  processingSuccess,
} from "@/redux/features/sharedSlice";
import API from "@/utils/API";
import { renderImage } from "@/utils/scripts";
import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import DeleteModal from "./DeleteModal";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.shared.error);

  const [comment, setComment] = useState("");
  const [commentsArray, setCommentsArray] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      await API.get(`/comments/get-post-comments/${postId}`)
        .then((res) => {
          setCommentsArray(res.data);
        })
        .catch((err) => {});
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(processingStart());
    await API.post(`/comments/create-comment`, {
      userId: currentUser._id,
      postId,
      content: comment,
    })
      .then((res) => {
        setComment("");
        setCommentsArray([res.data, ...commentsArray]);
        dispatch(processingSuccess());
      })
      .catch((err) => {
        dispatch(processingFailure(err.response.data.message));
      });
  };

  const handleLikeUnlike = async (commentId) => {
    if (!currentUser) {
      return navigate("/signin");
    }

    await API.put(`/comments/like-unlike-comment/${commentId}`)
      .then((res) => {
        setCommentsArray((prev) =>
          prev.map((item) =>
            item._id === res.data._id
              ? {
                  ...item,
                  likes: res.data.likes,
                  numberOfLikes: res.data.numberOfLikes,
                }
              : item
          )
        );
      })
      .catch(() => {});
  };

  const handleEdit = async (comment, editedContent) => {
    setCommentsArray(
      commentsArray.map((item) =>
        item._id === comment._id ? { ...item, content: editedContent } : item
      )
    );
  };

  const handleDeleteApi = async () => {
    if (!currentUser) {
      return navigate("/signin");
    }
    await API.delete(`/comments/delete-comment/${currentCommentId}`)
      .then((res) => {
        setCommentsArray(
          commentsArray.filter((item) => item._id !== currentCommentId)
        );
        setCurrentCommentId(null);
        setShowModal(false);
      })
      .catch((err) => {});
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as: </p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={renderImage(currentUser.profilePicture)}
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be logged in to comment
          <Link className="text-blue-500 hover:underline" to="/signin">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-medium p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="add a comment"
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {error && (
            <Alert color="failure" className="mt-3">
              {error}
            </Alert>
          )}
        </form>
      )}
      {commentsArray?.length === 0 ? (
        <p className="text-sm my-5">No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{commentsArray.length}</p>
            </div>
          </div>
          {commentsArray.map((commentItem) => (
            <Comment
              key={commentItem._id}
              commentItem={commentItem}
              handleLikeUnlike={handleLikeUnlike}
              handleEdit={handleEdit}
              handleDelete={() => {
                setShowModal(true);
                setCurrentCommentId(commentItem._id);
              }}
            />
          ))}
        </>
      )}
      <DeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDeleteApi}
        deleteText={"this comment"}
      />
    </div>
  );
};

export default CommentSection;
