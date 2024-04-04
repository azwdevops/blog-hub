import { createPostSuccess } from "@/redux/features/postSlice";
import {
  processingFailure,
  processingStart,
} from "@/redux/features/sharedSlice";
import API from "@/utils/API";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({});
  const error = useSelector((state) => state?.shared?.error);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setPostData({ ...postData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(processingStart());
    if (!postData.content || !postData.category) {
      dispatch(processingFailure("All fields are required"));
      return;
    }

    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("category", postData.category);
    formData.append("image", postData.image);
    formData.append("content", postData.content);

    await API.post(`/posts/create-post`, formData)
      .then((res) => {
        dispatch(createPostSuccess(res.data));
        window.alert("Post created successfully");
        navigate(`/posts/${res.data.slug}`);
      })
      .catch((err) => {
        dispatch(processingFailure(err.response.data.message));
      });
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
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
            required
          />
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something"
          className="h-72 mb-12"
          onChange={(value) => setPostData({ ...postData, content: value })}
          value={postData?.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
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

export default CreatePost;
