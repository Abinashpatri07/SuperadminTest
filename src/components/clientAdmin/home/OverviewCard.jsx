import { Maximize2 } from "lucide-react";

function OverviewCard({
  title,
  value,
  icon,
  color,
  borderColor,
  cardBg,
}) {

  return (

    <div
      className={`
        relative rounded-3xl
        px-5 py-5
        overflow-hidden
        ${cardBg}

        border border-[#F1F1F1]
      `}
    >

      {/* LEFT BORDER */}
      <div
        className={`
          absolute left-0 top-6 bottom-6
          w-0.75
          rounded-full
          ${borderColor}

          shadow-[0_0_8px_rgba(0,0,0,0.08)]
        `}
      />

      {/* TOP */}
      <div className="flex items-start justify-between">

        {/* TITLE */}
        <h3 className="text-[15px] font-semibold text-[#1F1F1F] leading-6 max-w-[65%]">

          {title}

        </h3>

        {/* ICON */}
        <div
          className={`
            w-12 h-12 rounded-full
            flex items-center justify-center
            shrink-0
            ${color}
          `}
        >

          {icon}

        </div>

      </div>

      {/* BOTTOM */}
      <div className="flex items-end justify-between mt-8">

        {/* VALUE */}
        <h1 className="text-[42px] font-semibold leading-none text-[#121212]">

          {value}

        </h1>

        {/* BUTTON */}
        <button className="mb-1">

          <Maximize2
            size={14}
            className="text-gray-300"
          />

        </button>

      </div>

    </div>
  );
}

export default OverviewCard;