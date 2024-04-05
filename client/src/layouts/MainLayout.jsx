import FooterComponent from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <FooterComponent />
    </>
  );
};

export default MainLayout;
