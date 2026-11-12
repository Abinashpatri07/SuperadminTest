import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  User,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Award,
  Building2,
  Loader2,
} from "lucide-react";

// ── State ID → Name lookup ─────────────────────────────────
// IDs 1-5 are the mock IDs used by CreateVendor
// IDs 6-30 are proper Indian state IDs
const STATE_MAP = {
  1: "Maharashtra",     2: "Karnataka",       3: "Delhi",
  4: "Gujarat",         5: "Tamil Nadu",
  6: "Goa",             7: "Gujarat",          8: "Haryana",          9: "Himachal Pradesh",
  10: "Jharkhand",      11: "Karnataka",      12: "Kerala",
  13: "Madhya Pradesh", 14: "Maharashtra",    15: "Manipur",
  16: "Meghalaya",      17: "Mizoram",        18: "Nagaland",
  19: "Odisha",         20: "Punjab",         21: "Rajasthan",
  22: "Sikkim",         23: "Tamil Nadu",     24: "Telangana",
  25: "Tripura",        26: "Uttar Pradesh",  27: "Uttarakhand",
  28: "West Bengal",    29: "Delhi NCR",      30: "Jammu & Kashmir",
  36: "Telangana",
};

// ── Quality Score Ring ─────────────────────────────────────
const QualityScoreCard = ({ score = 96.5, status = "Active" }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const statusColor =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : status === "Suspended"
      ? "bg-red-100 text-red-600"
      : "bg-orange-100 text-orange-600";

  return (
    <div className="bg-[#E9E8FF] rounded-2xl p-5 flex flex-col relative overflow-hidden min-h-[280px]">

      {/* TITLE */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center">
          <Award size={16} className="text-[#6C63FF]" />
        </div>
        <h3 className="text-[16px] font-semibold text-[#02027A]">Quality Score</h3>
      </div>

      {/* STATUS BADGE */}
      <span className={`inline-block w-fit px-3 py-1.5 rounded-full text-[11px] font-semibold mb-3 ${statusColor}`}>
        {status}
      </span>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center relative mt-2">

        {/* Shield */}
        <div className="absolute top-[-5px] right-2 opacity-50">
          <ShieldCheck size={70} className="text-[#B7B2FF]" strokeWidth={1.5} />
        </div>

        {/* DONUT */}
        <div className="relative flex items-center justify-center">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#D7D5FF" strokeWidth="9" />
            <circle
              cx="70" cy="70" r={radius}
              fill="none" stroke="#0BA000" strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${progress - 14} ${circumference}`}
              transform="rotate(-120 70 70)"
            />
          </svg>
          <div className="absolute">
            <p className="text-[28px] font-bold text-[#02027A]">{score}%</p>
          </div>
        </div>

        {/* BADGE */}
        <div className="mt-4">
          <span className="bg-[#C8F3CC] text-[#168B2D] text-[11px] font-medium px-4 py-1 rounded-full">
            Excellent Rating
          </span>
        </div>

        {/* TEXT */}
        <p className="text-[11px] text-[#4B4B8A] text-center leading-snug mt-4">
          Based On Accuracy And SLA<br />Adherence Over 90 Days.
        </p>
      </div>
    </div>
  );
};

// ── Section Wrapper ────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center gap-2 mb-5">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
        <Icon size={16} className="text-[#02027A]" />
      </div>
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

// ── Info Field ─────────────────────────────────────────────
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);

// ── Main Page ──────────────────────────────────────────────
export default function ViewVendor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/api/vendor/${id}`);
        if (res.data.success) {
          setVendor(res.data.data);
        } else {
          setError("Vendor not found.");
        }
      } catch (err) {
        console.error("Error fetching vendor:", err);
        setError("Failed to load vendor details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  // ── Loading ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-[92vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#02027A]" />
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────
  if (error || !vendor) {
    return (
      <div className="h-[92vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">{error || "Vendor not found."}</p>
          <button
            onClick={() => navigate("/super-admin/vendor")}
            className="bg-[#02027A] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#01016a] transition"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  const vendorDisplayId = `VND${vendor.vendor_id.toString().padStart(4, "0")}`;
  const joinedDate = vendor.created_at
    ? new Date(vendor.created_at).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

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
        <div className="mb-1">
          <h1 className="text-2xl font-bold text-[#02027A]">View Vendor Details</h1>
        </div>

        {/* BREADCRUMB */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 mb-5">
          <span>Vendor</span>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">View Vendor</span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-5">

          {/* LEFT — sections */}
          <div className="col-span-8 space-y-5">

            {/* COMPANY INFO */}
            <Section icon={Building2} title="Company Information">
              <div className="grid grid-cols-2 gap-6">
                <Info label="Company Name"  value={vendor.company_name} />
                <Info label="Vendor ID"     value={vendorDisplayId} />
                <Info label="CIN"           value={vendor.cin} />
                <Info label="GST Number"    value={vendor.gst_number} />
              </div>
            </Section>

            {/* REGISTERED ADDRESS */}
            <Section icon={MapPin} title="Registered Address">
              <div className="grid grid-cols-3 gap-6">
                <Info label="Address Line 1" value={vendor.address_line_1} />
                <Info label="Address Line 2" value={vendor.address_line_2} />
                <Info label="City"           value={vendor.city} />
                <Info label="State"          value={vendor.state} />
                <Info label="Pincode"        value={vendor.pincode} />
              </div>
            </Section>

            {/* COVERAGE AREA */}
            {vendor.coverage_states && vendor.coverage_states.length > 0 && (
              <Section icon={MapPin} title="Coverage Area">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Supported States</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.coverage_states.map((s, i) => (
                      <span
                        key={i}
                        className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full border border-indigo-100"
                      >
                        {STATE_MAP[s] || `State ${s}`}
                      </span>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* PRIMARY CONTACT */}
            <Section icon={User} title="Primary Contact Person">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {vendor.poc_first_name} {vendor.poc_last_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Contact Email</p>
                  <p className="text-sm text-indigo-500 font-medium">{vendor.poc_email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                  <p className="text-sm text-gray-700">{vendor.poc_mobile}</p>
                </div>
              </div>
            </Section>

            {/* SERVICES & SLAs */}
            {vendor.services && vendor.services.length > 0 && (
              <Section icon={ShieldCheck} title="Services Offered & SLAs">
                <div className="space-y-3">
                  {vendor.services.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-sm text-gray-700">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                        <Clock size={12} />
                        {s.sla}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

          </div>

          {/* RIGHT — Quality Score + Joined Date */}
          <div className="col-span-4 space-y-5">
            <QualityScoreCard score={96.5} status={vendor.status} />

            {/* JOINED DATE CARD */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-400 mb-1">Joined On</p>
              <p className="text-base font-semibold text-gray-900">{joinedDate}</p>
            </div>
          </div>

        </div>
      </div>

      {/* FIXED BOTTOM BUTTONS */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={() => navigate(`/super-admin/edit-vendor/${vendor.vendor_id}`)}
          className="px-6 py-2.5 rounded-xl bg-[#02027A] text-white text-sm font-semibold hover:bg-[#01016a] transition"
        >
          Edit Vendor
        </button>
      </div>

    </div>
  );
}