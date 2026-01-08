import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./api/axios";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

// ✅ Updated ProtectedRoute
function ProtectedRoute({ children, allowedRole }) {
  const [status, setStatus] = useState("loading"); // loading | authorized | unauthorized

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/check"); // backend returns { role }
        if (allowedRole && res.data.role !== allowedRole) {
          setStatus("unauthorized");
        } else {
          setStatus("authorized");
        }
      } catch {
        setStatus("unauthorized");
      }
    };

    checkAuth();
  }, [allowedRole]);

  if (status === "loading") return null; // ⏳ don't render anything until check is done

  if (status === "unauthorized") return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
