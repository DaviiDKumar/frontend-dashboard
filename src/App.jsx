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

// --- PUBLIC AGENCY PAGES ---
// import About from "./pages/About";
// import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
// import Terms from "./pages/Terms";
// import Privacy from "./pages/Privacy";

/**
 * Global Layout Wrapper
 * Ensures Navbar is always present and content is spaced correctly
 */
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      {/* This wrapper ensures that content starts below the sticky navbar.
        If your Navbar is roughly 80px tall, this ensures no overlap.
      */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

/**
 * Route Guard
 * Handles authentication and role-based access
 */
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAuthenticated = token && token !== "undefined" && token !== "null";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // If a user tries to access admin, send them to user dashboard and vice-versa
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
          {/* <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
         
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} /> */}
           <Route path="/contact" element={<Contact />} />
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* --- Admin Terminal Routes --- */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
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

          {/* Catch-all Redirect: If no route matches, go Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;