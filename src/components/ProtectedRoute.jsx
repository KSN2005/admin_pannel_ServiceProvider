import { Navigate } from "react-router-dom";
import { TOKEN_KEY, isTokenExpired, logout } from "../api/api";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token || isTokenExpired(token)) {
    logout();
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;