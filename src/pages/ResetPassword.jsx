import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await api.post("/admin/forgot-password", { email });
      alert("If the email exists, a reset link has been sent.");
      setStep("reset");
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.response?.data?.message || err?.message;
      alert(`Request failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await api.post("/admin/reset-password", { token, password });
      alert("Password reset successful. Please log in.");
      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.response?.data?.message || err?.message;
      alert(`Reset failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

        {step === "request" ? (
          <>
            <p className="mb-4 text-sm text-gray-600">
              Enter your admin email and we'll send a link to reset your password.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <button
              onClick={handleRequest}
              disabled={loading}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600">
              Enter the token from your email and choose a new password.
            </p>
            <input
              type="text"
              placeholder="Reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <button
              onClick={handleReset}
              disabled={loading}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
