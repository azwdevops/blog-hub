import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import API from "@/utils/API";
import {
  deleteUserSuccess,
  clearAuthState,
  updateUserSuccess,
} from "@/redux/features/authSlice";
import { Link } from "react-router-dom";
import {
  clearSharedState,
  processingFailure,
  processingStart,
} from "@/redux/features/sharedSlice";
import DeleteModal from "./DeleteModal";
import { clearReduxPersistedState } from "@/utils/scripts";

const DashProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const error = useSelector((state) => state.shared?.error);
  const loading = useSelector((state) => state.shared?.loading);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [formData, setFormData] = useState({});
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [e.target.id]: file });
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateErrorMessage(null);
    setUpdateSuccessMessage(null);
    if (Object.keys(formData).length === 0) {
      setUpdateErrorMessage("Error, no changes made");
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setUpdateErrorMessage("Password do not match");
      return;
    }
    dispatch(processingStart());
    const data = new FormData();
    formData?.profilePicture &&
      data.append("profilePicture", formData.profilePicture);
    formData?.username && data.append("username", formData.username);
    formData?.email && data.append("email", formData.email);
    formData?.password && data.append("password", formData.password);

    await API.patch(`/users/update/${user._id}/`, data)
      .then((res) => {
        dispatch(updateUserSuccess(res.data));
        setUpdateSuccessMessage("Profile updated successfully");
        setFormData({});
      })
      .catch((err) => {
        setUpdateErrorMessage(err.response.data.message);
        dispatch(processingFailure());
      });
  };

  const handleDelete = async () => {
    setShowModal(false);
    dispatch(processingStart());
    await API.delete(`/users/delete/${user._id}`)
      .then((res) => {
        dispatch(deleteUserSuccess());
        window.alert(res.data.message);
      })
      .catch((err) => {
        dispatch(processingFailure(err.response.data.message));
        console.log(err);
      });
  };

  const handleSignout = async () => {
    await API.post("/users/signout")
      .then((res) => {
        dispatch(clearAuthState());
        dispatch(clearSharedState());
        clearReduxPersistedState();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="max-w-lg !mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          id="profilePicture"
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={
              imageFileUrl ||
              `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
                user?.profilePicture
              }`
            }
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] `}
          />
        </div>

        <TextInput
          type="text"
          id="username"
          onChange={handleChange}
          placeholder="username"
          defaultValue={user.username}
        />
        <TextInput
          type="email"
          id="email"
          onChange={handleChange}
          placeholder="email"
          defaultValue={user.email}
        />
        <TextInput
          type="password"
          id="password"
          onChange={handleChange}
          placeholder="password"
        />
        <TextInput
          type="password"
          id="confirmPassword"
          onChange={handleChange}
          placeholder="confirm password"
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" /> <span className="pl-3">Loading...</span>{" "}
            </>
          ) : (
            "Update"
          )}
        </Button>
        {user?.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>
      {updateSuccessMessage && (
        <Alert color="success" className="mt-5">
          {updateSuccessMessage}
        </Alert>
      )}
      {updateErrorMessage && (
        <Alert color="failure" className="mt-5">
          {updateErrorMessage}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      {showModal && (
        <DeleteModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
          deleteText={"your account"}
        />
      )}
    </div>
  );
};

export default DashProfile;
