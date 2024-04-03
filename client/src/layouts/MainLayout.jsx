import FooterComponent from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <FooterComponent />
    </>
  );
};

export default MainLayout;
