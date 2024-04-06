import PostCard from "@/components/PostCard";
import {
  processingFailure,
  processingStart,
  processingSuccess,
} from "@/redux/features/sharedSlice";
import API from "@/utils/API";
import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state?.shared?.loading);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl) {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: searchTermFromUrl,
      }));
    }
    if (sortFromUrl) {
      setSidebarData((prev) => ({
        ...prev,
        sort: sortFromUrl,
      }));
    }
    if (categoryFromUrl) {
      setSidebarData((prev) => ({
        ...prev,
        category: categoryFromUrl,
      }));
    }

    const fetchPosts = async () => {
      dispatch(processingStart());
      const searchQuery = urlParams.toString();
      await API.get(`/posts/get-posts?${searchQuery}`)
        .then((res) => {
          setPosts(res.data.posts);
          dispatch(processingSuccess());
          if (res.data.posts === 9) {
            setShowMore(false);
          }
        })
        .catch((err) => {
          dispatch(processingFailure(err.response.data.message));
        });
    };
    fetchPosts();
  }, [location.search, dispatch]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    } else if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    } else if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    await API.get(`/posts/get-posts?${searchQuery}`)
      .then((res) => {
        setPosts([...posts, ...res.data.posts]);
        if (res.data.posts.length === 9) {
          setShowMore(false);
        }
      })
      .catch((err) => {});
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label htmlFor="" className="whitespace-nowrap font-semibold">
              Search Term:{" "}
            </label>
            <TextInput
              placeholder="search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="" className="font-semibold">
              Sort:
            </label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="" className="font-semibold">
              Category:
            </label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">Javascript</option>
              <option value="nodejs">Node.Js</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4 justify-center">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts.length > 0 &&
            posts.map((postItem) => (
              <PostCard key={postItem._id} postItem={postItem} />
            ))}
          {showMore && (
            <button
              className="text-teal-500 text-lg hover:underline p-7 w-full"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
