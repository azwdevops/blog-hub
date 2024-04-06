import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Signin from "@/pages/Signin";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import PrivateRoute from "@/components/PrivateRoute";
import OnlyAdminPrivateRoute from "@/components/OnlyAdminPrivateRoute";
import CreatePost from "@/pages/CreatePost";
import UpdatePost from "@/pages/UpdatePost";
import PostDetail from "@/pages/PostDetail";
import Search from "@/pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <Signin /> },
      { path: "/about", element: <About /> },
      { path: "/projects", element: <Projects /> },
      { path: "/search", element: <Search /> },
      { path: "/posts/:postSlug", element: <PostDetail /> },
      {
        element: <PrivateRoute />,
        children: [{ path: "/dashboard", element: <Dashboard /> }],
      },
      {
        element: <OnlyAdminPrivateRoute />,
        children: [
          { path: "/create-post", element: <CreatePost /> },
          { path: "/update-post/:postId", element: <UpdatePost /> },
        ],
      },
    ],
  },
]);

export default router;
