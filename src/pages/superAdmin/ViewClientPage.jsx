import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  UserCircle,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import PageHeader from "../../components/superAdmin/client/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get(`/api/client/get-client/${id}`);
      if (res.data.success) {
        setClient(res.data.data);
      } else {
        setError("Client not found.");
      }
    } catch (err) {
      console.error("Error fetching client:", err);
      setError("Failed to load client details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">{error || "Client not found."}</p>
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

  // Number() ensures safe comparison regardless of DB return type
  const activeVal = Number(client.is_active);

  const statusLabel =
    activeVal === 1 ? "Active" :
    activeVal === 2 ? "Inactive" :
    activeVal === 3 ? "Suspended" : "Unknown";

  const statusColor =
    activeVal === 1 ? "bg-green-100 text-green-700" :
    activeVal === 2 ? "bg-gray-100 text-gray-600" :
    "bg-red-100 text-red-600";

  return (
    <div className="min-h-screen px-6 py-4">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <PageHeader
          title="View Client Details"
          subtitle=""
          breadcrumb1="Client"
          breadcrumb2="View Client"
          backPath="/super-admin/clients"
        />

        <button
          onClick={() => navigate(`/super-admin/clients/edit/${id}`)}
          className="bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800 transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Main Card */}
      <div className="border border-gray-200 rounded-2xl bg-white p-4">

        <div className="grid grid-cols-3 gap-4">

          {/* LEFT */}
          <div className="col-span-2 space-y-4">

            {/* Company Info */}
            <div className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={16} className="text-indigo-700" />
                <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-y-4">
                <Info label="Company Name"   value={client.companyName || "—"} />
                <Info label="Client ID"      value={`CLT${client.id}`} />
                <Info label="CIN (Corporate Identification Number)" value={client.cin || "—"} />
                <Info label="GST Number"     value={client.gst || "—"} />
              </div>
            </div>

            {/* Address */}
            <div className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-indigo-700" />
                <h2 className="text-lg font-semibold text-gray-900">Registered Address</h2>
              </div>

              <div className="grid grid-cols-2 gap-y-4">
                <Info label="Address Line 1" value={client.addressLine1 || "—"} />
                <Info label="Address Line 2" value={client.addressLine2 || "—"} />
                <Info label="City"           value={client.city    || "—"} />
                <Info label="State"          value={client.state   || "—"} />
                <Info label="Pin Code"       value={client.pincode || "—"} />
              </div>
            </div>

            {/* Contact */}
            <div className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <UserCircle size={16} className="text-indigo-700" />
                <h2 className="text-lg font-semibold text-gray-900">Primary Contact Person</h2>
              </div>

              <div className="grid grid-cols-3 gap-y-4">
                <Info label="Full Name"     value={client.contactPersonName || "—"} />
                <Info label="Contact Email" value={client.contactEmail || "—"} />
                <Info label="Phone Number"  value={client.contactPhone || "—"} />
              </div>
            </div>

          </div>

          {/* RIGHT PACKAGE CARD */}
          <div className="bg-[#ECE9FF] rounded-2xl p-4 relative overflow-hidden">

            {/* Shield Icon */}
            <ShieldCheck size={80} className="absolute top-4 right-4 text-indigo-200" />

            <div className="relative z-10">

              <div className="flex items-center gap-2 mb-4">
                <Building2 size={16} className="text-indigo-700" />
                <h2 className="text-lg font-semibold text-indigo-900">Active Package</h2>
              </div>

              {/* Status Badge */}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${statusColor}`}>
                {statusLabel}
              </span>

              <h3 className="text-2xl font-bold text-indigo-900 mt-1">
                Standard Employment
              </h3>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Package Quota</span>
                  <span className="bg-indigo-700 text-white text-[10px] px-2 py-0.5 rounded">
                    50 Used
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-gray-300 overflow-hidden">
                  <div className="w-[10%] h-full bg-indigo-800 rounded-full" />
                </div>

                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>50 Used</span>
                  <span>500 Total</span>
                </div>
              </div>

              {/* Included Checks */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">Included Checks</h4>
                <div className="space-y-2">
                  {[
                    "Criminal Background",
                    "Global Watchlist",
                    "Education Verification",
                    "Employment History",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span className="text-xs text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Joined Date */}
              <div className="mt-6 border-t border-indigo-200 pt-3">
                <p className="text-xs text-gray-500">Joined On</p>
                <p className="text-base font-semibold text-gray-900 mt-0.5">
                  {client.created_at
                    ? new Date(client.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })
                    : "—"}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="border border-indigo-700 text-indigo-700 px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 transition"
          >
            Back
          </button>

          <button
            onClick={() => navigate("/super-admin/clients")}
            className="bg-indigo-900 text-white px-10 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800 transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}