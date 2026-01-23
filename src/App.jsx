import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

// Components
import Navbar from "./components/Navbar";

// Terminal & Auth Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import LeadDetails from "./pages/LeadDetails"; 
import ReassignPage from "./pages/ReassignPage";
import SecPage from "./pages/SecPage";
import PendingLeads from "./pages/PendingLeads"; 
import FlushedLeads from "./pages/FlushedLeads"; // ADDED THIS

// --- PUBLIC AGENCY PAGES ---
import Contact from "./pages/Contact";

/**
 * Global Layout Wrapper
 */
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

/**
 * Route Guard
 */
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAuthenticated = token && token !== "undefined" && token !== "null";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* --- Public Agency Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* --- Admin Terminal Routes --- */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* NEW ARCHIVE ROUTE */}
          <Route path="/admin/archives" element={
            <ProtectedRoute allowedRole="admin">
              <FlushedLeads />
            </ProtectedRoute>
          } />
          <Route path="/admin/reassign" element={
            <ProtectedRoute allowedRole="admin">
              <ReassignPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/security" element={
            <ProtectedRoute allowedRole="admin">
              <SecPage />
            </ProtectedRoute>
          } />

          {/* --- User Terminal Routes --- */}
          <Route path="/user" element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user/leads/:id" element={
            <ProtectedRoute allowedRole="user">
              <LeadDetails />
            </ProtectedRoute>
          } />
          <Route path="/user/pending" element={
            <ProtectedRoute allowedRole="user">
              <PendingLeads />
            </ProtectedRoute>
          } />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;