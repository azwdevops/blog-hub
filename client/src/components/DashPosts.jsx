import API from "@/utils/API";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DeleteModal from "./DeleteModal";

const DashPosts = () => {
  const user = useSelector((state) => state.auth.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      await API.get(`/posts/get-posts?userId=${user._id}`)
        .then((res) => {
          setUserPosts(res.data.posts);
          if (res.data.posts.length < 10) {
            setShowMore(false);
          }
        })
        .catch((err) => {});
    };
    if (user.isAdmin) {
      fetchPosts();
    }
  }, [user._id, user.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    await API.get(
      `/posts/get-posts?userId=${user._id}&startIndex=${startIndex}`
    )
      .then((res) => {
        setUserPosts((prev) => [...prev, ...res.data.posts]);
        if (res.data.posts.length < 10) {
          setShowMore(false);
        }
      })
      .catch((err) => {});
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    await API.delete(`/posts/delete-post/${user._id}/${currentPostId}`)
      .then((res) => {
        setUserPosts((prev) =>
          prev.filter((item) => item._id !== currentPostId)
        );
        setCurrentPostId(null);
      })
      .catch((err) => {});
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user?.isAdmin && userPosts?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts?.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/posts/${post.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      <img
                        src={`${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
                          post.image
                        }`}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setCurrentPostId(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
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
        <p>You have no posts yet</p>
      )}
      {showModal && (
        <DeleteModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleDelete={handleDeletePost}
          deleteText={"this post"}
        />
      )}
    </div>
  );
};

export default DashPosts;
