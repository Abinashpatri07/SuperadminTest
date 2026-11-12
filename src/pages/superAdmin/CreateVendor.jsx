import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import {
  ArrowLeft,
  ChevronRight,
  Building2,
  User,
  ShieldCheck,
  Info,
  CheckCircle2,
  X,
  Plus,
  MapPin,
} from "lucide-react";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

const SERVICES = [
  "Criminal Background Check",
  "Education Verification",
  "Prior Employment Check",
  "Identity & Address Verification",
  "Drug Test",
];

const MOCK_STATES = [
  { id: 1, name: "Maharashtra" },
  { id: 2, name: "Karnataka" },
  { id: 3, name: "Delhi" },
  { id: 4, name: "Gujarat" },
  { id: 5, name: "Tamil Nadu" },
];

const MOCK_CITIES = {
  1: [
    { id: 101, name: "Mumbai" },
    { id: 102, name: "Pune" },
    { id: 103, name: "Nagpur" },
    { id: 104, name: "Nashik" },
    { id: 105, name: "Thane" },
  ],
  2: [
    { id: 201, name: "Bangalore" },
    { id: 202, name: "Mysore" },
    { id: 203, name: "Hubli" },
    { id: 204, name: "Mangalore" },
    { id: 205, name: "Belgaum" },
  ],
  3: [
    { id: 301, name: "New Delhi" },
    { id: 302, name: "Dwarka" },
    { id: 303, name: "Rohini" },
    { id: 304, name: "Janakpuri" },
    { id: 305, name: "Karol Bagh" },
  ],
  4: [
    { id: 401, name: "Ahmedabad" },
    { id: 402, name: "Surat" },
    { id: 403, name: "Vadodara" },
    { id: 404, name: "Rajkot" },
    { id: 405, name: "Bhavnagar" },
  ],
  5: [
    { id: 501, name: "Chennai" },
    { id: 502, name: "Coimbatore" },
    { id: 503, name: "Madurai" },
    { id: 504, name: "Trichy" },
    { id: 505, name: "Salem" },
  ],
};

// ── Field ──────────────────────────────────────────────
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

// ── Section Header ─────────────────────────────────────
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

