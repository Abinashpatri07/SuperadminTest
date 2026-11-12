import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import {
  ArrowLeft,
  ChevronRight,
  Building2,
  User,
  ShieldCheck,
  Info,
  X,
  CheckCircle2,
} from "lucide-react";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

const ALL_SERVICES = [
  "Criminal Background Check",
  "Education Verification",
  "Prior Employment Check",
  "Identity & Address Verification",
  "Drug Test",
];

// ── City ID → Name lookup (matches CreateVendor MOCK_CITIES) ─────────────────
const CITY_MAP = {
  101: "Mumbai",    102: "Pune",        103: "Nagpur",   104: "Nashik",    105: "Thane",
  201: "Bangalore", 202: "Mysore",      203: "Hubli",    204: "Mangalore", 205: "Belgaum",
  301: "New Delhi", 302: "Dwarka",      303: "Rohini",   304: "Janakpuri", 305: "Karol Bagh",
  401: "Ahmedabad", 402: "Surat",       403: "Vadodara", 404: "Rajkot",    405: "Bhavnagar",
  501: "Chennai",   502: "Coimbatore",  503: "Madurai",  504: "Trichy",    505: "Salem",
};

// ── Tag Input ──────────────────────────────────────────
const TagInput = ({ tags, setTags, placeholder, error }) => {
  const [input, setInput] = useState("");

  const addTag = (val) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag) =>
    setTags(tags.filter((t) => t !== tag));

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      <div className={`min-h-11 w-full border rounded-lg px-3 py-2 flex flex-wrap gap-2 focus-within:ring-2 transition ${
        error ? "border-red-400 focus-within:ring-red-200 bg-red-50" : "border-gray-200 focus-within:ring-[#02027A]/20"
      }`}>
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition">
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-25 text-sm outline-none bg-transparent placeholder-gray-400"
        />
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{error}</p>}
    </div>
  );
};

// ── Field Wrapper ──────────────────────────────────────
const Field = ({ label, error, hint, children }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
    {children}
    {error && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{error}</p>}
    {hint && !error && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
  </div>
);

const inputClass = (err) =>
  `w-full h-11 border rounded-lg px-4 text-sm focus:outline-none focus:ring-2 transition ${
    err ? "border-red-400 focus:ring-red-200 bg-red-50" : "border-gray-200 focus:ring-[#02027A]/20"
  }`;

// ── Section Header ─────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
        <Icon size={16} className="text-[#02027A]" />
      </div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    </div>
    {subtitle && <p className="text-[11px] text-gray-400 mt-1 ml-10">{subtitle}</p>}
  </div>
);

