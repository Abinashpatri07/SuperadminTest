import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../API/config.js";
import {
  User,
  KeyRound,
  LogOut,
  ChevronDown,
  ChevronUp,
  Bell,
  Eye,
  EyeOff,
  X,
  AlertCircle,
} from "lucide-react";
import { clearAllAuthSessions } from "../../utils/sessionManager";

// ── helpers ──────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Modal wrapper ─────────────────────────────────────────
function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-400 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

// ── Profile Modal ─────────────────────────────────────────
function ProfileModal({ user, onClose }) {
  return (
    <Modal title="Profile" subtitle="View Your Profile Details" onClose={onClose}>
      <div className="space-y-4">
        {[
          { label: "Name", value: user.name },
          { label: "Mail Id", value: user.email },
          { label: "Phone Number", value: user.phone || "+91 878 241 9830" },
          { label: "Role", value: user.role },
        ].map(({ label, value }) => (
          <div key={label}>
            <label className="text-sm text-gray-600 font-medium">{label}</label>
            <input
              readOnly
              value={value}
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="bg-[#02027A] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#01016a] transition"
        >
          Okay
        </button>
      </div>
    </Modal>
  );
}

// ── Change Password Modal ─────────────────────────────────
const PasswordField = ({ field, label, placeholder, form, errors, show, onToggle, onChange }) => (
  <div>
    <label className="text-sm text-gray-700 font-medium">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative mt-1">
      <input
        type={show[field] ? "text" : "password"}
        value={form[field]}
        placeholder={placeholder}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full border rounded-lg px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#02027A]/30 ${errors[field] ? "border-red-400" : "border-gray-200"
          }`}
      />
      <button
        type="button"
        onClick={() => onToggle(field)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
    {errors[field] && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {errors[field]}
      </p>
    )}
  </div>
);

// ── ChangePasswordModal ───────────────────────────────────
function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggle = (field) => setShow((p) => ({ ...p, [field]: !p[field] }));

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.current)
      e.current = "Current password is required.";
    if (form.newPass.length < 8)
      e.newPass = "Password must be at least 8 characters.";
    if (form.confirm !== form.newPass)
      e.confirm = "New password and confirm password do not match.";
    return e;
  };

  // Role ke hisaab se API endpoint determine karo
  const getEndpoint = () => {
    const path = window.location.pathname;
    if (path.includes("/super-admin")) return "/api/auth/change-password";
    if (path.includes("/vendor"))      return "/api/vendor/auth/change-password";
    if (path.includes("/admin"))       return "/api/client-admin/auth/change-password";
    if (path.includes("/candidate") || path.includes("/verification")) return "/api/candidate/auth/change-password";
    return "/api/hr/auth/change-password"; // HR / HR Manager / HR Executive / HR User
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setApiError("");
    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("vendorToken") ||
        localStorage.getItem("candidateToken");
      const baseUrl = API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}${getEndpoint()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.newPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch {
      setApiError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Password" subtitle="Set and reset your password" onClose={onClose}>
      {success ? (
        <div className="flex flex-col items-center py-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-green-700 font-semibold text-base">Password changed successfully!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <PasswordField
              field="current"
              label="Current Password"
              placeholder="Enter Your Current Password"
              form={form}
              errors={errors}
              show={show}
              onToggle={toggle}
              onChange={handleChange}
            />
            <PasswordField
              field="newPass"
              label="New Password"
              placeholder="Enter new password"
              form={form}
              errors={errors}
              show={show}
              onToggle={toggle}
              onChange={handleChange}
            />
            <PasswordField
              field="confirm"
              label="Confirm New Password"
              placeholder="Confirm new password"
              form={form}
              errors={errors}
              show={show}
              onToggle={toggle}
              onChange={handleChange}
            />
          </div>

          {apiError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-600">{apiError}</p>
            </div>
          )}

          <div className="mt-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            <p className="text-xs text-red-500 font-semibold mb-1">Note:</p>
            <p className="text-xs text-red-400">
              Your password must be at least 8 characters long and include a
              combination of letters, numbers, and special characters.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#02027A] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#01016a] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}


// ── Main Header ───────────────────────────────────────────
export default function Header() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadUser = () => {
    let storedUser = null;
    const path = location.pathname;

    try {
      if (path.includes("/super-admin")) {
        // Super Admin — always use "user" key, never vendor
        const superAdminData = localStorage.getItem("user");
        if (superAdminData) storedUser = JSON.parse(superAdminData);
      } else if (path.includes("/vendor")) {
        // Vendor portal — use vendorUser key
        const vendorData = localStorage.getItem("vendorUser");
        if (vendorData) storedUser = JSON.parse(vendorData);
      } else if (path.includes("/admin")) {
        // Client Admin
        const userData = localStorage.getItem("user");
        if (userData) storedUser = JSON.parse(userData);
      } else if (path.includes("/hr")) {
        // HR portal
        const userData = localStorage.getItem("user");
        if (userData) storedUser = JSON.parse(userData);
      } else {
        // Default fallback
        const normalUser = localStorage.getItem("user");
        if (normalUser) storedUser = JSON.parse(normalUser);
      }
    } catch (e) {
      console.error("Error loading user in Header:", e);
    }

    if (storedUser) {
      const derivedName =
        storedUser.name ||
        `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() ||
        `${storedUser.candidate_first_name || ""} ${storedUser.candidate_last_name || ""}`.trim() ||
        storedUser.fullName ||
        storedUser.poc_name ||
        storedUser.username ||
        (path.includes("/verification") ? "Candidate" : "");

      const derivedRole =
        storedUser.role ||
        (path.includes("/vendor") ? "Vendor" : path.includes("/verification") ? "Candidate" : "User");

      setUser({
        name: derivedName,
        email: storedUser.email || storedUser.poc_email || storedUser.candidate_email || "",
        role: derivedRole,
        avatar: storedUser.avatar || null,
        phone: storedUser.phone || storedUser.mobile || storedUser.candidate_mobile || storedUser.poc_mobile || ""
      });
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openModal = (type) => {
    setModal(type);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setDropdownOpen(false);

    // Clear all storage
    clearAllAuthSessions();

    // Redirect directly to central portal login page
    navigate("/portal-login?logout=true", { state: { message: "Logout Successful!" } });
  };

  const handleLogoClick = () => {
    const path = window.location.pathname;
    const role = localStorage.getItem("role") || "";
    const lowerRole = role.toLowerCase();

    if (path.includes("/super-admin") || lowerRole === "super-admin" || lowerRole === "super admin") {
      navigate("/super-admin/home");
    } else if (path.includes("/admin") || lowerRole === "admin" || lowerRole === "client admin" || lowerRole === "client_admin") {
      navigate("/admin/home");
    } else if (path.includes("/hr") || lowerRole.startsWith("hr")) {
      navigate("/hr/home");
    } else if (path.includes("/vendor") || lowerRole === "vendor") {
      navigate("/vendor/home");
    } else if (path.includes("/candidate") || path.includes("/verification") || lowerRole === "candidate") {
      navigate("/verification");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm z-40 relative">
        {/* LEFT — Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-24 w-auto object-contain cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={handleLogoClick}
            title="Go to Home"
          />
        </div>

        {/* Search */}
        <div className="flex ml-auto items-end bg-gray-100 rounded-full px-4 py-2 gap-2 w-72 ">
          <svg
            className="text-gray-800"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>

        {/* RIGHT — Bell + User dropdown */}
        <div className="flex items-center gap-4">
          {/* Bell */}
          <button className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <Bell size={16} className="text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-3 hover:bg-gray-50 px-2 py-1 rounded-xl transition"
            >
              {/* Avatar initials */}
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name || (location.pathname.includes("/vendor") ? "Vendor" : "User"))
                )}
              </div>

              <div className="leading-tight text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>

              {dropdownOpen ? (
                <ChevronUp size={14} className="text-gray-500" />
              ) : (
                <ChevronDown size={14} className="text-gray-500" />
              )}
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                <button
                  onClick={() => openModal("profile")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <User size={15} className="text-gray-400" />
                  Profile
                </button>

                <button
                  onClick={() => openModal("password")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <KeyRound size={15} className="text-gray-400" />
                  Change Password
                </button>

                <hr className="my-1 border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      {modal === "profile" && (
        <ProfileModal user={user} onClose={() => setModal(null)} />
      )}
      {modal === "password" && (
        <ChangePasswordModal onClose={() => setModal(null)} />
      )}
    </>
  );
}