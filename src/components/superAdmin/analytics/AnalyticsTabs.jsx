const TABS = ["MIS", "SLA Breach", "TAT"];

export default function AnalyticsTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-5">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-0.5 ${
            active === tab
              ? "border-[#02027A] text-[#02027A]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}