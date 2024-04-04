import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const user = useSelector((state) => state.auth.user);

  return user && user?.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
};

export default OnlyAdminPrivateRoute;
