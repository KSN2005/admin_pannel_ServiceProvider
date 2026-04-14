import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, TOKEN_KEY, REFRESH_TOKEN_KEY } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIXED: Use correct endpoint with /api prefix
      const { data } = await api.post("/api/admin/login", { email, password });

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        if (data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;

      console.error("Login Error:", err.config?.url, err.response?.status);
      alert(`Login failed: ${message}`);
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    try {
      // ✅ FIXED: Use correct endpoint with /api prefix
      const { data } = await api.post("/api/admin/register", {
        email,
        password,
      });
      alert(data.message || "Admin registered. You can now log in.");
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;
      console.error("Register Error:", err.config?.url, err.response?.status);
      alert(`Register failed: ${message}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to manage your website
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          
          {/* Email */}
          <div className="mb-5">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full mt-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-5 relative">
            <label className="text-sm text-gray-600">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full mt-1 border border-gray-300 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Extra Buttons */}
        <div className="mt-5 space-y-3">
          
          <button
            type="button"
            className="w-full py-3 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
            onClick={handleRegister}
          >
            Register First Admin
          </button>

          <button
            type="button"
            className="w-full py-3 border border-blue-400 rounded-lg text-blue-600 hover:bg-blue-50 transition"
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password
          </button>

        </div>

      </div>
    </div>
  );
};

export default Login;