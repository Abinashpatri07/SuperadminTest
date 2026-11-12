import React from "react";
import { useNavigate } from "react-router-dom";

import CandidateInfoCard from "../../components/clientAdmin/candidate/CandidateInfoCard";
import HRSelector from "../../components/clientAdmin/candidate/HRSelector";

// Dummy candidate — replace with real data from route state or API
const CANDIDATE = {
  initials: "NV",
  name: "Nisha Venkatesh",
  email: "nisha@example.com",
  phone: "+91 4587321680",
  note: '"Please Ensure Previous Employment At Global Tech Firms Is Verified With Priority. Requires Multi-National Background Screening."',
};

export default function AssignVerificationOfficerPage() {
  const navigate = useNavigate();

  const handleConfirm = (selectedHR) => {
    if (!selectedHR) return;
    console.log("Confirmed assignment:", selectedHR);
    // TODO: call your API here, then navigate back
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen px-10 py-9 font-sans">

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Assign Verification Officer
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review Candidate Details And Select The Most Suitable HR Representative For The Verification Process.
        </p>
      </div>

      {/* Content — left card + right selector */}
      <div className="flex gap-6 items-start">

        {/* Left — Candidate Info (fixed width) */}
        <div className="w-72 shrink-0">
          <CandidateInfoCard candidate={CANDIDATE} />
        </div>

        {/* Right — HR Selector (fills remaining space) */}
        <HRSelector
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />

      </div>

    </div>
  );
}