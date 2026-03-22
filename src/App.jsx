import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import AddService from "./pages/AddService";
import Enquiries from "./pages/Enquiries";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/reset-password";

  return (
    <div className={isAuthPage ? "" : "min-h-screen flex bg-slate-50"}>
      
      {/* Sidebar (hide on login pages) */}
      {!isAuthPage && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          !isAuthPage ? "md:ml-64" : ""
        }`}
      >
        {/* Navbar */}
        {!isAuthPage && (
          <Navbar
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />
        )}

        {/* Pages */}
        <main className={`${!isAuthPage ? "p-6" : ""} flex-1`}>
          <Routes>

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-service"
              element={
                <ProtectedRoute>
                  <AddService />
                </ProtectedRoute>
              }
            />

            <Route
              path="/enquiries"
              element={
                <ProtectedRoute>
                  <Enquiries />
                </ProtectedRoute>
              }
            />

            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;