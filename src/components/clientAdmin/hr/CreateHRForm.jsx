import { API_BASE_URL } from "../../../API/config.js";
import { useState } from "react";
import axiosInstance from "../../../API/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

const ROLES = ["HR", "HR Manager", "HR Executive"];

function CreateHRForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    empId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [sendInvite, setSendInvite] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length > 10) return;
      setFormData({ ...formData, [name]: onlyNums });
      if (errors.phone) setErrors({ ...errors, phone: "" });
      return;
    }
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // VALIDATE
  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim())  newErrors.lastName  = "Last name is required";
    if (!formData.email.trim())     newErrors.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter valid email address";
    // PHONE
    const cleanPhone = (formData.phone || "").replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }
    if (!formData.role.trim())      newErrors.role      = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      let cleanPhone = (formData.phone || "").replace(/\D/g, "");
      if (cleanPhone.length > 10) {
        cleanPhone = cleanPhone.slice(-10);
      }
      // Default to clientId 1 for development as mentioned in the plan
      const payload = { ...formData, phone: cleanPhone, clientId: 1 };
      const res = await axiosInstance.post(`${API_BASE_URL}/api/client-admin/hr/create`, payload);
      if (res.data.success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrors({ ...errors, ...err.response.data.errors });
      } else {
        alert(err.response?.data?.message || "Failed to create HR");
      }
    }
  };

  // INPUT CLASS
  const inputCls = (err) =>
    `w-full border-2 rounded-xl px-4 py-3 outline-none text-sm transition focus:ring-2 focus:ring-indigo-200 ${
      err
        ? "border-red-300 bg-red-50"
        : "border-indigo-200 bg-[#F5F6FF] focus:border-indigo-400"
    }`;

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

      {/* EMP ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          EMP ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="empId"
          value={formData.empId}
          onChange={handleChange}
          placeholder="KJUUA-15424185"
          className={inputCls(false)}
        />
      </div>

      {/* FIRST + LAST NAME */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Deepti"
            className={inputCls(errors.firstName)}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Thakur"
            className={inputCls(errors.lastName)}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Deepti481@gmail.com"
          className={inputCls(errors.email)}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* PHONE */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className={`overflow-hidden border-2 rounded-xl transition ${
          errors.phone
            ? "border-red-300"
            : "border-indigo-200"
        }`}>
          <PhoneInput
            country={'in'}
            value={formData.phone}
            countryCodeEditable={false}
            onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
            enableSearch={true}
            disableSearchIcon={true}
            containerStyle={{
              width: '100%',
              border: 'none',
              background: errors.phone ? '#FEF2F2' : '#F5F6FF'
            }}
            inputStyle={{
              width: '100%',
              height: '46px',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              paddingLeft: '48px',
              borderRadius: '0.75rem',
            }}
            buttonStyle={{
              border: 'none',
              borderRight: '1px solid #C7D2FE',
              background: '#E0E7FF',
              padding: '0 4px',
              borderTopLeftRadius: '0.75rem',
              borderBottomLeftRadius: '0.75rem',
            }}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* ROLE */}
      <div className="mb-5 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Role <span className="text-red-500">*</span>
        </label>

        {/* TRIGGER */}
        <button
          type="button"
          onClick={() => setRoleOpen((p) => !p)}
          className={`w-full flex items-center justify-between border-2 rounded-xl px-4 py-3 text-sm text-left transition focus:outline-none ${
            errors.role
              ? "border-red-300 bg-red-50"
              : "border-indigo-200 bg-[#F5F6FF] focus:border-indigo-400"
          }`}
        >
          <span className={formData.role ? "text-gray-800" : "text-gray-400"}>
            {formData.role || "Select Role"}
          </span>
          {roleOpen
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />
          }
        </button>

        {/* DROPDOWN */}
        {roleOpen && (
          <div className="absolute left-0 right-0 mt-1 bg-white border-2 border-indigo-100 rounded-xl shadow-lg z-50 overflow-hidden">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, role: r });
                  setErrors({ ...errors, role: "" });
                  setRoleOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition ${
                  formData.role === r
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {errors.role && (
          <p className="text-red-500 text-xs mt-1">{errors.role}</p>
        )}
      </div>

      {/* SEND SYSTEM SETUP INVITATION */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Send System Setup Invitation
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Sends An Automated Email Invite Instantly To Set Password.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSendInvite((p) => !p)}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
            sendInvite ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            sendInvite ? "translate-x-5" : "translate-x-0"
          }`} />
        </button>
      </div>

      {/* NOTE */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-6">
        <p className="text-xs text-gray-700 leading-5">
          <span className="font-semibold">Note:</span> A Default Password Will
          Be Sent To The HR's Registered Email. The HR Can Use These Credentials
          To Log In And Access The System.
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-300 text-gray-700 px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#02027A] hover:bg-[#00005E] text-white px-8 py-2.5 rounded-xl text-sm font-medium transition"
        >
          Create HR
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-9999">
          <div className="relative bg-white w-96 rounded-3xl overflow-hidden shadow-2xl text-center pb-8">

            {/* GREEN TOP */}
            <div className="relative h-36 bg-lime-500 rounded-b-[50%] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-9 h-9 text-lime-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* CONTENT */}
            <div className="px-8 mt-6">
              <h2 className="text-2xl font-bold text-lime-500 leading-tight">
                HR "{formData.empId || "New"}"
                <br />
                Successfully Created.
              </h2>
              <p className="text-gray-500 text-sm mt-4 leading-6">
                The HR Details Have Been Saved Successfully And Are Now
                Available In The System.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/admin/hr");
                }}
                className="mt-5 border-2 border-lime-500 text-lime-500 hover:bg-lime-50 px-10 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Okay
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default CreateHRForm;