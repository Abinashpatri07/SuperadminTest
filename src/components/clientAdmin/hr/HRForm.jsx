import { API_BASE_URL } from "../../../API/config.js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../API/axiosInstance";

// ── Success Modal ───────────────────────────────────────
function SuccessModal({ onDone }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl overflow-hidden w-80 shadow-xl text-center">

        {/* Green wave top */}
        <div className="relative bg-green-400 h-28 flex items-center justify-center">
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-[50%]" />
          <div className="relative z-10">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              <path d="M17.5 10l1.5 1.5 3-3-1.5-1.5z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Submitted Successfully
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Your Information Has Been Submitted Successfully.
          </p>
          <button
            onClick={onDone}
            className="bg-green-500 hover:bg-green-600 text-white px-10 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Confirm Modal ───────────────────────────────────────
function ConfirmModal({ onBack, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl overflow-hidden w-80 shadow-xl text-center">

        {/* Blue wave top */}
        <div className="relative bg-[#3B4FE0] h-28 flex items-center justify-center">
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-[50%]" />
          <div className="relative z-10">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Are You Sure You Want To Submit This?
          </h2>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="border border-gray-300 text-gray-700 px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={onSubmit}
              className="bg-[#3B4FE0] hover:bg-[#2d3fc7] text-white px-8 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Submit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main Form ───────────────────────────────────────────
function HRForm({ mode = "view" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isView = mode === "view";

  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    empId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "HR",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHrDetails();
    }
  }, [id]);

  const fetchHrDetails = async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/api/client-admin/hr/get-all?clientId=1`);
      if (res.data.success) {
        const hr = res.data.data.find((item) => item.id === parseInt(id));
        if (hr) {
          setFormData({
            empId: hr.empId || "",
            firstName: hr.firstName || "",
            lastName: hr.lastName || "",
            email: hr.email || "",
            phone: hr.phone ? hr.phone.replace(/^\+91/, '') : "",
            role: hr.role || "HR",
            isActive: hr.isActive === 1,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch HR details", err);
    }
  };

  const handleChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoneClick = () => navigate("/admin/hr");
  const handleSuccessDone = () => navigate("/admin/hr");
  const handleSubmitClick = () => setShowConfirm(true);
  const handleConfirmBack = () => setShowConfirm(false);

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const res = await axiosInstance.patch(`${API_BASE_URL}/api/client-admin/hr/update/${id}`, formData);
      if (res.data.success) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Failed to update HR", err);
      alert(err.response?.data?.message || "Failed to update HR");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none disabled:bg-gray-50";

  return (
    <>
      {showSuccess && <SuccessModal onDone={handleSuccessDone} />}

      {showConfirm && (
        <ConfirmModal
          onBack={handleConfirmBack}
          onSubmit={handleConfirmSubmit}
        />
      )}

      <div className="max-w-xl bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

        {/* EMP ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5">
            EMP ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="empId"
            value={formData.empId}
            readOnly={true}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 outline-none"
          />
        </div>

        {/* NAME */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              readOnly={isView}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={isView}
              className={inputCls}
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly={true}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 outline-none"
          />
        </div>

        {/* PHONE */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <div className="px-3 py-2.5 bg-gray-100 text-sm border-r">+91</div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              readOnly={isView}
              className="w-full px-3 py-2.5 text-sm outline-none disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* ROLE */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1.5">
            Role <span className="text-red-500">*</span>
          </label>
          {isView ? (
            <input
              type="text"
              value={formData.role}
              readOnly={true}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 outline-none"
            />
          ) : (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
            >
              <option value="HR">HR</option>
              <option value="HR Manager">HR Manager</option>
            </select>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="border border-[#02027A] text-[#02027A] px-7 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 transition"
          >
            {isView ? "Back" : "Cancel"}
          </button>
          <button
  onClick={isView ? handleDoneClick : handleSubmitClick}
  className="bg-[#02027A] hover:bg-[#00005E] text-white px-8 py-2.5 rounded-xl text-sm font-medium transition"
>
  {isView ? "Done" : "Submit"}
</button>
        </div>

      </div>
    </>
  );
}

export default HRForm;