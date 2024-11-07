import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log(isAuthenticated, "7777");

  // If the user is not authenticated, redirect to the signin page
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
