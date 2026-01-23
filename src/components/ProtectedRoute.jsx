import { Navigate, useLocation } from "react-router-dom";
import AdminStore from "../store/AdminStore";

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = AdminStore();
  const location = useLocation();

  if (!isAdmin()) {
    return (
      <Navigate
        to="/signin"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