// ── Main Page ──────────────────────────────────────────
export default function EditVendor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    vendorName: "",
    cin: "",
    gst: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});

  const [errors, setErrors] = useState({});
  const [serviceError, setServiceError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // State ID → Name lookup (IDs 1-5 = mock, 6-30 = proper Indian state IDs)
  const STATE_MAP = {
    1: "Maharashtra",   2: "Karnataka",      3: "Delhi",
    4: "Gujarat",       5: "Tamil Nadu",
    6: "Goa",           7: "Gujarat",         8: "Haryana",       9: "Himachal Pradesh",
    10: "Jharkhand",    11: "Karnataka",      12: "Kerala",
    13: "Madhya Pradesh", 14: "Maharashtra",  15: "Manipur",
    16: "Meghalaya",    17: "Mizoram",        18: "Nagaland",
    19: "Odisha",       20: "Punjab",         21: "Rajasthan",
    22: "Sikkim",       23: "Tamil Nadu",     24: "Telangana",
    25: "Tripura",      26: "Uttar Pradesh",  27: "Uttarakhand",
    28: "West Bengal",  29: "Delhi NCR",      30: "Jammu & Kashmir",
    36: "Telangana",
  };

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/api/vendor/${id}`);
        if (res.data.success) {
          const v = res.data.data;
          setForm({
            vendorName: v.company_name || "",
            cin: v.cin || "",
            gst: v.gst_number || "",
            fullName: `${v.poc_first_name} ${v.poc_last_name}`.trim(),
            email: v.poc_email || "",
            phone: (() => {
              const rawPhone = (v.poc_mobile || "").replace(/\D/g, "");
              return rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
            })(),
          });

          // Map coverage states & cities from structured coverage_areas
          const coverageAreasData = v.coverage_areas || [];
          const mappedStates = coverageAreasData.map(
            ca => STATE_MAP[ca.stateId] || `State ${ca.stateId}`
          );
          const mappedCities = [
            ...new Set(
              coverageAreasData.flatMap(ca =>
                ca.cityIds.map(cId => CITY_MAP[cId] || `City ${cId}`)
              )
            ),
          ];
          setStates(mappedStates);
          setCities(mappedCities);

          // Map services — index matches ALL_SERVICES order
          const srvObj = {};
          (v.services || []).forEach(s => {
            const index = ALL_SERVICES.indexOf(s.name);
            if (index !== -1) {
              // sla comes as "X day SLA" from API — parse the number
              const days = parseInt(s.sla);
              srvObj[index] = isNaN(days) ? "" : days;
            }
          });
          setSelectedServices(srvObj);
        }
      } catch (err) {
        console.error("Failed to load vendor details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const toggleService = (index) => {
    setSelectedServices((p) => {
      const updated = { ...p };
      if (updated[index] !== undefined) delete updated[index];
      else updated[index] = "";
      return updated;
    });
    setServiceError("");
  };

  const handleSlaChange = (index, value) =>
    setSelectedServices((p) => ({ ...p, [index]: value }));

  const validate = () => {
    const e = {};
    if (!form.vendorName.trim()) e.vendorName = "Vendor company name is required.";
    if (!form.gst.trim())        e.gst        = "GST number is required.";
    if (!form.fullName.trim())   e.fullName   = "Full name is required.";
    if (!form.email.trim())      e.email      = "Email is required.";
    const cleanDigits = (form.phone || "").replace(/\D/g, "");
    if (!cleanDigits) e.phone = "Phone number is required.";
    else if (cleanDigits.length < 10) e.phone = "Enter a valid 10-digit phone number.";

    const hasService = Object.keys(selectedServices).length > 0;
    if (!hasService) setServiceError("Please select at least one service.");
    else setServiceError("");

    return e;
  };

  const handleSave = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0 || Object.keys(selectedServices).length === 0) return;

    try {
      let cleanPhone = (form.phone || "").replace(/\D/g, "");
      if (cleanPhone.length > 10) {
        cleanPhone = cleanPhone.slice(-10);
      }

      const payload = {
        ...form,
        phone: cleanPhone,
        states,
        cities,
        services: selectedServices
      };
      
      const res = await axiosInstance.patch(`/api/vendor/update/${id}`, payload);
      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to update vendor:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-[92vh] bg-gray-50">

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#02027A] transition mb-4 w-fit"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-[#02027A]">Edit Vendor Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Edit client account to manage users and verifications.</p>

        {/* BREADCRUMB */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-3 mb-5">
          <span>Vendor</span>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Edit Vendor</span>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-7 max-w-3xl">

          {/* ── SECTION 1 ── */}
          <SectionHeader icon={Building2} title="Vendor Details & Coverage" />

          <div className="space-y-4 -mt-3">

            {/* ROW 1 — Company Name */}
            <div className="grid grid-cols-2 gap-4">
              <Field label={<>Vendor Company Name <span className="text-red-500">*</span></>} error={errors.vendorName}>
                <input
                  value={form.vendorName}
                  onChange={(e) => handleChange("vendorName", e.target.value)}
                  placeholder="Apex background screenners"
                  className={inputClass(errors.vendorName)}
                />
              </Field>
              <Field label={<>GST Number <span className="text-red-500">*</span></>} error={errors.gst}>
                <input
                  value={form.gst}
                  onChange={(e) => handleChange("gst", e.target.value)}
                  placeholder="30QAZWS7788E1Z2"
                  className={inputClass(errors.gst)}
                />
              </Field>
            </div>

            {/* ROW 1b — CIN (optional) */}
            <Field label="CIN (optional)" error={errors.cin}>
              <input
                value={form.cin}
                onChange={(e) => handleChange("cin", e.target.value.toUpperCase())}
                placeholder="U74999DL2026PTC123456"
                maxLength={21}
                className={inputClass(errors.cin)}
              />
            </Field>

            {/* ROW 2 — States + Cities (tag inputs) */}
            <div className="grid grid-cols-2 gap-4">
              <Field label={<>Coverage Area (States) <span className="text-red-500">*</span></>} error={errors.states}>
                <TagInput
                  tags={states}
                  setTags={setStates}
                  placeholder="Type state and press Enter"
                  error={errors.states}
                />
              </Field>
              <Field label={<>Coverage Area (Cities) <span className="text-red-500">*</span></>} error={errors.cities}>
                <TagInput
                  tags={cities}
                  setTags={setCities}
                  placeholder="Type city and press Enter"
                  error={errors.cities}
                />
              </Field>
            </div>

          </div>

          <hr className="border-gray-100" />

          {/* ── SECTION 2 ── */}
          <SectionHeader icon={User} title="Primary Contact Person" />

          <div className="space-y-4 -mt-3">
            <Field label={<>Full Name <span className="text-red-500">*</span></>} error={errors.fullName}>
              <input
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Manav Joshi"
                className={inputClass(errors.fullName)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={<>Contact Email <span className="text-red-500">*</span></>} error={errors.email} hint="Must be unique across the platform.">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="manav.joshi@example.com"
                  className={inputClass(errors.email)}
                />
              </Field>
              <Field label={<>Phone Number <span className="text-red-500">*</span></>} error={errors.phone} hint="Must be a unique active number.">
                <div className={`border rounded-lg transition ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                }`}>
                  <PhoneInput
                    country={'in'}
                    value={form.phone}
                    countryCodeEditable={false}
                    onChange={(phone) => handleChange("phone", phone)}
                    enableSearch={true}
                    disableSearchIcon={true}
                    inputStyle={{
                      width: '100%',
                      height: '38px',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '14px',
                      paddingLeft: '48px'
                    }}
                    buttonStyle={{
                      border: 'none',
                      background: '#f9fafb',
                      padding: '0 4px',
                      borderRight: '1px solid #e5e7eb'
                    }}
                  />
                </div>
              </Field>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ── SECTION 3 ── */}
          <SectionHeader
            icon={ShieldCheck}
            title="Services Offered & SLA"
            subtitle="Select The Services This Vendor Provides And Define The Expected Turnaround Time (SLA) For Each."
          />

          {serviceError && (
            <p className="text-[11px] text-red-500 -mt-4 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{serviceError}
            </p>
          )}

          <div className="space-y-2.5 -mt-3">
            {ALL_SERVICES.map((service, index) => {
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
                    <span className="flex-1 text-sm font-medium text-gray-800">{service}</span>

                    {isChecked && (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Info size={13} className="text-gray-400" />
                        <div className={`flex items-center border rounded-lg overflow-hidden h-8 ${slaErr ? "border-red-400" : "border-gray-300"}`}>
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
                        {slaErr && <span className="text-[10px] text-red-500">{slaErr}</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* FIXED BOTTOM BUTTONS */}
      <div className="bg-white border-t border-gray-100 px-8 py-4 flex justify-end gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
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
              The vendor details have been successfully updated.
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