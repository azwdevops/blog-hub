import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import API from "@/utils/API";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "@/redux/features/authSlice";

const DashProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      setImageFileUploading(true);
      setImageFileUploadError(null);
      const uploadImage = async () => {
        const storage = getStorage(app);
        const fileName = new Date().getTimezoneOffset() + imageFile?.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadingProgress(progress.toFixed(0));
          },
          (error) => {
            setImageFileUploadError(
              "Could not upload image, file must be less than 2MB"
            );
            setImageFileUploadingProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
            setImageFileUploading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageFileUrl(downloadURL);
              setImageFileUploading(false);
              // setFormData({ ...formData, profilePicture: downloadURL });
            });
          }
        );
      };
      uploadImage();
    }
  }, [imageFile]);

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
    if (imageFileUploading) {
      setUpdateErrorMessage("Image is still uploading, please wait...");
      return;
    }
    dispatch(updateUserStart());
    await API.patch(`/users/update/${user._id}/`, formData)
      .then((res) => {
        dispatch(updateUserSuccess(res.data));
        setUpdateSuccessMessage("Profile updated successfully");
      })
      .catch((err) => {
        setUpdateErrorMessage(err.response.data.message);
        dispatch(updateUserFailure());
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
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152, 199, ${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || user?.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
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
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          onClick={handleSubmit}
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
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
    </div>
  );
};

export default DashProfile;
