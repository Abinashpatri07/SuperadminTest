import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  breadcrumb1,
  breadcrumb2,
  backPath,
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(backPath)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-700 transition mb-4"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 mt-1 text-sm">
        {subtitle}
      </p>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mt-5 text-sm">
        <span className="text-gray-500">
          {breadcrumb1}
        </span>

        <ChevronRight size={16} className="text-gray-400" />

        <span className="font-medium text-gray-900">
          {breadcrumb2}
        </span>
      </div>

    </div>
  );
}