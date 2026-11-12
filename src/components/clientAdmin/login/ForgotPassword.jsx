import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      setSuccessMsg("");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      setSuccessMsg("");
      return;
    }
    setError("");
    setSuccessMsg("Password reset link has been sent to your email.");
  };

  const handleResend = () => {
    if (!email.trim()) return;
    setSuccessMsg("Password reset link has been sent to your email.");
  };

  return (
    <div className="relative min-h-screen bg-[#EEF0F8] flex items-center justify-center overflow-hidden">

      {/* Top-right circle — outline only, partially cut off */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-28 border-[#C8CCEB]" />

      {/* Bottom-left organic blob */}
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#C8CCEB] rounded-[60%_40%_40%_60%/40%_40%_60%_60%]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-8 text-center">

        {/* Heading */}
        <h1 className="text-4xl font-black uppercase tracking-widest text-gray-900 mb-3">
          Forgot Your Password?
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          No worries — enter your registered email to receive a secure password reset link.
        </p>

        {/* Email field */}
        <div className="text-left mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setSuccessMsg("");
            }}
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}

          {/* Success — green, matches image */}
          {successMsg && (
            <p className="text-green-500 text-xs mt-1">{successMsg}</p>
          )}
        </div>

        {/* Send Reset Link button */}
        <button
          onClick={handleSend}
          className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white text-sm font-medium py-3 rounded-lg transition-all mt-3"
        >
          Send Reset Link
        </button>

        {/* Resend link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Didn't receive reset link?{" "}
          <span
            onClick={handleResend}
            className="text-indigo-500 hover:underline cursor-pointer"
          >
            Resend it.
          </span>
        </p>

        {/* Back to login */}
        {/* <p
          onClick={() => navigate("/login")}
          className="text-center text-xs text-gray-400 hover:text-indigo-500 cursor-pointer mt-6 transition-colors"
        >
          ← Back to Login
        </p> */}
      </div>
    </div>
  );
}