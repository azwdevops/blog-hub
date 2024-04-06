import CallToAction from "@/components/CallToAction";
import CommentSection from "@/components/CommentSection";
import PostCard from "@/components/PostCard";
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
  const [recentPosts, setRecentPosts] = useState([]);

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

  useEffect(() => {
    const fetchRecentPosts = async () => {
      await API.get(`/posts/get-posts?limit=3`)
        .then((res) => {
          setRecentPosts(res.data.posts);
        })
        .catch((err) => {});
    };
    fetchRecentPosts();
  }, []);

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
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts?.map((postItem) => (
              <PostCard postItem={postItem} key={postItem._id} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default PostDetail;
