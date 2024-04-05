import CallToAction from "@/components/CallToAction";
import CommentSection from "@/components/CommentSection";
import {
  processingFailure,
  processingStart,
  processingSuccess,
} from "@/redux/features/sharedSlice";
import API from "@/utils/API";
import { renderImage } from "@/utils/scripts";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const PostDetail = () => {
  const { postSlug } = useParams();
  const dispatch = useDispatch();
  const [postData, setPostData] = useState(null);

  const loading = useSelector((state) => state.shared.loading);
  const error = useSelector((state) => state.shared.error);

  useEffect(() => {
    const fetchPost = async () => {
      dispatch(processingStart());
      await API.get(`/posts/get-posts?slug=${postSlug}`)
        .then((res) => {
          setPostData(res.data.posts[0]);
          dispatch(processingSuccess());
        })
        .catch((err) => {
          dispatch(processingFailure(err.response.data.message));
        });
    };
    fetchPost();
  }, [postSlug, dispatch]);

  if (loading || postData === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {postData && postData?.title}
      </h1>
      <Link
        to={`/search?category=${postData && postData.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {postData && postData.category}
        </Button>
      </Link>
      <img
        src={postData && renderImage(postData.image)}
        alt={postData.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>
          {postData && new Date(postData.updatedAt).toLocaleDateString()}
        </span>
        <span className="italic">
          {postData && (postData.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: postData && postData.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={postData?._id} />
    </main>
  );
};

export default PostDetail;
