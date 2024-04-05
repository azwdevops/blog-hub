import {
  processingFailure,
  processingStart,
  processingSuccess,
} from "@/redux/features/sharedSlice";
import API from "@/utils/API";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { postId } = useParams();
  const [postData, setPostData] = useState({});
  const error = useSelector((state) => state?.shared?.error);
  const user = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    if (user.isAdmin) {
      const fetchPost = async () => {
        await API.get(`/posts/get-posts?postId=${postId}`)
          .then((res) => {
            setPostData(res.data.posts[0]);
          })
          .catch((err) => {});
      };
      fetchPost();
    }
  }, [postId, user?.isAdmin]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setPostData({ ...postData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.content || !postData.category) {
      dispatch(processingFailure("All fields are required"));
      return;
    }
    dispatch(processingStart());

    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("category", postData.category);
    formData.append("image", postData.image);
    formData.append("content", postData.content);

    await API.post(`/posts/update-post/${user._id}/${postId}`, formData)
      .then((res) => {
        dispatch(processingSuccess());
        window.alert("Post updated successfully");
        // navigate(`/posts/${res.data.slug}`);
      })
      .catch((err) => {
        dispatch(processingFailure(err.response.data.message));
      });
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="title"
            name="title"
            className="flex-1"
            onChange={handleChange}
            value={postData?.title}
            required
          />
          <Select
            name="category"
            onChange={handleChange}
            value={postData?.category}
            required
          >
            <option value="uncategorized">select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">Reactjs</option>
            <option value="nextjs">Nextjs</option>
            <option value="python">Python</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
          />
        </div>
        {postData.image && (
          // if we have postData.image from database it will be in form of a string not a binary file, thus we use the condition below to be able to display
          // image if it's string or if it's binary file
          <img
            src={
              (typeof postData.image !== "string" &&
                URL.createObjectURL(postData?.image)) ||
              `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${postData.image}`
            }
            className="w-full h-72 object-cover"
            alt=""
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something"
          className="h-72 mb-12"
          onChange={(value) => setPostData({ ...postData, content: value })}
          value={postData?.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>
      </form>
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default UpdatePost;