// ── Main Page ──────────────────────────────────────────
export default function CreateVendor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vendorName: "",
    cin: "",
    gst: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [coverageAreas, setCoverageAreas] = useState([
    { stateId: "", cityIds: [] },
  ]);

  const [errors, setErrors] = useState({});
  const [selectedServices, setSelectedServices] = useState({});
  const [serviceError, setServiceError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── Handlers ──────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handlePinCodeChange = (rawVal) => {
    const val = rawVal.replace(/\D/g, "").slice(0, 6);
    setForm((prev) => ({
      ...prev,
      pinCode: val,
    }));

    if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: "" }));

    if (val.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${val}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            const apiState = po.State || "";
            const apiCity = po.District || po.Block || po.Division || "";

            setForm((prev) => ({
              ...prev,
              state: apiState || prev.state,
              city: apiCity || prev.city,
            }));

            setErrors((prev) => ({ ...prev, state: "", city: "" }));
          }
        })
        .catch((err) => {
          console.warn("Vendor Pincode lookup error:", err);
        });
    }
  };

  const handleAddCoverage = () => {
    if (coverageAreas.length < 5) {
      setCoverageAreas([...coverageAreas, { stateId: "", cityIds: [] }]);
    }
  };

  const handleRemoveCoverage = (index) => {
    setCoverageAreas(coverageAreas.filter((_, i) => i !== index));
  };

  const handleCoverageStateChange = (index, val) => {
    const updated = [...coverageAreas];
    updated[index].stateId = val ? parseInt(val) : "";
    updated[index].cityIds = [];
    setCoverageAreas(updated);
  };

  const handleCoverageCityToggle = (index, cityId) => {
    const updated = [...coverageAreas];
    const cityList = updated[index].cityIds;
    if (cityList.includes(cityId)) {
      updated[index].cityIds = cityList.filter((c) => c !== cityId);
    } else {
      if (cityList.length < 5) {
        updated[index].cityIds = [...cityList, cityId];
      }
    }
    setCoverageAreas(updated);
  };

  const toggleService = (index) => {
    setSelectedServices((p) => ({
      ...p,
      [index]: p[index] !== undefined ? undefined : "",
    }));
    setServiceError("");
  };

  const handleSlaChange = (index, value) =>
    setSelectedServices((p) => ({ ...p, [index]: value }));

  // ── Validation ────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.vendorName.trim())
      e.vendorName = "Vendor company name is required.";

    const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
    if (form.cin && !cinRegex.test(form.cin.trim())) {
      e.cin = "Invalid CIN format.";
    }

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (form.gst && !gstRegex.test(form.gst.trim())) {
      e.gst = "Invalid GST number.";
    }

    if (!form.address1.trim()) e.address1 = "Address Line 1 is required.";
    if (!form.address2.trim()) e.address2 = "Address Line 2 is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim()) e.state = "State is required.";
    
    if (!form.pinCode.trim()) e.pinCode = "Pincode is required.";
    else if (!/^\d{6}$/.test(form.pinCode)) e.pinCode = "Pincode must be 6 digits.";

    const validCoverage = coverageAreas.filter((c) => c.stateId !== "");
    if (validCoverage.length === 0) {
      e.coverageAreas = "At least one valid coverage state is required.";
    }

    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";

    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address.";
    }

    const cleanDigits = (form.phone || "").replace(/\D/g, "");
    if (!cleanDigits) {
      e.phone = "Phone number is required.";
    } else if (cleanDigits.length < 10) {
      e.phone = "Enter a valid 10-digit phone number.";
    }

    const hasService = Object.values(selectedServices).some(
      (v) => v !== undefined
    );
    if (!hasService) setServiceError("Please select at least one service.");
    else setServiceError("");

    Object.entries(selectedServices).forEach(([idx, val]) => {
      if (val !== undefined && (!val || isNaN(val) || Number(val) <= 0))
        e[`sla_${idx}`] = "Enter valid days.";
    });

    return e;
  };

  // ── Save ──────────────────────────────────────────────
  const handleSave = async () => {
    const e = validate();
    setErrors(e);

    const hasService = Object.values(selectedServices).some(
      (v) => v !== undefined
    );

    if (Object.keys(e).length > 0 || !hasService) return;

    try {
      const validCoverage = coverageAreas.filter((c) => c.stateId !== "");

      let cleanPhone = (form.phone || "").replace(/\D/g, "");
      if (cleanPhone.length > 10) {
        cleanPhone = cleanPhone.slice(-10);
      }

      const finalData = {
        ...form,
        phone: cleanPhone,
        coverageAreas: validCoverage,
        services: selectedServices,
      };

      const response = await axiosInstance.post(
        "/api/vendor/create",
        finalData
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

  // ── Success Screen ─────────────────────────────────────
  return (
    <div className="flex flex-col h-[92vh] px-6 py-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#02027A] transition mb-4 w-fit"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <h1 className="text-2xl font-bold text-[#02027A]">Create A New Vendor</h1>
      <p className="text-sm text-gray-400 mt-1">
        Create a vendor account to outsource verification checks.
      </p>

      <div className="flex items-center gap-1 text-xs text-gray-400 mt-3 mb-4">
        <span>Vendor</span>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">Create Vendor</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-3xl">
          
          {/* ── SECTION 1: Company Details ── */}
          <SectionHeader icon={Building2} title="Company Details" />

          <div className="space-y-4 -mt-2">
            <Field
              label={
                <>Company Name <span className="text-red-500">*</span></>
              }
              error={errors.vendorName}
            >
              <input
                value={form.vendorName}
                onChange={(e) => handleChange("vendorName", e.target.value)}
                placeholder="Apex Background Screeners"
                className={inputClass(errors.vendorName)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="CIN" error={errors.cin}>
                <input
                  value={form.cin}
                  onChange={(e) => handleChange("cin", e.target.value)}
                  placeholder="U72900MH2021PTC364"
                  className={inputClass(errors.cin)}
                />
              </Field>

              <Field label="GST Number" error={errors.gst}>
                <input
                  value={form.gst}
                  onChange={(e) => handleChange("gst", e.target.value)}
                  placeholder="30QAZWS7788E1Z2"
                  className={inputClass(errors.gst)}
                />
              </Field>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── SECTION 2: Base Address ── */}
          <SectionHeader icon={MapPin} title="Base Address" />

          <div className="space-y-4 -mt-2">
            <Field label={<>Address Line 1 <span className="text-red-500">*</span></>} error={errors.address1}>
              <input
                value={form.address1}
                onChange={(e) => handleChange("address1", e.target.value)}
                placeholder="Unit 201, 2nd Floor, Apex Tower"
                className={inputClass(errors.address1)}
              />
            </Field>

            <Field label={<>Address Line 2 <span className="text-red-500">*</span></>} error={errors.address2}>
              <input
                value={form.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
                placeholder="Near Tech Park, MIDC"
                className={inputClass(errors.address2)}
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label={<>City <span className="text-red-500">*</span></>} error={errors.city}>
                <input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Mumbai"
                  className={inputClass(errors.city)}
                />
              </Field>

              <Field label={<>State <span className="text-red-500">*</span></>} error={errors.state}>
                <input
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="Maharashtra"
                  className={inputClass(errors.state)}
                />
              </Field>

              <Field label={<>Pincode <span className="text-red-500">*</span></>} error={errors.pinCode}>
                <input
                  value={form.pinCode}
                  onChange={(e) => handlePinCodeChange(e.target.value)}
                  placeholder="400001"
                  maxLength={6}
                  className={inputClass(errors.pinCode)}
                />
              </Field>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── SECTION 3: Coverage Area ── */}
          <SectionHeader icon={MapPin} title="Coverage Area" subtitle="Select up to 5 states and up to 5 cities per state." />
          
          <div className="space-y-4 -mt-2">
            {coverageAreas.map((coverage, idx) => {
              const availableCities = coverage.stateId ? MOCK_CITIES[coverage.stateId] || [] : [];
              return (
                <div key={idx} className="p-4 bg-[#F8FAFF] border border-[#B3C9FF] rounded-xl relative">
                  {coverageAreas.length > 1 && (
                    <button
                      onClick={() => handleRemoveCoverage(idx)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-500 transition bg-red-50 p-1 rounded-md"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <div className="mb-3 w-1/2">
                    <Field label={`Coverage State ${idx + 1}`}>
                      <select
                        value={coverage.stateId}
                        onChange={(e) => handleCoverageStateChange(idx, e.target.value)}
                        className={`w-full px-4 py-2.5 bg-white border border-[#B3C9FF] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition text-sm ${!coverage.stateId ? "text-gray-400" : "text-gray-700"}`}
                      >
                        <option value="">Select State</option>
                        {MOCK_STATES.map((state) => {
                          // Disable if already selected in another block
                          const isUsed = coverageAreas.some((c, cIdx) => cIdx !== idx && c.stateId === state.id);
                          return (
                            <option key={state.id} value={state.id} disabled={isUsed}>
                              {state.name}
                            </option>
                          );
                        })}
                      </select>
                    </Field>
                  </div>

                  {coverage.stateId && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Select Cities (Max 5)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableCities.map((city) => {
                          const isSelected = coverage.cityIds.includes(city.id);
                          const isDisabled = !isSelected && coverage.cityIds.length >= 5;
                          return (
                            <button
                              key={city.id}
                              onClick={() => handleCoverageCityToggle(idx, city.id)}
                              disabled={isDisabled}
                              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                                isSelected
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : isDisabled
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : "bg-white text-gray-600 border-[#B3C9FF] hover:bg-indigo-50"
                              }`}
                            >
                              {city.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {errors.coverageAreas && (
              <p className="text-[11px] text-red-500 mt-1">{errors.coverageAreas}</p>
            )}

            {coverageAreas.length < 5 && (
              <button
                onClick={handleAddCoverage}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition px-2 py-1"
              >
                <Plus size={16} /> Add Another State
              </button>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* ── SECTION 4: Primary Contact ── */}
          <SectionHeader icon={User} title="Primary Contact Person" />

          <div className="space-y-4 -mt-2">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={<>First Name <span className="text-red-500">*</span></>}
                error={errors.firstName}
              >
                <input
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Manav"
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
                  placeholder="Joshi"
                  className={inputClass(errors.lastName)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label={<>Contact Email <span className="text-red-500">*</span></>}
                error={errors.email}
              >
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="manav.joshi@example.com"
                  className={inputClass(errors.email)}
                />
              </Field>

              <Field
                label={<>Phone Number <span className="text-red-500">*</span></>}
                error={errors.phone}
              >
                <div className={`overflow-hidden rounded-xl border transition ${
                  errors.phone ? "border-red-300" : "border-[#B3C9FF]"
                }`}>
                  <PhoneInput
                    country={'in'}
                    value={form.phone}
                    countryCodeEditable={false}
                    onChange={(phone) => handleChange("phone", phone)}
                    enableSearch={true}
                    disableSearchIcon={true}
                    containerStyle={{
                      width: '100%',
                      border: 'none',
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '44px',
                      border: 'none',
                      background: '#F8FAFF',
                      fontSize: '14px',
                      paddingLeft: '48px',
                      borderRadius: '0.75rem',
                    }}
                    buttonStyle={{
                      border: 'none',
                      borderRight: '1px solid #B3C9FF',
                      background: '#F8FAFF',
                      padding: '0 4px',
                      borderTopLeftRadius: '0.75rem',
                      borderBottomLeftRadius: '0.75rem',
                    }}
                  />
                </div>
              </Field>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── SECTION 5: Services & SLA ── */}
          <SectionHeader
            icon={ShieldCheck}
            title="Services Offered & SLA"
            subtitle="Select the services this vendor provides and define the expected turnaround time (SLA) for each."
          />

          {serviceError && (
            <p className="text-[11px] text-red-500 -mt-3 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
              {serviceError}
            </p>
          )}

          <div className="space-y-2.5 -mt-2">
            {SERVICES.map((service, index) => {
              const isChecked = selectedServices[index] !== undefined;
              const slaErr = errors[`sla_${index}`];

              return (
                <div
                  key={index}
                  onClick={() => toggleService(index)}
                  className={`rounded-xl border px-4 py-3.5 transition-all cursor-pointer ${
                    isChecked
                      ? "border-[#02027A] bg-indigo-50/40 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#02027A] cursor-pointer"
                    />
                    <span className="flex-1 text-sm font-medium text-gray-800">
                      {service}
                    </span>

                    {isChecked && (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Info size={13} className="text-gray-400" />
                        <div
                          className={`flex items-center border rounded-lg overflow-hidden h-8 ${
                            slaErr ? "border-red-400" : "border-gray-300"
                          }`}
                        >
                          <input
                            type="number"
                            value={selectedServices[index]}
                            onChange={(e) => handleSlaChange(index, e.target.value)}
                            placeholder="10"
                            min="1"
                            className="w-14 px-2 text-sm text-center outline-none bg-white"
                          />
                          <div className="px-2.5 text-xs text-gray-500 border-l border-gray-300 h-full flex items-center bg-gray-50">
                            Days
                          </div>
                        </div>
                        {slaErr && (
                          <span className="text-[10px] text-red-500 whitespace-nowrap">
                            {slaErr}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
          Save Vendor Details
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {submitted && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-500 text-sm mb-8">
              The vendor has been successfully created.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                navigate(-1);
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
