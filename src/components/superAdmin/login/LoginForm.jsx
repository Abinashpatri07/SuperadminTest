import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../API/axiosInstance";
import { Eye, EyeOff } from "lucide-react";
import { clearAllAuthSessions } from "../../../utils/sessionManager";
/* ── LOGIN POPUP ─────────────────────────────────────────── */
function LoginPopup({ type, title, message, onClose }) {
  const isSuccess = type === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, isSuccess ? 3000 : 6000);
    return () => clearTimeout(timer);
  }, [onClose, isSuccess]);

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
        {!isSuccess && (
          <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/* ── SUPER ADMIN LOGIN FORM ──────────────────────────────── */
export default function SuperAdminLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp]           = useState("");
  const [step, setStep]         = useState(1); // 1 = Login, 2 = OTP
  const [popup, setPopup]       = useState(null); // { type, title, message }
  const [isLoading, setIsLoading] = useState(false);

  // Resend OTP countdown (60 seconds)
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendLoading, setResendLoading]   = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setPopup({ type: "success", title: "Notice", message: location.state.message });
      // Clear the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Start countdown when OTP step is shown
  useEffect(() => {
    if (step !== 2) return;
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleLogin = async () => {
    if (!email || !password) {
      setPopup({ type: "error", message: "Please enter email and password." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/auth/login", { email, password });
      
      if (response.data.success && response.data.requires2FA) {
        setPopup({ type: "success", title: "OTP Sent!", message: response.data.message });
        setStep(2); // Move to OTP step
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid email or password.";
      setPopup({ type: "error", title: "Login Failed", message: errorMsg });
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
      const response = await axiosInstance.post("/api/auth/verify-otp", { email, otp });
      
      if (response.data.success) {
        clearAllAuthSessions();
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("role", "super-admin");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        setPopup({ type: "success", title: "Login Successful!", message: `Welcome back, ${response.data.user.name}!` });
        setTimeout(() => navigate("/super-admin/home"), 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid or expired OTP.";
      setPopup({ type: "error", title: "Verification Failed", message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    setResendLoading(true);
    try {
      const response = await axiosInstance.post("/api/auth/resend-otp", { email });
      if (response.data.success) {
        setPopup({ type: "success", title: "OTP Resent!", message: response.data.message });
        // Restart countdown
        setResendCooldown(60);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) { clearInterval(interval); return 0; }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      setPopup({ type: "error", title: "Resend Failed", message: errorMsg });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm px-8">

      {/* POPUP */}
      {popup && (
        <LoginPopup
          type={popup.type}
          message={popup.message}
          title={popup.title}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Heading */}
      <h1 className="text-4xl font-black text-center tracking-widest uppercase text-gray-900 mb-1">
        Welcome
      </h1>

      <p className="text-center text-sm text-gray-500 mb-8">
        Super Admin Login Portal
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
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" />
              Remember me
            </label>
            <button
              onClick={() => navigate("/super-admin/forgot-password")}
              className="text-sm text-gray-500 hover:text-indigo-600"
            >
              Forgot password
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Log in"}
          </button>
        </>
      ) : (
        <>

          {/* OTP Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md px-4 py-2.5 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={6}
            />
          </div>

          {/* OTP validity hint */}
          <p className="text-xs text-gray-400 text-center mb-4">
            ⏱ OTP is valid for <strong>10 minutes</strong>
          </p>
          
          <button
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white py-3 rounded-lg font-medium mb-3 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend OTP */}
          <div className="text-center mb-3">
            {resendCooldown > 0 ? (
              <p className="text-xs text-gray-400">
                Didn't receive OTP? Resend in{" "}
                <span className="text-indigo-600 font-semibold">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
          
          <button
            onClick={() => setStep(1)}
            className="w-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-700 py-3 rounded-lg font-medium text-sm"
          >
            Back to Login
          </button>
        </>
      )}


    </div>
  );
}