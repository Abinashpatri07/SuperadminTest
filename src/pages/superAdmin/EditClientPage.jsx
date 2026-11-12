import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  MapPin,
  UserCircle,
  Lock,
  ShieldCheck,
  Loader2,
  Save,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import PageHeader from "../../components/superAdmin/client/PageHeader";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

/* FIELD */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

/* INPUT CLASS */
const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition-all";

/* SECTION CARD */
function SectionCard({ icon: Icon, title, children, rightTag }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Icon size={14} className="text-indigo-700" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        </div>
        {rightTag && (
          <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
            {rightTag}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* MAIN PAGE */
export default function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState(null);

  const [form, setForm] = useState({
    clientId:     "",
    joinedDate:   "",
    companyName:  "",
    cin:          "",
    gst:          "",
    addressLine1: "",
    addressLine2: "",
    city:         "",
    state:        "",
    pincode:      "",
    pocFirstName: "",
    pocLastName:  "",
    contactEmail: "",
    contactPhone: "",
    isActive:     1,
  });

  /* ── FETCH CLIENT DATA ── */
  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const res = await axiosInstance.get(`/api/client/get-client/${id}`);
      if (res.data.success) {
        const c = res.data.data;
        setForm({
          clientId:     `CLT${c.id}`,
          joinedDate:   c.created_at
            ? new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : "—",
          companyName:  c.companyName  || "",
          cin:          c.cin          || "",
          gst:          c.gst          || "",
          addressLine1: c.addressLine1 || "",
          addressLine2: c.addressLine2 || "",
          city:         c.city         || "",
          state:        c.state        || "",
          pincode:      c.pincode      || "",
          pocFirstName: c.pocFirstName || "",
          pocLastName:  c.pocLastName  || "",
          contactEmail: c.contactEmail || "",
          contactPhone: (() => {
            const rawDigits = (c.contactPhone || "").replace(/\D/g, "");
            return rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
          })(),
          isActive:     c.is_active    ?? 1,
          isSuspend:    c.is_suspend   ?? 0,
        });
      } else {
        setFetchError("Client not found.");
      }
    } catch (err) {
      console.error("Error fetching client:", err);
      setFetchError("Failed to load client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm((prev) => ({ ...prev, pincode: val }));
    if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: "" }));

    if (val.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${val}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            const apiCity = po.District || po.Block || po.Division || "";
            const apiState = po.State || "";
            setForm((prev) => ({
              ...prev,
              city: apiCity || prev.city,
              state: apiState || prev.state,
            }));
          }
        })
        .catch((err) => {
          console.warn("Pincode lookup error:", err);
        });
    }
  };

  /* ── SAVE ── */
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrors({});

      let cleanPhone = (form.contactPhone || "").replace(/\D/g, "");
      if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);
      if (cleanPhone && cleanPhone.length !== 10) {
        setErrors((prev) => ({ ...prev, contactPhone: "Phone number must be 10 digits" }));
        setIsSaving(false);
        return;
      }

      const payload = {
        companyName:  form.companyName  || undefined,
        cin:          form.cin          || undefined,
        gst:          form.gst          || undefined,
        addressLine1: form.addressLine1 || undefined,
        addressLine2: form.addressLine2 || undefined,
        city:         form.city         || undefined,
        state:        form.state        || undefined,
        pincode:      form.pincode      || undefined,
        pocFirstName: form.pocFirstName || undefined,
        pocLastName:  form.pocLastName  || undefined,
        contactEmail: form.contactEmail || undefined,
        contactPhone: cleanPhone        || undefined,
        isActive:     form.isActive,
      };

      const res = await axiosInstance.patch(
        `/api/client/update-client/${id}`,
        payload
      );

      if (res.data.success) {
        navigate("/super-admin/clients");
      }
    } catch (err) {
      console.error("Error updating client:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || "Failed to update client." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  /* ── LOADING ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">{fetchError}</p>
          <button
            onClick={() => navigate("/super-admin/clients")}
            className="bg-indigo-900 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-indigo-800 transition"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  const statusLabel =
    form.isSuspend === 1 ? "Suspended" :
    form.isActive === 1 ? "Active" : "Inactive";

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-4">

      {/* HEADER ROW */}
      <div className="flex items-start justify-between mb-5">
        <PageHeader
          title="Edit Client Profile"
          subtitle=""
          breadcrumb1="Client"
          breadcrumb2="Edit Client"
          backPath="/super-admin/clients"
        />

        {/* ACCOUNT STATUS */}
        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium mt-10">
          <ShieldCheck size={15} />
          Account Status: {statusLabel}
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {errors.general}
        </div>
      )}

      {/* MAIN CARD */}
      <div className="bg-white border border-gray-200 rounded-xl w-3xl flex flex-col h-150">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">

            {/* SYSTEM IDENTIFIERS */}
            <SectionCard icon={Lock} title="System Identifiers" rightTag="Read only">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Client ID">
                  <input
                    value={form.clientId}
                    disabled
                    className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
                  />
                </Field>
                <Field label="Joined Date">
                  <input
                    value={form.joinedDate}
                    disabled
                    className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* COMPANY INFORMATION */}
            <SectionCard icon={Building2} title="Company Information">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Company Name">
                  <input
                    value={form.companyName}
                    onChange={handleChange("companyName")}
                    className={inputCls}
                  />
                  {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
                </Field>
                <Field label="CIN (Corporate Identification Number)">
                  <input
                    value={form.cin}
                    onChange={handleChange("cin")}
                    className={inputCls}
                  />
                  {errors.cin && <p className="text-xs text-red-500 mt-1">{errors.cin}</p>}
                </Field>
                <Field label="GST Number">
                  <input
                    value={form.gst}
                    onChange={handleChange("gst")}
                    className={inputCls}
                  />
                  {errors.gst && <p className="text-xs text-red-500 mt-1">{errors.gst}</p>}
                </Field>
                <Field label="Account Status">
                  <select
                    value={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: parseInt(e.target.value) })}
                    className={inputCls}
                  >
                    <option value={1}>Active</option>
                    <option value={2}>Inactive</option>
                    <option value={3}>Suspended</option>
                  </select>
                </Field>
              </div>
            </SectionCard>

            {/* REGISTERED ADDRESS */}
            <SectionCard icon={MapPin} title="Registered Address">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Address Line 1">
                  <input
                    value={form.addressLine1}
                    onChange={handleChange("addressLine1")}
                    className={inputCls}
                  />
                </Field>
                <Field label="Address Line 2">
                  <input
                    value={form.addressLine2}
                    onChange={handleChange("addressLine2")}
                    className={inputCls}
                  />
                </Field>
                <Field label="City">
                  <input
                    value={form.city}
                    disabled
                    readOnly
                    className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`}
                  />
                </Field>
                <Field label="State">
                  <input
                    value={form.state}
                    disabled
                    readOnly
                    className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`}
                  />
                </Field>
                <Field label="Pin Code">
                  <input
                    value={form.pincode}
                    onChange={handlePincodeChange}
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    className={inputCls}
                  />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </Field>
              </div>
            </SectionCard>

            {/* PRIMARY CONTACT PERSON */}
            <SectionCard icon={UserCircle} title="Primary Contact Person">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name">
                  <input
                    value={form.pocFirstName}
                    onChange={handleChange("pocFirstName")}
                    className={inputCls}
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    value={form.pocLastName}
                    onChange={handleChange("pocLastName")}
                    className={inputCls}
                  />
                </Field>
                <Field label="Contact Email">
                  <input
                    value={form.contactEmail}
                    onChange={handleChange("contactEmail")}
                    className={inputCls}
                  />
                  {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
                </Field>
                <Field label="Phone Number (10 digits)">
                  <div className={`border rounded-lg transition ${
                    errors.contactPhone ? "border-red-300" : "border-gray-300"
                  }`}>
                    <PhoneInput
                      country={'in'}
                      value={form.contactPhone}
                      countryCodeEditable={false}
                      onChange={(phone) => {
                        setForm((prev) => ({ ...prev, contactPhone: phone }));
                        if (errors.contactPhone) setErrors((prev) => ({ ...prev, contactPhone: "" }));
                      }}
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
                  {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>}
                </Field>
              </div>
            </SectionCard>

          </div>
        </div>

        {/* Fixed footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-white">
          <button
            onClick={() => navigate(-1)}
            disabled={isSaving}
            className="border border-indigo-700 text-indigo-700 px-8 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-900 text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-indigo-800 transition flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>

    </div>
  );
}