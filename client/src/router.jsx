import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Signin from "@/pages/Signin";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import About from "@/pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <Signin /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/about", element: <About /> },
      { path: "/projects", element: <Projects /> },
    ],
  },
]);

export default router;
