// src/components/clientAdmin/hr/HRForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Success Modal (View page) ───────────────────────────────────
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
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Submitted Successfully</h2>
          <p className="text-sm text-gray-500 mb-5">Your Information Has Been Submitted Successfully.</p>
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

// ── Confirm Modal (Edit page) ───────────────────────────────────
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

// ── Main Form ───────────────────────────────────────────────────
function HRForm({ mode = "view" }) {
  const navigate = useNavigate();
  const isView = mode === "view";

  const [showSuccess, setShowSuccess] = useState(false); // view page
  const [showConfirm, setShowConfirm] = useState(false); // edit page

  // VIEW: "Done" button → show success modal
  const handleDoneClick = () => setShowSuccess(true);

  // VIEW: "Done" inside success modal → redirect to HR list
  const handleSuccessDone = () =>
  navigate("/super-admin/hr");

  // EDIT: "Submit" button → show confirm modal
  const handleSubmitClick = () => setShowConfirm(true);

  // EDIT: "Back" inside confirm modal → close, stay on form
  const handleConfirmBack = () => setShowConfirm(false);

  // EDIT: "Submit" inside confirm modal → API call → redirect
  const handleConfirmSubmit = () => {

  setShowConfirm(false);

  navigate("/super-admin/hr");
};

  return (
    <>
      {/* View page modal */}
      {showSuccess && <SuccessModal onDone={handleSuccessDone} />}

      {/* Edit page modal */}
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
            value="KJUUA-15424185"
            disabled
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
              defaultValue="Deepti"
              disabled={isView}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Thakur"
              disabled={isView}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none disabled:bg-gray-50"
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
            defaultValue="Deepti481@gmail.com"
            disabled={isView}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none disabled:bg-gray-50"
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
              defaultValue="5487601549"
              disabled={isView}
              className="w-full px-3 py-2.5 text-sm outline-none disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* ROLE */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1.5">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            defaultValue="Recruiter"
            disabled={isView}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none disabled:bg-gray-50"
          />
        </div>

        {/* NOTE */}
        {/* <div className="bg-[#ECECFF] border border-indigo-300 rounded-xl p-3 mb-5">
          <p className="text-xs text-gray-700 leading-5">
            <span className="font-semibold">Note:</span>{" "}
            The HR will be notified via email if login credentials or access permissions are updated.
          </p>
        </div> */}

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