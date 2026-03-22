import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <Navbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Content */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;