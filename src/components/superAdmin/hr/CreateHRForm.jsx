import { useState } from "react";
import axiosInstance from "../../../API/axiosInstance";
import { ChevronDown, ChevronUp, CheckCircle, Mail, Briefcase, PlusCircle, UserPlus, Info, Loader2 } from "lucide-react";
import axiosInstance from "../../../API/axiosInstance";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;
import { useNavigate } from "react-router-dom";

function CreateHRForm() {
  const navigate = useNavigate();

  // FORM STATE
  const [formData, setFormData] = useState({
    empId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  // ERROR STATE
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    // PHONE ONLY NUMBER
    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, "");

      if (onlyNums.length > 10) return;

      setFormData({
        ...formData,
        [name]: onlyNums,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // VALIDATE
  const validateForm = () => {
    let newErrors = {};

    // FIRST NAME
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // LAST NAME
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // EMAIL
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter valid email address";
    }

    // PHONE
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Phone number must be valid";
    }

    // ROLE
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
 const handleSubmit = async () => {

  // FRONTEND VALIDATION
  if (!validateForm()) return;

  try {
    let cleanPhone = (formData.phone || "").replace(/\D/g, "");
    if (cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(-10);
    }

    // API REQUEST
    const response = await axiosInstance.post(
      `/api/hr/create`,
      {
        ...formData,
        phone: cleanPhone,
      }
    );

    console.log(response.data);

    // SUCCESS MODAL
    setShowSuccessModal(true);

    // CLEAR ERRORS
    setErrors({});

  } catch (error) {

    console.log(error);

    // BACKEND VALIDATION ERRORS
    if (error.response?.data?.errors) {

      setErrors(error.response.data.errors);

    } else {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  }
};

  return (
    <div className="pl-32">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* EMP ID */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1.5">
            EMP ID <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="empId"
            value={formData.empId}
            onChange={handleChange}
            placeholder="ex-EMP_001"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm"
          />
        </div>

        {/* NAME */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* FIRST NAME */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className={`w-full border rounded-lg px-3 py-2.5 outline-none text-sm ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* LAST NAME */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Last Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className={`w-full border rounded-lg px-3 py-2.5 outline-none text-sm ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="abc@gmail.com"
            className={`w-full border rounded-lg px-3 py-2.5 outline-none text-sm ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1.5">
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
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1.5">
            Role <span className="text-red-500">*</span>
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2.5 outline-none text-sm bg-white ${
              errors.role ? "border-red-500" : "border-gray-300"
            }`}
          >
            {/* DEFAULT */}
            <option value="">Select Role</option>

            {/* OPTIONS */}
            <option value="HR">HR Excutive</option>

            <option value="HR 2">HR Manager</option>
          </select>

          {/* ERROR */}
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
          )}
        </div>

        {/* NOTE */}
        <div className="bg-[#ECECFF] border border-indigo-300 rounded-xl p-3 mb-5">
          <p className="text-xs text-gray-700 leading-5">
            <span className="font-semibold">Note:</span> A default password will
            be sent to the HR's registered email.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          {/* CANCEL */}
          <button
            onClick={() => navigate(-1)}
            className="border border-[#02027A] text-[#02027A] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 transition"
          >
            Cancel
          </button>

          {/* CREATE */}
          <button
            onClick={handleSubmit}
            className="bg-[#02027A] hover:bg-[#00005E] text-white px-8 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Create
          </button>
        </div>
        {/* SUCCESS MODAL */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-9999">
            <div className="relative bg-white w-125 rounded-[30px] overflow-hidden shadow-2xl text-center pb-7">
              {/* GREEN TOP */}
              <div className="relative h-36 bg-lime-500 rounded-b-[50%] flex items-center justify-center">
                {/* ICON */}
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-9 h-9 text-lime-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* CONTENT */}
              <div className="px-10 mt-6">
                {/* TITLE */}
                <h2 className="text-3xl font-bold text-lime-500 leading-tight">
                  HR "{formData.empId}"
                  <br />
                  Successfully Created.
                </h2>

                {/* DESCRIPTION */}
                <p className="text-gray-700 text-base leading-7 mt-5">
                  The HR Details Have Been Saved Successfully And Are Now
                  Available In The System.
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    setShowSuccessModal(false);

                    navigate("/super-admin/hr");
                  }}
                  className="mt-5 border-2 border-lime-500 text-lime-500 hover:bg-lime-50 px-10 py-2.5 rounded-xl text-base font-medium transition"
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateHRForm;