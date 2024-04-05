import API from "@/utils/API";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeleteModal from "./DeleteModal";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      await API.get(`/users/get-users`)
        .then((res) => {
          setUsers(res.data.users);
          if (res.data.users.length < 10) {
            setShowMore(false);
          }
        })
        .catch((err) => {});
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    await API.get(`/users/get-users?startIndex=${startIndex}`)
      .then((res) => {
        setUsers((prev) => [...prev, ...res.data.users]);
        if (res.data.users.length < 10) {
          setShowMore(false);
        }
      })
      .catch((err) => {});
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    await API.delete(`/users/delete/${selectedUserId}`)
      .then((res) => {
        setUsers((prev) => prev.filter((item) => item._id !== selectedUserId));
        setSelectedUserId(null);
      })
      .catch((err) => {});
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && users?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users?.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={`${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
                        user.profilePicture
                      }`}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setSelectedUserId(user._id);
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
        <p>You have no users yet</p>
      )}
      {showModal && (
        <DeleteModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleDelete={handleDeleteUser}
          deleteText={"this user"}
        />
      )}
    </div>
  );
};

export default DashUsers;
