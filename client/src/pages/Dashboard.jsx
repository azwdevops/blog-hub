import DashPosts from "@/components/DashPosts";
import DashProfile from "@/components/DashProfile";
import DashSidebar from "@/components/DashSidebar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* sidebar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
    </div>
  );
};

export default Dashboard;
