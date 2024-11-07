import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If the user is authenticated, redirect them to the dashboard
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;

// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem("token"); // Get the token from localStorage

//   // If a token exists, the user is logged in, redirect to dashboard
//   return token ? <Navigate to="/dashboard" /> : children;
// };

// export default PublicRoute;

