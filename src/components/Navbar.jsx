import { logout } from "../api/api";

const Navbar = ({ onMenuClick }) => {
  return (
    <div className="bg-white shadow p-4 flex items-center justify-between">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded hover:bg-slate-100"
        aria-label="Toggle sidebar"
      >
        <span className="block w-5 h-0.5 bg-slate-700 mb-1" />
        <span className="block w-5 h-0.5 bg-slate-700 mb-1" />
        <span className="block w-5 h-0.5 bg-slate-700" />
      </button>

      <h1 className="font-bold text-xl">Admin Dashboard</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Welcome Admin</span>
        <button
          onClick={logout}
          className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;