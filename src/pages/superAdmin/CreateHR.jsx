import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import {
  ArrowLeft,
  ChevronRight,
  User,
  CheckCircle2,
} from "lucide-react";

// ── Field Component ──────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
        {error}
      </p>
    )}
  </div>
);

const inputClass = (err) =>
  `w-full px-4 py-2.5 bg-[#F8FAFF] border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400 text-gray-700 ${
    err ? "border-red-400 bg-red-50" : "border-[#B3C9FF]"
  }`;

// ── Section Header ───────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
        <Icon size={16} className="text-[#02027A]" />
      </div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    </div>
    {subtitle && (
      <p className="text-[11px] text-gray-400 mt-1 ml-10">{subtitle}</p>
    )}
  </div>
);

// ── Main Page ────────────────────────────────────────────────
export default function CreateHR() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    empId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Handlers ──────────────────────────────────────────────
  const handleChange = (field, value) => {
    // Restrict phone to numbers only
    if (field === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) return;
    }

    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.empId.trim()) e.empId = "EMP ID is required.";
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";

    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    } else if (form.phone.length !== 10) {
      e.phone = "Enter a valid 10-digit phone number.";
    }

    if (!form.role.trim()) e.role = "Role is required.";

    return e;
  };

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async () => {
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length > 0) return;

    try {
      const response = await axiosInstance.post(
        "/api/hr/create",
        form
      );

      console.log(response.data);
      setSubmitted(true);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[92vh] px-6 py-5">
      {/* ── BACK BUTTON ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#02027A] transition mb-4 w-fit"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* ── HEADER ── */}
      <h1 className="text-2xl font-bold text-[#02027A]">
        Create New Human Resources Officer
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        Add A New HR Member To The Platform
      </p>

      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mt-3 mb-4">
        <span>Home</span>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">Create HR</span>
      </div>

      {/* ── FORM CONTAINER ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-3xl">
          
          {/* SECTION 1: Personal Details */}
          <SectionHeader icon={User} title="HR Details" subtitle="Provide the basic details and contact information for the HR member." />

          <div className="space-y-4 -mt-2">
            <Field
              label={<>EMP ID <span className="text-red-500">*</span></>}
              error={errors.empId}
            >
              <input
                value={form.empId}
                onChange={(e) => handleChange("empId", e.target.value)}
                placeholder="ex-EMP_001"
                className={inputClass(errors.empId)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label={<>First Name <span className="text-red-500">*</span></>}
                error={errors.firstName}
              >
                <input
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Rahul"
                  className={inputClass(errors.firstName)}
                />
              </Field>

              <Field
                label={<>Last Name <span className="text-red-500">*</span></>}
                error={errors.lastName}
              >
                <input
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Sharma"
                  className={inputClass(errors.lastName)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label={<>Email Address <span className="text-red-500">*</span></>}
                error={errors.email}
              >
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="rahul.sharma@example.com"
                  className={inputClass(errors.email)}
                />
              </Field>

              <Field
                label={<>Phone Number <span className="text-red-500">*</span></>}
                error={errors.phone}
              >
                <div className="flex items-center">
                  <span className="px-4 py-2.5 bg-[#F8FAFF] border border-[#B3C9FF] border-r-0 rounded-l-xl text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 bg-[#F8FAFF] border border-[#B3C9FF] rounded-r-xl outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400 text-gray-700"
                  />
                </div>
              </Field>
            </div>

            <Field label={<>Role <span className="text-red-500">*</span></>} error={errors.role}>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition text-sm ${
                  !form.role ? "text-gray-400" : "text-gray-700"
                } ${errors.role ? "border-red-400 bg-red-50" : "border-[#B3C9FF]"}`}
              >
                <option value="">Select Role</option>
                <option value="HR Executive">HR Executive</option>
                <option value="HR Manager">HR Manager</option>
                <option value="HR">HR</option>
                <option value="HR 2">HR 2</option>
              </select>
            </Field>

            {/* NOTE */}
            <div className="bg-[#ECECFF] border border-indigo-300 rounded-xl p-3 mt-5">
              <p className="text-xs text-gray-700 leading-5">
                <span className="font-semibold text-indigo-700">Note:</span> A default password will
                be sent to the HR's registered email.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER BUTTONS ── */}
      <div className="max-w-3xl w-full mt-4 flex justify-end gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[#02027A] text-white text-sm font-semibold hover:bg-[#01016a] transition shadow-sm"
        >
          Create HR Member
        </button>
      </div>

      {/* ── SUCCESS MODAL ── */}
      {submitted && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-500 text-sm mb-8">
              HR "{form.empId}" Has Been Successfully Created And Is Now Available In The System.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                navigate("/super-admin/hr");
              }}
              className="w-full bg-[#02027A] text-white font-semibold py-3 rounded-xl hover:bg-[#01016a] transition cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
