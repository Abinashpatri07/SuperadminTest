import {
  ClipboardList,
  CheckCircle2,
  PauseCircle,
  RefreshCcw,
  BadgeCheck,
  Ban,
} from "lucide-react";

function CandidateOverview({ data }) {

  const candidateStats = [
    {
      title: "In Progress",
      value: data ? String(data.inProgress).padStart(2, '0') : "00",
      icon: <ClipboardList size={18} className="text-[#4F46E5]" strokeWidth={2} />,
      bg: "bg-[#F3F2FF]",
      border: "bg-[#4338CA]",
      iconBg: "bg-[#DDD8FF]",
    },
    {
      title: "Complete",
      value: data ? String(data.complete).padStart(2, '0') : "00",
      icon: <CheckCircle2 size={18} className="text-[#16A34A]" strokeWidth={2} />,
      bg: "bg-[#EAF9EB]",
      border: "bg-[#22C55E]",
      iconBg: "bg-[#86EFAC]",
    },
    {
      title: "On Hold",
      value: data ? String(data.onHold).padStart(2, '0') : "00",
      icon: <PauseCircle size={18} className="text-[#B7791F]" strokeWidth={2} />,
      bg: "bg-[#FFF8E7]",
      border: "bg-[#D4A017]",
      iconBg: "bg-[#F6D58B]",
    },
    {
      title: "Verification In Progress",
      value: data ? String(data.verificationInProgress).padStart(2, '0') : "00",
      icon: <RefreshCcw size={18} className="text-[#EA580C]" strokeWidth={2} />,
      bg: "bg-[#FFF1E8]",
      border: "bg-[#F97316]",
      iconBg: "bg-[#FDBA74]",
    },
    {
      title: "Verified",
      value: data ? String(data.verified).padStart(2, '0') : "00",
      icon: <BadgeCheck size={18} className="text-[#0F766E]" strokeWidth={2} />,
      bg: "bg-[#ECF8F6]",
      border: "bg-[#14B8A6]",
      iconBg: "bg-[#A7F3D0]",
    },
    {
      title: "Reject",
      value: data ? String(data.rejected).padStart(2, '0') : "00",
      icon: <Ban size={18} className="text-[#EF4444]" strokeWidth={2} />,
      bg: "bg-[#FFECEC]",
      border: "bg-[#FF3B30]",
      iconBg: "bg-[#FDA4AF]",
    },
  ];

  return (
    <div>
      {/* TITLE */}
      <h2 className="text-[15px] font-semibold text-[#121212] mb-3">
        Candidate overview
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-4">
        {candidateStats.map((item) => (
          <div
            key={item.title}
            className={`
              relative rounded-2xl
              p-4
              overflow-hidden
              ${item.bg}
              border border-white
              shadow-[0_4px_14px_rgba(15,23,42,0.04)]
            `}
          >
            {/* LEFT BORDER */}
            <div
              className={`
                absolute left-0 top-4 bottom-4
                w-1
                rounded-full
                ${item.border}
              `}
            />

            {/* TOP */}
            <div className="flex items-start justify-between">
              <h3 className="text-[13px] font-semibold text-[#1F1F1F] leading-5 max-w-35">
                {item.title}
              </h3>
              <div
                className={`
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  shrink-0
                  ${item.iconBg}
                `}
              >
                {item.icon}
              </div>
            </div>

            {/* BOTTOM */}
            <div className="flex items-end justify-between mt-5">
              <h1 className="text-[36px] font-semibold leading-none text-[#121212]">
                {item.value}
              </h1>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateOverview;