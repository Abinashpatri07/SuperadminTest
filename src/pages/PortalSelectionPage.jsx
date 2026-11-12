import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Building2, Briefcase, KeyRound, Handshake, ArrowRight, ShieldCheck } from "lucide-react";
import logo from "../assets/logo.png";

// Order: Super Admin, Client Admin, HR, Vendor, Candidate
const portals = [
  {
    id: "super-admin",
    title: "Super Admin Portal",
    description: "Manage users, clients, vendors, configurations, and platform settings.",
    icon: KeyRound,
    iconBg: "bg-gradient-to-br from-rose-100 to-rose-200 text-rose-800 ring-4 ring-rose-50",
    buttonBg: "bg-[#8b1836] hover:bg-[#6c1028] text-white",
    cardGradient: "from-white to-rose-50/40",
    route: "/super-admin/login",
  },
  {
    id: "client-admin",
    title: "Client Admin Portal",
    description: "Manage candidates, initiate verifications, view reports, and handle your organization.",
    icon: Building2,
    iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 ring-4 ring-emerald-50",
    buttonBg: "bg-[#0a8043] hover:bg-[#076233] text-white",
    cardGradient: "from-white to-emerald-50/40",
    route: "/admin/login",
  },
  {
    id: "hr",
    title: "HR Portal",
    description: "Manage employee verifications, track onboarding, and view reports.",
    icon: Briefcase,
    iconBg: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 ring-4 ring-purple-50",
    buttonBg: "bg-[#4a1fb8] hover:bg-[#38168e] text-white",
    cardGradient: "from-white to-purple-50/40",
    route: "/hr/login",
  },
  {
    id: "vendor",
    title: "Vendor Portal",
    description: "Manage assigned verifications, update status, and communicate with clients.",
    icon: Handshake,
    iconBg: "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 ring-4 ring-amber-50",
    buttonBg: "bg-[#b86200] hover:bg-[#8f4c00] text-white",
    cardGradient: "from-white to-amber-50/40",
    route: "/vendor/login",
  },
  {
    id: "candidate",
    title: "Candidate Portal",
    description: "Submit your details, track your verification status, and manage your profile.",
    icon: ClipboardCheck,
    iconBg: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 ring-4 ring-blue-50",
    buttonBg: "bg-[#0b57d0] hover:bg-[#0842a0] text-white",
    cardGradient: "from-white to-blue-50/40",
    route: "/candidate",
  },
];

function PortalCard({ portal, onNavigate }) {
  const Icon = portal.icon;
  return (
    <div
      onClick={() => onNavigate(portal.route)}
      className={`group relative rounded-3xl bg-gradient-to-b ${portal.cardGradient} p-7 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center cursor-pointer`}
    >
      {/* Icon */}
      <div
        className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5 ${portal.iconBg} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
      >
        <Icon className="w-9 h-9 stroke-[1.8]" />
      </div>

      {/* Title & Description */}
      <h2 className="text-xl font-bold text-slate-900 mb-2">{portal.title}</h2>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 flex-1 max-w-xs">
        {portal.description}
      </p>

      {/* Action Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(portal.route);
        }}
        className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide ${portal.buttonBg} shadow-sm group-hover:shadow-md transition-all duration-200`}
      >
        Go to Portal
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

export default function PortalSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden bg-gradient-to-b from-[#f3f7fd] via-[#f7f9fd] to-[#eef2f9] text-slate-800">
      {/* Decorative background blurs and patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/60 to-transparent pointer-events-none -z-0 blur-3xl opacity-60" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Logo - top left */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <img
          src={logo}
          alt="BGV Platform Logo"
          className="h-16 sm:h-20 w-auto object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 flex-1 flex flex-col justify-center">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Secure Verification Ecosystem
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Welcome to <span className="text-[#0b57d0]">BGV Platform</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Choose your portal to access the features and services tailored for you.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="space-y-6">
          {/* Top Row: Super Admin, Client Admin, HR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portals.slice(0, 3).map((portal) => (
              <PortalCard key={portal.id} portal={portal} onNavigate={navigate} />
            ))}
          </div>

          {/* Bottom Row: Vendor, Candidate (centered) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {portals.slice(3, 5).map((portal) => (
              <PortalCard key={portal.id} portal={portal} onNavigate={navigate} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-xs text-slate-500 border-t border-slate-200/60 bg-white/50 backdrop-blur-xs">
        <p>© {new Date().getFullYear()} BGV Platform. All rights reserved. Secure Background Verification Services.</p>
      </footer>
    </div>
  );
}