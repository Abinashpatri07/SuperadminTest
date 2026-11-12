import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PageHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-6">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-2"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* 📝 Title */}
      <h1 className="text-2xl font-semibold text-blue-900">
        Create New Candidate
      </h1>

      {/* 📄 Subtitle */}
      <p className="text-sm text-gray-500 mt-1">
        Add A New Candidate To The Verification System
      </p>

      {/* 🧭 Breadcrumb */}
      <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
        <span>Home</span>
        <span>›</span>
        <span>Candidates</span>
        <span>›</span>
        <span className="text-black font-medium">
          Create Candidate
        </span>
      </div>
    </div>
  );
}

export default PageHeader;