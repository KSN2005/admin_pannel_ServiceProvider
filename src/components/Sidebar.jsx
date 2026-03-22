import { NavLink, useNavigate } from "react-router-dom";
import { TOKEN_KEY } from "../api/api";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Mail,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate("/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200";

  const activeClass = "bg-blue-600 text-white shadow";
  const inactiveClass =
    "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
    <>
      {/* Overlay (mobile only) */}
      <div
        className={`fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-5 z-30 transform transition-transform duration-300 shadow-xl ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold tracking-wide">
            CMA <span className="text-blue-500">Admin</span>
          </h2>

          <button
            className="md:hidden text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Briefcase size={18} />
            Services
          </NavLink>

          <NavLink
            to="/add-service"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <PlusCircle size={18} />
            Add Service
          </NavLink>

          <NavLink
            to="/enquiries"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Mail size={18} />
            Enquiries
          </NavLink>

          <NavLink
            to="/team"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Users size={18} />
            Team
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>

          {/* Divider */}
          <div className="border-t border-gray-700 my-4"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;