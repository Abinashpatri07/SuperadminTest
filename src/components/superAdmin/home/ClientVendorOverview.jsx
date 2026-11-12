import {
  Users,
  UserCheck,
  Activity,
  Clock3,
  XCircle,
  Ban,
} from "lucide-react";

// ── Stat Card ──────────────────────────────────────────
const StatCard = ({ label, value, icon, iconBg, borderColor, cardBg }) => (
  <div className={`relative rounded-2xl p-4 overflow-hidden ${cardBg}`}>

    {/* LEFT BORDER BAR */}
    <div
  className={`absolute left-0 top-4 bottom-4 w-0.75 rounded-full ${borderColor} shadow-[0_0_12px_rgba(79,70,229,0.45)]`}
/>

    {/* TOP ROW */}
    <div className="flex items-start justify-between pl-2">
      <h3 className="text-[13px] font-semibold text-[#202020] leading-5 max-w-[70%]">
        {label}
      </h3>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
    </div>

    {/* VALUE */}
    <div className="mt-4 pl-2">
      <h1 className="text-[38px] font-bold leading-none text-[#202020]">
        {value}
      </h1>
    </div>

  </div>
);

// ── Panel (Client or Vendor) ───────────────────────────
const Panel = ({ title, total, totalLabel, cards }) => (
  <div className="bg-[#f0f2ffef] rounded-3xl p-5 flex-1">

    {/* HEADER */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-[#202020]">{title}</h2>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">{totalLabel}</span>
        <span className="text-4xl font-extrabold text-[#202020] leading-none">{total}</span>
      </div>
    </div>

    {/* GRID */}
    <div className="grid grid-cols-2 gap-3">
      {cards.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>

  </div>
);

// ── Client Data ────────────────────────────────────────
const clientCards = [
  {
    label: "Total Client", value: "20",
    icon: <Users size={16} className="text-[#5B4CEB]" />,
    iconBg: "bg-[#DCD4FF]", borderColor: "bg-[#5B4CEB]", cardBg: "bg-[#EAE8FF]",
  },
  {
    label: "Verified", value: "09",
    icon: <UserCheck size={16} className="text-[#2AA8F2]" />,
    iconBg: "bg-[#D7F1FF]", borderColor: "bg-[#2AA8F2]", cardBg: "bg-[#E5F6FF]",
  },
  {
    label: "Active", value: "10",
    icon: <Activity size={16} className="text-[#36C95F]" />,
    iconBg: "bg-[#D9F8E2]", borderColor: "bg-[#36C95F]", cardBg: "bg-[#E8F9ED]",
  },
  {
    label: "On Hold", value: "09",
    icon: <Clock3 size={16} className="text-[#FF8A3D]" />,
    iconBg: "bg-[#FFE6D7]", borderColor: "bg-[#FF8A3D]", cardBg: "bg-[#FFF0E6]",
  },
  {
    label: "Awaiting Input", value: "10",
    icon: <Clock3 size={16} className="text-[#D8AE20]" />,
    iconBg: "bg-[#FFF1BE]", borderColor: "bg-[#E7C94B]", cardBg: "bg-[#FFF9E0]",
  },
  {
    label: "Rejected", value: "18",
    icon: <XCircle size={16} className="text-[#FF5C5C]" />,
    iconBg: "bg-[#FFDCDC]", borderColor: "bg-[#FF5C5C]", cardBg: "bg-[#FFF0F0]",
  },
];

// ── Vendor Data ────────────────────────────────────────
const vendorCards = [
  {
    label: "Total Vendor", value: "20",
    icon: <Users size={16} className="text-[#5B4CEB]" />,
    iconBg: "bg-[#DCD4FF]", borderColor: "bg-[#5B4CEB]", cardBg: "bg-[#EAE8FF]",
  },
  {
    label: "Verified", value: "09",
    icon: <UserCheck size={16} className="text-[#2AA8F2]" />,
    iconBg: "bg-[#D7F1FF]", borderColor: "bg-[#2AA8F2]", cardBg: "bg-[#E5F6FF]",
  },
  {
    label: "Total Case", value: "10",
    icon: <Users size={16} className="text-[#B66BFF]" />,
    iconBg: "bg-[#F1DEFF]", borderColor: "bg-[#B66BFF]", cardBg: "bg-[#F5EEFF]",
  },
  {
    label: "On Hold", value: "09",
    icon: <Clock3 size={16} className="text-[#FF8A3D]" />,
    iconBg: "bg-[#FFE6D7]", borderColor: "bg-[#FF8A3D]", cardBg: "bg-[#FFF0E6]",
  },
  {
    label: "Pending\nVerification", value: "10",
    icon: <Clock3 size={16} className="text-[#D8AE20]" />,
    iconBg: "bg-[#FFF1BE]", borderColor: "bg-[#E7C94B]", cardBg: "bg-[#FFF9E0]",
  },
  {
    label: "Suspended", value: "18",
    icon: <Ban size={16} className="text-[#FF5C5C]" />,
    iconBg: "bg-[#FFDCDC]", borderColor: "bg-[#FF5C5C]", cardBg: "bg-[#FFF0F0]",
  },
];

// ── Main Component ───────────────────────────────────────
export default function ClientVendorOverview({ data }) {
  // If data is provided, override the mock values
  const currentClientCards = clientCards.map(c => {
    if (data?.clients) {
      if (c.label === "Total Client") return { ...c, value: data.clients.total || 0 };
      if (c.label === "Verified") return { ...c, value: data.clients.verified || 0 };
      if (c.label === "Active") return { ...c, value: data.clients.active || 0 };
      if (c.label === "On Hold") return { ...c, value: data.clients.onHold || 0 };
      if (c.label === "Awaiting Input") return { ...c, value: data.clients.awaitingInput || 0 };
      if (c.label === "Rejected") return { ...c, value: data.clients.rejected || 0 };
    }
    return c;
  });

  const currentVendorCards = vendorCards.map(v => {
    if (data?.vendors) {
      if (v.label === "Total Vendor") return { ...v, value: data.vendors.total || 0 };
      if (v.label === "Verified") return { ...v, value: data.vendors.verified || 0 };
      if (v.label === "Total Case") return { ...v, value: data.vendors.totalCases || 0 };
      if (v.label === "On Hold") return { ...v, value: data.vendors.onHold || 0 };
      if (v.label === "Pending\nVerification") return { ...v, value: data.vendors.pendingVerification || 0 };
      if (v.label === "Suspended") return { ...v, value: data.vendors.suspended || 0 };
    }
    return v;
  });

  return (
    <div className="flex gap-4 p-4 pl-0">
      <Panel 
        title="Client" 
        total={data?.clients?.total ?? 0} 
        totalLabel="Total Client" 
        cards={currentClientCards} 
      />
      <Panel 
        title="Vendor" 
        total={data?.vendors?.total ?? 0} 
        totalLabel="Total Vendor" 
        cards={currentVendorCards} 
      />
    </div>
  );
}