import { Link } from "react-router-dom";
import CallToAction from "@/components/CallToAction";
import { useEffect, useState } from "react";
import API from "@/utils/API";
import PostCard from "@/components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      await API.get(`/posts/get-posts`)
        .then((res) => {
          setPosts(res.data.posts);
        })
        .catch((err) => {});
    };
    fetchPosts();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to{" "}
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Blog
          </span>
          <span className="text-red-500">Hub</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-[1.2rem]">
          We discuss a variety of software engineering topics including web dev,
          programming languages, frameworks and more
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View All Posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700 max-w-6xl mx-auto">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts?.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {posts?.map((postItem) => (
                <PostCard key={postItem._id} postItem={postItem} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View All Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
