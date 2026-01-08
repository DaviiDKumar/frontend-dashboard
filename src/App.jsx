import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

// ✅ Improved Gatekeeper logic
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Check for missing token OR literal "undefined"/"null" strings
  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (allowedRole && role !== allowedRole) {
    // If they are an admin trying to go to /user or vice versa, 
    // send them to their correct dashboard instead of just /login
    return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Guarded Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* User Guarded Routes */}
        <Route 
          path="/user" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all: Redirect to Home instead of Login for better UX */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;