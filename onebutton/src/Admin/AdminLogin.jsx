import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Admin/api"; // ✅ Import your global axios instance

export default function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Check if Admin is Logged In on Mount
  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        try {
          const response = await api.get("/admin/profile");
          setAdmin(response.data);
        } catch (err) {
          console.error("Profile fetch failed:", err);
          setAdmin(null);
        }
      }
      setLoading(false);
    };
    fetchAdmin();
  }, []);

  // ✅ Handle Login (Step 1)
  const handleLogin = async () => {
    setError("");
    try {
      await api.post("/admin/login", { email, password });
      setStep(2); // Move to OTP verification
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  // ✅ Handle OTP Verification (Step 2)
  const handleVerifyOtp = async () => {
    setError("");
    try {
      const response = await api.post("/admin/verify-otp", { email, otp });

      if (response.data.access_token) {
        const newToken = response.data.access_token;

        // Save token for future use
        localStorage.setItem("admin_token", newToken);

        // ✅ Axios global instance automatically picks token from localStorage
        await fetchAdminProfile();
      } else {
        setError("OTP verification failed.");
      }
    } catch (err) {
      setError("Invalid or expired OTP.");
    }
  };

  // ✅ Fetch Admin Profile After OTP
  const fetchAdminProfile = async () => {
    try {
      const response = await api.get("/admin/profile");
      setAdmin(response.data);
      setStep(3);
      navigate("/Admin/DashBoard");
    } catch (err) {
      setError("Failed to fetch admin details.");
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
    setEmail("");
    setPassword("");
    setOtp("");
    setStep(1);
  };

  // ✅ UI Rendering
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : admin ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
          <p><strong>ID:</strong> {admin.id}</p>
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>

          <button
            onClick={logout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Logout
          </button>

          <button
            className="bg-neutral-200 px-4 py-2 font-bold rounded-lg mt-5 w-full hover:bg-neutral-300"
            onClick={() => navigate("/Admin/DashBoard")}
          >
            Dashboard
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-center mb-4">Admin Login</h2>
              {error && <p className="text-red-500">{error}</p>}

              <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Login
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-center mb-4">Verify OTP</h2>
              {error && <p className="text-red-500">{error}</p>}

              <input
                type="text"
                placeholder="Enter OTP"
                className="border p-2 w-full mb-2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <button
                onClick={handleVerifyOtp}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}


