import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../API/axiosInstance";

function SignupPopup({ type, title, message, onClose }) {
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

export default function ClientAdminSignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    captchaAnswer: "",
  });

  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [popup, setPopup] = useState(null); // { type, title, message }
  const [isLoading, setIsLoading] = useState(false);

  // Generate random numbers for captcha
  const generateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
    });
    setFormData(prev => ({ ...prev, captchaAnswer: "" }));
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    // Basic validations
    if (!formData.firstName || !formData.lastName || !formData.companyName || !formData.email || !formData.password || !formData.captchaAnswer) {
      setPopup({ type: "error", title: "Missing Fields", message: "Please fill in all required fields." });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setPopup({ type: "error", title: "Validation Error", message: "Passwords do not match." });
      return;
    }

    // Captcha validation
    if (parseInt(formData.captchaAnswer) !== captcha.num1 + captcha.num2) {
      setPopup({ type: "error", title: "Validation Error", message: "Incorrect Captcha answer. Please try again." });
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    try {
      // Temporarily mock the signup success for frontend-only
      // Once backend is ready, this will be:
      // const response = await axiosInstance.post("/api/auth/super-admin/signup", formData);
      
      setTimeout(() => {
        setPopup({ type: "success", title: "Account Created!", message: "Client Admin account successfully created. Please login." });
        setTimeout(() => navigate("/admin/login"), 2000);
      }, 1000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create account.";
      setPopup({ type: "error", title: "Signup Failed", message: errorMsg });
      setIsLoading(false);
      generateCaptcha();
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md px-8 max-h-screen overflow-y-auto py-8">

      {popup && (
        <SignupPopup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Heading */}
      <h1 className="text-3xl font-black text-center tracking-widest uppercase text-gray-900 mb-1">
        Create Account
      </h1>

      <p className="text-center text-sm text-gray-500 mb-6">
        Client Admin Registration Portal
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Company Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
        <input
          type="text"
          name="companyName"
          placeholder="e.g. Acme Corp"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input
          type="email"
          name="email"
          placeholder="admin@bgv.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Mobile */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
        <input
          type="text"
          name="mobile"
          placeholder="9876543210"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm *</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Captcha */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
          <span>Solve Captcha *</span>
          <span className="text-xs text-indigo-500 font-normal">Security Verification</span>
        </label>
        <div className="flex gap-2">
          <div className="flex-shrink-0 bg-indigo-50 border border-indigo-200 rounded-md px-4 py-2.5 font-bold text-gray-800 flex items-center justify-center">
            {captcha.num1} + {captcha.num2} = ?
          </div>
          <input
            type="number"
            name="captchaAnswer"
            placeholder="Answer"
            value={formData.captchaAnswer}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Signup Button */}
      <button
        onClick={handleSignup}
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <span 
          className="text-indigo-600 cursor-pointer hover:underline font-medium"
          onClick={() => navigate("/admin/login")}
        >
          Log In
        </span>
      </p>

    </div>
  );
}
