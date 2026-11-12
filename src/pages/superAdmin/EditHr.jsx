import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const inputClass = (err, disabled) =>
  `w-full px-4 py-2.5 border rounded-xl outline-none transition placeholder-gray-400 text-sm ${
    disabled 
      ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" 
      : err 
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400 text-gray-700" 
        : "bg-[#F8FAFF] border-[#B3C9FF] focus:ring-2 focus:ring-indigo-400 text-gray-700"
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
export default function EditHr() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    empId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Fetch Initial Data ──────────────────────────────────────
  useEffect(() => {
    const fetchHR = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/hr/get/${id}`);
        if (data.success) {
          const hr = data.data;
          
          // Clean markdown from email if it exists
          let plainEmail = hr.email || "";
          if (typeof plainEmail === "string" && plainEmail.startsWith("[")) {
            plainEmail = plainEmail.replace(/\[(.*?)\]\(.*?\)/, "$1");
          }

          let plainPhone = hr.phone || "";
          if (plainPhone.startsWith("+91")) {
            plainPhone = plainPhone.replace("+91", "");
          }

          setForm({
            empId: hr.empId || "",
            firstName: hr.firstName || "",
            lastName: hr.lastName || "",
            email: plainEmail,
            phone: plainPhone,
            role: hr.role || "",
          });
        }
      } catch (error) {
        console.error("Error fetching HR details:", error);
        alert("Failed to load HR details");
      } finally {
        setLoading(false);
      }
    };
    fetchHR();
  }, [id]);

  // ── Handlers ──────────────────────────────────────────────
  const handleChange = (field, value) => {
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
      const response = await axiosInstance.patch(
        `/api/hr/update/${id}`,
        form
      );
      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.log("Update HR error:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || "Something went wrong during update.");
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading HR Details...</div>;
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[92vh] px-6 py-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#02027A] transition mb-4 w-fit"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <h1 className="text-2xl font-bold text-[#02027A]">
        Edit Human Resources Officer
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        Update the profile details of this HR member.
      </p>

      <div className="flex items-center gap-1 text-xs text-gray-400 mt-3 mb-4">
        <span>Home</span>
        <ChevronRight size={12} />
        <span>HR Management</span>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">Edit HR</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-3xl">
          <SectionHeader icon={User} title="HR Details" subtitle="Update the basic details and contact information." />

          <div className="space-y-4 -mt-2">
            <Field label="EMP ID" error={errors.empId}>
              <input
                value={form.empId}
                disabled={true}
                className={inputClass(errors.empId, true)}
              />
              <p className="text-[10px] text-gray-400 mt-1">Employee ID cannot be changed.</p>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={<>First Name <span className="text-red-500">*</span></>} error={errors.firstName}>
                <input
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Rahul"
                  className={inputClass(errors.firstName)}
                />
              </Field>

              <Field label={<>Last Name <span className="text-red-500">*</span></>} error={errors.lastName}>
                <input
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Sharma"
                  className={inputClass(errors.lastName)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={<>Email Address <span className="text-red-500">*</span></>} error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="rahul.sharma@example.com"
                  className={inputClass(errors.email)}
                />
              </Field>

              <Field label={<>Phone Number <span className="text-red-500">*</span></>} error={errors.phone}>
                <div className="flex items-center">
                  <span className={`px-4 py-2.5 border border-r-0 rounded-l-xl text-sm ${errors.phone ? "border-red-400 bg-red-50 text-red-500" : "bg-[#F8FAFF] border-[#B3C9FF] text-gray-500"}`}>
                    +91
                  </span>
                  <input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="9876543210"
                    className={`w-full px-4 py-2.5 border rounded-r-xl outline-none transition placeholder-gray-400 text-sm ${
                      errors.phone ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400 text-gray-700" : "bg-[#F8FAFF] border-[#B3C9FF] border-l-0 focus:ring-2 focus:ring-indigo-400 text-gray-700"
                    }`}
                  />
                </div>
              </Field>
            </div>

            <Field label={<>Role <span className="text-red-500">*</span></>} error={errors.role}>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition text-sm ${
                  !form.role ? "text-gray-400" : "text-gray-700"
                } ${errors.role ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400" : "border-[#B3C9FF] focus:ring-2 focus:ring-indigo-400"}`}
              >
                <option value="">Select Role</option>
                <option value="HR Executive">HR Executive</option>
                <option value="HR Manager">HR Manager</option>
                <option value="HR">HR</option>
                <option value="HR 2">HR 2</option>
                <option value="HR User">HR User</option>
                <option value="Client Admin">Client Admin</option>
                <option value="Manager">Manager</option>
                <option value="Verifier">Verifier</option>
              </select>
            </Field>
          </div>
        </div>
      </div>

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
          Save Changes
        </button>
      </div>

      {submitted && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Updated!</h2>
            <p className="text-gray-500 text-sm mb-8">
              HR "{form.empId}" details have been successfully updated.
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