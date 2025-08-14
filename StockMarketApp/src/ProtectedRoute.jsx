import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          setAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (authenticated === null) {
    return <p>Loading...</p>; // wait until auth check finishes
  }

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
