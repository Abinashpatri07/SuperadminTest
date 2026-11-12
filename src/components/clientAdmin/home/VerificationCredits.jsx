import {
  CreditCard,
  FileText,
  Wallet,
  CircleDollarSign,
} from "lucide-react";

export function VerificationCredits({ data }) {

  const credits = [
    {
      label: "Total Credits",
      value: data ? Number(data.totalCredits || 0).toLocaleString() : "0",
      icon: <FileText size={18} className="text-white/80" />,
    },
    {
      label: "Credits Used",
      value: data ? Number(data.creditsUsed || 0).toLocaleString() : "0",
      icon: <CreditCard size={18} className="text-white/80" />,
    },
    {
      label: "Available Remaining",
      value: data ? Number(data.availableRemaining || 0).toLocaleString() : "0",
      icon: <Wallet size={18} className="text-white/80" />,
    },
  ];

  return (
    <div
      className="
        relative overflow-hidden
        bg-[#09004D]
        rounded-3xl
        p-5
        border border-indigo-900
        shadow-xl
        h-full
      "
    >
      {/* TOP LIGHT EFFECT */}
      <div className="
        absolute -top-20 -right-20
        w-60 h-60
        bg-indigo-400/20
        blur-3xl
        rounded-full
      " />

      {/* HEADER */}
      <div className="relative flex items-start justify-between mb-5 z-10">

        {/* LEFT */}
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign size={18} className="text-white/80" />
            <h2 className="text-[15px] font-semibold text-white">
              Verification Credits
            </h2>
          </div>

          {/* PLAN */}
          <div className="mt-3">
            <span className="
              px-3 py-1 rounded-full
              bg-indigo-400/20
              text-indigo-200
              text-[10px]
              font-medium
              border border-indigo-300/10
            ">
              Standard Employment Plan
            </span>
          </div>
        </div>

        {/* RIGHT ICON */}
        <div className="
          w-12 h-12 rounded-full
          border-4
          border-white/15
          border-t-white/80
        " />

      </div>

      {/* CREDIT CARDS */}
      <div className="relative space-y-4 z-10">
        {credits.map((item, index) => (
          <div
            key={index}
            className="
              bg-white/10
              backdrop-blur-md
              border border-white/10
              rounded-xl
              px-3 py-3
              flex items-center justify-between
              shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            "
          >
            {/* LEFT */}
            <div>
              <p className="text-[12px] text-white/70 mb-0.5">
                {item.label}
              </p>
              <h1 className="text-[28px] font-semibold leading-none text-white">
                {item.value}
              </h1>
            </div>

            {/* RIGHT ICON */}
            <div className="
              w-9 h-9 rounded-lg
              bg-white/10
              border border-white/10
              flex items-center justify-center
            ">
              {item.icon}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default VerificationCredits;