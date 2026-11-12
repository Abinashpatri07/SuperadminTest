import React from "react";
import { Mail, Phone, AlertCircle } from "lucide-react";

export default function CandidateInfoCard({ candidate }) {
  const {
    initials = "NV",
    name = "Nisha Venkatesh",
    email = "nisha@example.com",
    phone = "+91 4587321680",
    note = '"Please Ensure Previous Employment At Global Tech Firms Is Verified With Priority. Requires Multi-National Background Screening."',
  } = candidate || {};

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Candidate Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold mb-4">
          {initials}
        </div>

        {/* Name */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">{name}</h2>

        {/* Contact Info */}
        <p className="text-xs font-semibold text-gray-500 mb-3">Contact Info</p>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={14} className="text-gray-400 shrink-0" />
            {email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} className="text-gray-400 shrink-0" />
            {phone}
          </div>
        </div>

      </div>

      {/* Client Note */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
        <div className="flex items-center gap-1.5 text-orange-500 text-sm font-semibold mb-2">
          <AlertCircle size={15} />
          Client Note
        </div>
        <p className="text-sm text-orange-700 leading-relaxed">{note}</p>
      </div>

    </div>
  );
}