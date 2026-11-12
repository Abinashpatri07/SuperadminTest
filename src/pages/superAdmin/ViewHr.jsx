import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import {
  ArrowLeft,
  ChevronRight,
  User,
} from "lucide-react";

// ── Field Component ──────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">
      {label}
    </label>
    {children}
  </div>
);

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-600 text-sm cursor-not-allowed";

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
export default function ViewHr() {
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

  // ── Fetch Initial Data ──────────────────────────────────────
  useEffect(() => {
    const fetchHR = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/hr/get/${id}`);
        if (data.success) {
          const hr = data.data;
          
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
        View Human Resources Officer
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        Review the profile details of this HR member.
      </p>

      <div className="flex items-center gap-1 text-xs text-gray-400 mt-3 mb-4">
        <span>Home</span>
        <ChevronRight size={12} />
        <span>HR Management</span>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">View HR</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-3xl">
          <SectionHeader icon={User} title="HR Details" subtitle="Basic details and contact information." />

          <div className="space-y-4 -mt-2">
            <Field label="EMP ID">
              <input value={form.empId} disabled className={inputClass} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name">
                <input value={form.firstName} disabled className={inputClass} />
              </Field>

              <Field label="Last Name">
                <input value={form.lastName} disabled className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Email Address">
                <input value={form.email} disabled className={inputClass} />
              </Field>

              <Field label="Phone Number">
                <div className="flex items-center opacity-80">
                  <span className="px-4 py-2.5 bg-gray-50 border border-gray-200 border-r-0 rounded-l-xl text-sm text-gray-500">
                    +91
                  </span>
                  <input
                    value={form.phone}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 border-l-0 rounded-r-xl outline-none text-gray-600 text-sm cursor-not-allowed"
                  />
                </div>
              </Field>
            </div>

            <Field label="Role">
              <input value={form.role} disabled className={inputClass} />
            </Field>
          </div>
        </div>
      </div>

    </div>
  );
}