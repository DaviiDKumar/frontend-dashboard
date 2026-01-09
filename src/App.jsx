import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import LeadDetails from "./pages/LeadDetails"; 
import ReassignPage from "./pages/ReassignPage";
import SecPage from "./pages/SecPage";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Verify token exists and isn't a string literal "null"
  const isAuthenticated = token && token !== "undefined" && token !== "null";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if trying to access a role-restricted route
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* --- Admin Routes --- */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/reassign" element={
          <ProtectedRoute allowedRole="admin"><ReassignPage /></ProtectedRoute>
        } />
        <Route path="/admin/security" element={
          <ProtectedRoute allowedRole="admin"><SecPage /></ProtectedRoute>
        } />

        {/* --- User Routes --- */}
        <Route path="/user" element={
          <ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/user/leads/:id" element={
          <ProtectedRoute allowedRole="user"><LeadDetails /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;