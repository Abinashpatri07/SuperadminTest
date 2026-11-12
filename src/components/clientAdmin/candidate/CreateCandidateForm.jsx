import { useState } from "react";
import axiosInstance from "../../../API/axiosInstance";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

function CreateCandidateForm() {
  const navigate = useNavigate();

  const [phoneMessage, setPhoneMessage]     = useState("");
  const [emailMessage, setEmailMessage]     = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError]     = useState("");
  const [loading, setLoading]               = useState(false);
  const [holdWarning, setHoldWarning]       = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  // ── SUBMIT ─────────────────────────────────────────────
  const onSubmit = async (data) => {
    setLoading(true);
    setPhoneMessage("");
    setEmailMessage("");
    setSuccessMessage("");
    setGeneralError("");
    setHoldWarning("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const createdById = storedUser.id || 2;
      const cmId = storedUser.client_id || 1;

      let normalizedPhone = (data.phone || "").toString().replace(/[\s\-()+]/g, "");
      if (normalizedPhone.startsWith("91") && normalizedPhone.length === 12) {
        normalizedPhone = normalizedPhone.slice(2);
      }

      const response = await axiosInstance.post(
        `/api/client-admin/candidate/create`,
        {
          firstName:     data.firstName?.trim(),
          lastName:      data.lastName?.trim(),
          phone:         normalizedPhone,
          email:         data.email?.trim().toLowerCase(),
          jobFunction:   data.jobFunction?.trim() || "",
          candidateExperience: data.candidateExperience || "1",
          tag:           data.tag?.trim() || "",
          createdByRole: "client_admin",
          clientAdminId: createdById,
          cmId:          cmId,
        }
      );

      if (response.data.success) {
        const caseId = response.data.caseId || response.data.data?.case_id || "BGV";
        if (response.data.isOnHold) {
          // Candidate created but put on hold due to insufficient credits
          setHoldWarning(
            `⚠️ Candidate created (${caseId}) but placed ON HOLD due to insufficient billing credits. Please recharge your wallet to proceed.`
          );
        } else {
          setSuccessMessage(`Candidate Created Successfully! Case ID: ${caseId} ✅${
            response.data.creditMessage ? ` | ${response.data.creditMessage}` : ""
          }`);
        }
        reset();
        setTimeout(() => navigate("/admin/candidates"), 3000);
      }

    } catch (error) {
      const errData = error.response?.data;
      if (errData?.field === "phone") {
        setPhoneMessage(errData.message);
      } else if (errData?.field === "email") {
        setEmailMessage(errData.message);
      } else if (errData?.errors) {
        if (errData.errors.phone) setPhoneMessage(errData.errors.phone);
        if (errData.errors.email) setEmailMessage(errData.errors.email);
        const firstError = Object.values(errData.errors)[0];
        setGeneralError(firstError || "Validation failed.");
      } else if (errData?.message) {
        setGeneralError(errData.message);
      } else {
        setGeneralError("Something went wrong. Ensure backend is running and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── INPUT CLASS ────────────────────────────────────────
  const inputCls = (err) =>
    `w-full border-2 rounded-xl px-4 py-3 outline-none text-sm transition focus:ring-2 focus:ring-indigo-100 ${
      err
        ? "border-red-300 bg-red-50"
        : "border-indigo-200 bg-[#F5F6FF] focus:border-indigo-400"
    }`;

  return (
    <div className="p-6">

      {/* BACK + HEADING */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/candidates")}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create Candidate</h1>
          <p className="text-sm text-gray-500">Fill in the details to add a new candidate</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

      {/* SUCCESS MODAL */}
      {successMessage && (
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
                Candidate "{getValues("firstName")} {getValues("lastName")}"
                <br />
                Successfully Created.
              </h2>
              <p className="text-gray-500 text-sm mt-4 leading-6">
                The Candidate Details Have Been Saved Successfully And Are Now
                Available In The System.
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/candidates")}
                className="mt-5 border-2 border-lime-500 text-lime-500 hover:bg-lime-50 px-10 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOLD WARNING MODAL — Candidate created but on hold due to zero credits */}
      {holdWarning && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-9999">
          <div className="relative bg-white w-96 rounded-3xl overflow-hidden shadow-2xl text-center pb-8">
            {/* ORANGE TOP */}
            <div className="relative h-36 bg-orange-500 rounded-b-[50%] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
            </div>
            {/* CONTENT */}
            <div className="px-8 mt-6">
              <h2 className="text-xl font-bold text-orange-500 leading-tight">Candidate On Hold</h2>
              <p className="text-gray-600 text-sm mt-4 leading-6">
                Candidate was created but placed <strong>On Hold</strong> due to insufficient billing credits.
                Please recharge your wallet to proceed with verification.
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/billing")}
                className="mt-5 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-10 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Recharge Wallet
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/candidates")}
                className="mt-3 block mx-auto text-gray-400 text-xs hover:underline"
              >
                Go to Candidates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERAL ERROR BANNER */}
      {generalError && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded-xl flex items-center gap-2">
          {generalError}
        </div>
      )}

          {/* FIRST NAME + LAST NAME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First/Middle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Rahul"
                className={inputCls(errors.firstName)}
                {...register("firstName", {
                  required: "First name is required",
                  pattern: { value: /^[A-Za-z\s]+$/, message: "Only alphabets allowed" },
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Sharma"
                className={inputCls(errors.lastName)}
                {...register("lastName", {
                  required: "Last name is required",
                  pattern: { value: /^[A-Za-z\s]+$/, message: "Only alphabets allowed" },
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 rounded-xl transition ${
              errors.phone ? "border-red-300" : "border-indigo-200"
            }`}>
              <Controller
                name="phone"
                control={control}
                rules={{ 
                  required: "Phone number is required",
                  minLength: { value: 10, message: "Phone number is too short" }
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country={'in'}
                    countryCodeEditable={false}
                    enableSearch={true}
                    disableSearchIcon={true}
                    inputStyle={{
                      width: '100%',
                      height: '46px',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '14px',
                      paddingLeft: '48px'
                    }}
                    buttonStyle={{
                      border: 'none',
                      background: '#E0E7FF', // indigo-100
                      padding: '0 4px'
                    }}
                    containerStyle={{
                      background: errors.phone ? '#FEF2F2' : '#F5F6FF'
                    }}
                  />
                )}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
            {phoneMessage && (
              <p className="text-red-500 text-xs mt-1">{phoneMessage}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="abc@example.com"
              className={inputCls(errors.email)}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
            {emailMessage && (
              <p className="text-red-500 text-xs mt-1">{emailMessage}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Candidate will receive login credentials at this email
            </p>
          </div>

          {/* FUNCTION + TAG */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Function <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="IT"
                className={inputCls(errors.jobFunction)}
                {...register("jobFunction", {
                  required: "Function is required",
                })}
              />
              {errors.jobFunction && (
                <p className="text-red-500 text-xs mt-1">{errors.jobFunction.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tag <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="May Batch"
                className={inputCls(errors.tag)}
                {...register("tag", {
                  required: "Tag is required",
                })}
              />
              {errors.tag && (
                <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>
              )}
            </div>
          </div>

          {/* EXPERIENCE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls(errors.candidateExperience)}
              {...register("candidateExperience", { required: "Experience is required" })}
            >
              <option value="1">Fresher</option>
              <option value="2">Experienced</option>
            </select>
            {errors.candidateExperience && (
              <p className="text-red-500 text-xs mt-1">{errors.candidateExperience.message}</p>
            )}
          </div>

          {/* NOTE */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-700 leading-5">
              <span className="font-semibold">Note:</span> A Default Password Will Be Sent To The
              Candidate's Email. The Candidate Can Use These Credentials To Login And Complete
              Their Verification Profile.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#02027A] text-white py-3 rounded-xl hover:bg-indigo-900 disabled:opacity-60 transition font-medium text-sm"
            >
              {loading ? "Creating..." : "Create Candidate"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/candidates")}
              className="border-2 border-indigo-200 text-indigo-700 py-3 rounded-xl hover:bg-indigo-50 transition font-medium text-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateCandidateForm;
