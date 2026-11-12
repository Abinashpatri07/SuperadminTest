import { API_BASE_URL } from "../../../API/config.js";
import React, { useState } from "react";
import { Building2, UserCircle, CheckCircle2 } from "lucide-react";
import axiosInstance from "../../../API/axiosInstance";
import { useNavigate } from "react-router-dom";
import PhoneInputPkg from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Helper to deduce state from first 2 digits of Indian 6-digit PIN code
const getStateFromPinPrefix = (pin) => {
  if (!pin || pin.length < 2) return null;
  const prefix2 = parseInt(pin.substring(0, 2), 10);
  if (prefix2 === 11) return "Delhi";
  if (prefix2 >= 12 && prefix2 <= 13) return "Haryana";
  if (prefix2 >= 14 && prefix2 <= 16) return "Punjab";
  if (prefix2 === 17) return "Himachal Pradesh";
  if (prefix2 >= 18 && prefix2 <= 19) return "Jammu and Kashmir";
  if (prefix2 >= 20 && prefix2 <= 28) return "Uttar Pradesh";
  if (prefix2 === 30 || (prefix2 >= 31 && prefix2 <= 34)) return "Rajasthan";
  if (prefix2 >= 36 && prefix2 <= 39) return "Gujarat";
  if (prefix2 >= 40 && prefix2 <= 44) return "Maharashtra";
  if (prefix2 === 40) return "Goa";
  if (prefix2 >= 45 && prefix2 <= 49) return "Madhya Pradesh";
  if (prefix2 >= 49 && prefix2 <= 49) return "Chhattisgarh";
  if (prefix2 >= 50 && prefix2 <= 53) return "Andhra Pradesh";
  if (prefix2 >= 50 && prefix2 <= 50) return "Telangana";
  if (prefix2 >= 56 && prefix2 <= 59) return "Karnataka";
  if (prefix2 >= 60 && prefix2 <= 64) return "Tamil Nadu";
  if (prefix2 >= 67 && prefix2 <= 69) return "Kerala";
  if (prefix2 >= 70 && prefix2 <= 74) return "West Bengal";
  if (prefix2 >= 75 && prefix2 <= 77) return "Odisha";
  if (prefix2 === 78) return "Assam";
  if (prefix2 === 79) return "Arunachal Pradesh";
  if (prefix2 >= 80 && prefix2 <= 85) return "Bihar";
  return null;
};

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2.5 bg-[#F8FAFF] border border-[#B3C9FF] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400 text-gray-700";

export default function CreateClientForm({ onSubmit, onCancel }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    cin: "",
    gst: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    plan: "standard",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handle = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePinCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    
    // When pincode is edited/cleared, update pinCode and reset dependent fields if cleared
    setForm((prev) => ({
      ...prev,
      pinCode: val,
      country: "India",
      ...(val.length < 6 ? {} : {}),
    }));

    if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: "" }));

    if (val.length === 6) {
      // 1. Check local prefix map first for instant auto-selection
      const localState = getStateFromPinPrefix(val);
      if (localState) {
        setForm((prev) => ({ ...prev, pinCode: val, state: localState, country: "India" }));
      }

      // 2. Query Postal PIN API for exact State, District (City) and Country
      fetch(`https://api.postalpincode.in/pincode/${val}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            const apiState = po.State || "";
            const apiCity = po.District || po.Block || po.Division || "";
            const apiCountry = po.Country || "India";
            
            // Override with newly fetched details for this specific new PIN code
            setForm((prev) => ({
              ...prev,
              state: apiState || prev.state,
              city: apiCity || prev.city,
              country: apiCountry,
            }));
            
            setErrors((prev) => ({ ...prev, state: "", city: "" }));
          }
        })
        .catch((err) => {
          console.warn("Postal PIN Code lookup failed, using fallback:", err);
        });
    }
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "companyName",
      "cin",
      "gst",
      "address1",
      "address2",
      "city",
      "state",
      "pinCode",
      "country",
      "firstName",
      "lastName",
      "email",
      "phone",
    ];

    requiredFields.forEach((key) => {
      if (!form[key] || !String(form[key]).trim()) {
        newErrors[key] = "This field is required";
      }
    });

    // Extra checks
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    const cleanDigits = (form.phone || "").replace(/\D/g, "");
    if (!cleanDigits || cleanDigits.length < 10) {
      newErrors.phone = "Valid phone number is required";
    }
    if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
      newErrors.pinCode = "Pin Code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      let cleanPhone = form.phone.replace(/\D/g, "");
      if (cleanPhone.length > 10) {
        cleanPhone = cleanPhone.slice(-10);
      }

      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/client/create-client`,
        {
          ...form,
          phone: cleanPhone,
        }
      );

      setShowSuccessModal(true);
      console.log(response.data);

      // RESET FORM
      setForm({
        companyName: "",
        cin: "",
        gst: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        plan: "standard",
      });

      setErrors({});
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    if (onSubmit) {
      onSubmit();
    } else {
      // Post successful creation, route to /super-admin/clients
      navigate("/super-admin/clients");
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/super-admin/clients");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col max-w-2xl h-150">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Company Information */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Company Information</h2>
          </div>
          <div className="flex flex-col gap-4">
            <Field label="Company Name" required error={errors.companyName}>
              <input
                className={inputCls}
                placeholder="DQNex Consultant"
                value={form.companyName}
                onChange={handle("companyName")}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="CIN" required error={errors.cin}>
                <input
                  className={inputCls}
                  placeholder="U74999KA2026PTC123456"
                  value={form.cin}
                  onChange={handle("cin")}
                />
              </Field>
              <Field label="GST Number" required error={errors.gst}>
                <input
                  className={inputCls}
                  placeholder="30QAZWS7788E1Z2"
                  value={form.gst}
                  onChange={handle("gst")}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Address Line 1" required error={errors.address1}>
                <input
                  className={inputCls}
                  placeholder="#214, 5th Cross, 2nd Main Road"
                  value={form.address1}
                  onChange={handle("address1")}
                />
              </Field>
              <Field label="Address Line 2" required error={errors.address2}>
                <input
                  className={inputCls}
                  placeholder="HSR Layout Sector 6"
                  value={form.address2}
                  onChange={handle("address2")}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Pin Code" required error={errors.pinCode}>
                <input
                  className={inputCls}
                  placeholder="560102"
                  value={form.pinCode}
                  maxLength={6}
                  onChange={handlePinCodeChange}
                />
              </Field>
              <Field label="State" required error={errors.state}>
                <select
                  className={inputCls}
                  value={form.state}
                  onChange={handle("state")}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" required error={errors.city}>
                <input
                  className={inputCls}
                  placeholder="Bengaluru"
                  value={form.city}
                  onChange={handle("city")}
                />
              </Field>
              <Field label="Country" required error={errors.country}>
                <input
                  className={inputCls}
                  placeholder="India"
                  value={form.country}
                  onChange={handle("country")}
                />
              </Field>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Primary Contact Person */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <UserCircle size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Primary Contact Person</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" required error={errors.firstName}>
                <input
                  className={inputCls}
                  placeholder="Manav"
                  value={form.firstName}
                  onChange={handle("firstName")}
                />
              </Field>
              <Field label="Last Name" required error={errors.lastName}>
                <input
                  className={inputCls}
                  placeholder="Joshi"
                  value={form.lastName}
                  onChange={handle("lastName")}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact Email" required error={errors.email}>
                <input
                  className={inputCls}
                  placeholder="manav.joshi@example.com"
                  value={form.email}
                  onChange={handle("email")}
                />
              </Field>
              <Field
                label="Phone Number"
                required
                error={errors.phone}
                hint="Must be a unique active number."
              >
                <div
                  className={`overflow-hidden rounded-xl border transition ${
                    errors.phone ? "border-red-300" : "border-[#B3C9FF]"
                  }`}
                >
                  <PhoneInput
                    country={"in"}
                    value={form.phone}
                    countryCodeEditable={false}
                    onChange={(phone) => {
                      setForm((prev) => ({ ...prev, phone }));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    enableSearch={true}
                    disableSearchIcon={true}
                    containerStyle={{
                      width: "100%",
                      border: "none",
                    }}
                    inputStyle={{
                      width: "100%",
                      height: "44px",
                      border: "none",
                      background: "#F8FAFF",
                      fontSize: "14px",
                      paddingLeft: "48px",
                      borderRadius: "0.75rem",
                    }}
                    buttonStyle={{
                      border: "none",
                      borderRight: "1px solid #B3C9FF",
                      background: "#F8FAFF",
                      padding: "0 4px",
                      borderTopLeftRadius: "0.75rem",
                      borderBottomLeftRadius: "0.75rem",
                    }}
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleCancelClick}
          className="border border-gray-300 text-gray-600 text-sm font-semibold px-8 py-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-700 text-white text-sm font-semibold px-8 py-2.5 rounded-xl hover:bg-indigo-800 transition cursor-pointer shadow-sm"
        >
          Create Client
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-500 text-sm mb-8">
              The client has been successfully created.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
