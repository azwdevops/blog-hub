import API from "@/utils/API";
import { renderImage } from "@/utils/scripts";
import { Button, Textarea } from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({
  commentItem,
  handleLikeUnlike,
  handleEdit,
  handleDelete,
}) => {
  const currentUser = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(commentItem.content);

  const handleSave = async () => {
    await API.put(`/comments/edit-comment/${commentItem._id}`, {
      content: editedComment,
    })
      .then((res) => {
        handleEdit(commentItem, editedComment);
        setIsEditing(false);
      })
      .catch((err) => {});
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={renderImage(commentItem?.user?.profilePicture)}
          alt={commentItem?.user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {commentItem?.user?.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(commentItem?.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToPink"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{commentItem?.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => handleLikeUnlike(commentItem._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  commentItem.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {commentItem?.numberOfLikes > 0 &&
                  `${commentItem?.numberOfLikes} ${
                    commentItem.numberOfLikes === 1 ? "like" : "likes"
                  }`}
              </p>
              {currentUser &&
                (currentUser._id === commentItem.user ||
                  currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-500"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleDelete(commentItem._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
