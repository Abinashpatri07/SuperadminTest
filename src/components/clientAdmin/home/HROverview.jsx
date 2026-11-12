import {
  UsersRound,
  UserCheck,
  UserX,
  Ban,
} from "lucide-react";

function HROverview({ data }) {

  const hrStats = [
    {
      title: "Total (HR)",
      value: data ? String(data.total).padStart(2, '0') : "00",
      icon: <UsersRound size={18} className="text-[#4F46E5]" strokeWidth={2} />,
      bg: "bg-[#F3F2FF]",
      border: "bg-[#4338CA]",
      iconBg: "bg-[#DDD8FF]",
    },
    {
      title: "Active",
      value: data ? String(data.active).padStart(2, '0') : "00",
      icon: <UserCheck size={18} className="text-[#16A34A]" strokeWidth={2} />,
      bg: "bg-[#EAF9EB]",
      border: "bg-[#22C55E]",
      iconBg: "bg-[#86EFAC]",
    },
    {
      title: "Inactive",
      value: data ? String(data.inactive).padStart(2, '0') : "00",
      icon: <UserX size={18} className="text-[#EA580C]" strokeWidth={2} />,
      bg: "bg-[#FFF1E8]",
      border: "bg-[#F97316]",
      iconBg: "bg-[#FDBA74]",
    },
    {
      title: "Terminated",
      value: data ? String(data.terminated).padStart(2, '0') : "00",
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
        Hr overview
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">
        {hrStats.map((item) => (
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

export default HROverview;