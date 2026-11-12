import { API_BASE_URL } from "../../../API/config.js";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { clearAllAuthSessions } from "../../../utils/sessionManager";
/* ── LOGIN POPUP ─────────────────────────────────────────── */
function LoginPopup({ type, title, message, onClose }) {
  const isSuccess = type === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-[fadeIn_0.3s_ease-out]">
      <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg border-l-4 ${
        isSuccess ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
      }`}>
        {isSuccess ? (
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <div className="flex flex-col">
          <span className="font-bold">{title || (isSuccess ? "Success!" : "Failed")}</span>
          <span className="text-sm">{message}</span>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── CLIENT ADMIN LOGIN FORM ─────────────────────────────── */
export default function ClientAdminLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp]           = useState("");
  const [step, setStep]         = useState(1); // 1 = Login, 2 = OTP
  const [popup, setPopup]       = useState(null); // { type, title, message }
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setPopup({ type: "success", title: "Notice", message: location.state.message });
      // Clear the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async () => {
    if (!email || !password) {
      setPopup({ type: "error", title: "Input Required", message: "Please enter email and password." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/client-admin/auth/login`,
        { email, password }
      );
      
      if (response.data.success && response.data.requires2FA) {
        setPopup({ type: "success", title: "OTP Sent!", message: response.data.message });
        setStep(2); // Move to OTP step
      } else if (response.data.success) {
        // Fallback for older behavior
        localStorage.setItem("role", "admin");
        const userName = response.data.user?.name || "Client Admin";
        localStorage.setItem(
          "user",
          JSON.stringify({ name: userName, email: email, role: "Client Admin" })
        );
        setPopup({ type: "success", title: "Login Successful!", message: `Welcome back, ${userName}!` });
        setTimeout(() => navigate("/admin/home"), 1500);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setPopup({ 
        type: "error", 
        title: "Login Failed",
        message: error.response?.data?.message || "Invalid email or password." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setPopup({ type: "error", title: "Verification Failed", message: "Please enter the OTP." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/client-admin/auth/verify-otp`,
        { email, otp }
      );
      
      if (response.data.success) {
        clearAllAuthSessions();
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("role", "admin");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        setPopup({ type: "success", title: "Login Successful!", message: `Welcome back, ${response.data.user.name}!` });
        setTimeout(() => navigate("/admin/home"), 1500);
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      const errorMsg = error.response?.data?.message || "Invalid or expired OTP.";
      setPopup({ type: "error", title: "Verification Failed", message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm px-8">

      {/* POPUP */}
      {popup && (
        <LoginPopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}

      <h1 className="text-4xl font-black text-center tracking-widest uppercase text-gray-900 mb-1">
        Welcome
      </h1>
      <p className="text-center text-sm text-gray-500 mb-8">
        Client Admin login Portal
      </p>

      {step === 1 ? (
        <>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="mb-3 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between mb-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Remember me
            </label>
            <button
              onClick={() => navigate("/admin/forgot-password")}
              className="text-sm text-gray-500 hover:text-indigo-600"
            >
              Forgot password
            </button>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all text-white py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Log in"}
          </button>
        </>
      ) : (
        <>
          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
              Enter the OTP sent to your email
            </label>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md px-4 py-2.5 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={6}
            />
          </div>
          
          <button
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all text-white py-3 rounded-lg mb-3 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
          
          <button
            onClick={() => setStep(1)}
            className="w-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-700 py-3 rounded-lg text-sm"
          >
            Back to Login
          </button>
        </>
      )}

      

    </div>
  );
}