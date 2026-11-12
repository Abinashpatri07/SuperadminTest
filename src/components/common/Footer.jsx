import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200/80 py-2 px-6 flex items-center justify-center text-[11px] text-gray-500 select-none shrink-0 z-10 text-center">
      <div>
        <span>© {currentYear} </span>
        <span className="font-semibold text-gray-700">HedgeVerify</span>
        <span>. All rights reserved.</span>
      </div>
    </footer>
  );
}
