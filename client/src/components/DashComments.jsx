import API from "@/utils/API";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeleteModal from "./DeleteModal";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      await API.get(`/comments/get-comments`)
        .then((res) => {
          setComments(res.data.comments);
          if (res.data.comments.length < 10) {
            setShowMore(false);
          }
        })
        .catch((err) => {});
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    await API.get(`/comments/get-comments?startIndex=${startIndex}`)
      .then((res) => {
        setComments((prev) => [...prev, ...res.data.comments]);
        if (res.data.comments.length < 10) {
          setShowMore(false);
        }
      })
      .catch((err) => {});
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    await API.delete(`/comments/delete-comment/${selectedCommentId}`)
      .then((res) => {
        setComments((prev) =>
          prev.filter((item) => item._id !== selectedCommentId)
        );
        setSelectedCommentId(null);
      })
      .catch((err) => {});
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && comments?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments?.map((commentItem) => (
                <Table.Row
                  key={commentItem._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(commentItem.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{commentItem.content}</Table.Cell>
                  <Table.Cell>{commentItem.numberOfLikes}</Table.Cell>
                  <Table.Cell>{commentItem.post._id}</Table.Cell>
                  <Table.Cell>{commentItem.user._id}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setSelectedCommentId(commentItem._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet</p>
      )}
      {showModal && (
        <DeleteModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleDelete={handleDeleteComment}
          deleteText={"this comment"}
        />
      )}
    </div>
  );
};

export default DashComments;
