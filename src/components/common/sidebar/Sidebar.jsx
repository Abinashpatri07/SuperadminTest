// import React, { useState, useEffect } from "react";

// import {
//   Home,
//   Users,
//   BarChart3,
//   BadgeCheck,
//   ReceiptText,
//   LogOut,
//   PanelLeftClose,
//   PanelLeftOpen,
// } from "lucide-react";

// import {
//   NavLink,
//   useNavigate,
// } from "react-router-dom";

// function Sidebar() {
//   const navigate = useNavigate();

//   const [isOpen, setIsOpen] = useState(true);
//   const [isHovering, setIsHovering] =
//     useState(false);

//   // LOAD SIDEBAR STATE
//   useEffect(() => {
//     const saved =
//       localStorage.getItem("sidebarOpen");

//     if (saved !== null) {
//       setIsOpen(JSON.parse(saved));
//     }
//   }, []);

//   // SAVE SIDEBAR STATE
//   useEffect(() => {
//     localStorage.setItem(
//       "sidebarOpen",
//       JSON.stringify(isOpen)
//     );
//   }, [isOpen]);

//   // LOGOUT
//   const handleLogout = () => {
//     localStorage.clear();

//     navigate("/login");
//   };

//   // MENU ITEMS
//   const menu = [
//     {
//       name: "Home",
//       icon: Home,
//       path: "/admin/home",
//     },

//     {
//       name: "Candidate",
//       icon: Users,
//       path: "/admin/candidates",
//     },

//      {
//       name: "HR",
//       icon: BadgeCheck,
//       path: "/admin/hr",
//     },

//     {
//       name: "Billing",
//       icon: ReceiptText,
//       path: "/admin/billing",
//     },

//     {
//       name: "Analytics",
//       icon: BarChart3,
//       path: "/admin/analytics",
//     },

//   ];

//   const expanded = isOpen || isHovering;

//   return (
//     <div
//       onMouseEnter={() =>
//         !isOpen && setIsHovering(true)
//       }
//       onMouseLeave={() =>
//         setIsHovering(false)
//       }
//       className={`${
//         expanded ? "w-64" : "w-20"
//       } h-full bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 shadow-sm`}
//     >

//       {/* TOP SECTION */}
//       <div className="p-4">

//         {/* TOGGLE BUTTON */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="mb-8 p-2 rounded-lg hover:bg-gray-100 transition"
//         >
//           {expanded ? (
//             <PanelLeftClose size={20} />
//           ) : (
//             <PanelLeftOpen size={20} />
//           )}
//         </button>

//         {/* MENU */}
//         <div className="space-y-3">

//           {menu.map((item, index) => {
//             const Icon = item.icon;

//             return (
//               <NavLink
//                 key={index}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `group relative flex items-center ${
//                     expanded
//                       ? "gap-3 px-4"
//                       : "justify-center"
//                   } py-3 rounded-xl transition-all duration-200 ${
//                     isActive
//                       ? "bg-[#E8E8FF] text-[#1E1B8F] border border-[#6366F1]"
//                       : "text-[#1E1B8F] hover:bg-gray-100"
//                   }`
//                 }
//               >

//                 {/* ICON */}
//                 <Icon
//                   size={20}
//                   strokeWidth={2}
//                 />

//                 {/* TEXT */}
//                 {expanded && (
//                   <span className="text-sm font-medium">
//                     {item.name}
//                   </span>
//                 )}

//                 {/* TOOLTIP */}
//                 {!expanded && (
//                   <span className="absolute left-16 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-50">
//                     {item.name}
//                   </span>
//                 )}
//               </NavLink>
//             );
//           })}
//         </div>
//       </div>

//       {/* LOGOUT */}
//       <div className="p-4 border-t border-gray-100">

//         <button
//           onClick={handleLogout}
//           className={`group relative flex items-center ${
//             expanded
//               ? "gap-3 px-4"
//               : "justify-center"
//           } py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200`}
//         >

//           {/* ICON */}
//           <LogOut
//             size={20}
//             strokeWidth={2}
//           />

//           {/* TEXT */}
//           {expanded && (
//             <span className="text-sm font-medium">
//               Logout
//             </span>
//           )}

//           {/* TOOLTIP */}
//           {!expanded && (
//             <span className="absolute left-16 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-50">
//               Logout
//             </span>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;

import React, {
  useState,
  useEffect,
} from "react";

import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { clearAllAuthSessions } from "../../../utils/sessionManager";

function Sidebar({
  menu = [],
}) {

  const navigate = useNavigate();

  const location = useLocation();

  const [isOpen, setIsOpen] =
    useState(true);

  const [isHovering, setIsHovering] =
    useState(false);

  /* LOAD SIDEBAR STATE */
  useEffect(() => {

    const saved =
      localStorage.getItem(
        "sidebarOpen"
      );

    if (saved !== null) {

      setIsOpen(
        JSON.parse(saved)
      );
    }

  }, []);

  /* SAVE SIDEBAR STATE */
  useEffect(() => {

    localStorage.setItem(
      "sidebarOpen",
      JSON.stringify(isOpen)
    );

  }, [isOpen]);

  /* LOGOUT */
  const handleLogout = () => {
    // Clear everything
    clearAllAuthSessions();

    // Redirect directly to central portal login page
    navigate("/portal-login?logout=true", { state: { message: "Logout Successful!" } });
  };

  /* SIDEBAR EXPAND */
  const expanded =
    isOpen || isHovering;

  return (

    <div
      onMouseEnter={() =>
        !isOpen &&
        setIsHovering(true)
      }
      onMouseLeave={() =>
        setIsHovering(false)
      }
      className={`${
        expanded
          ? "w-64"
          : "w-20"
      } h-full bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 shadow-sm`}
    >

      {/* TOP TOGGLE */}
      <div className="p-4 pb-2 shrink-0">

        {/* TOGGLE */}
        <button
          onClick={() =>
            setIsOpen(!isOpen)
          }
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >

          {expanded ? (

            <PanelLeftClose size={20} />

          ) : (

            <PanelLeftOpen size={20} />

          )}

        </button>

      </div>

      {/* SCROLLABLE MENU */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">

          {menu?.map((item, index) => {

            const Icon = item.icon;

            /* ACTIVE LOGIC */
            const isActive =
              item.activePaths
                ? item.activePaths.some((path) =>
                    location.pathname.startsWith(path)
                  )
                : location.pathname.startsWith(item.path);

            return (

              <NavLink
                key={index}
                to={item.path}
                className={`
                  group relative flex items-center
                  ${
                    expanded
                      ? "gap-3 px-4"
                      : "justify-center"
                  }
                  py-3 rounded-xl transition-all duration-200 overflow-hidden
                  ${
                    isActive
                      ? "bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE] shadow-sm"
                      : "text-[#1E1B8F] hover:bg-gray-100"
                  }
                `}
              >

                {/* ACTIVE LEFT BAR */}
                {isActive && (

                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#4338CA]" />

                )}

                {/* ICON */}
                {Icon && (

                  <Icon
                    size={20}
                    strokeWidth={2}
                  />

                )}

                {/* TEXT */}
                {expanded && (
                  <span className="text-sm font-medium flex-1">
                    {item.name}
                  </span>
                )}

                {/* BADGE (expanded) */}
                {expanded && item.badge != null && item.badge > 0 && (
                  <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}

                {/* BADGE DOT (collapsed) */}
                {!expanded && item.badge != null && item.badge > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}

                {/* TOOLTIP */}
                {!expanded && (
                  <span className="absolute left-16 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-50">
                    {item.name}{item.badge > 0 ? ` (${item.badge})` : ''}
                  </span>
                )}

              </NavLink>
            );
          })}

          {/* EMPTY */}
          {menu.length === 0 && (

            <div className="text-center text-sm text-gray-400 pt-10">

              No Menu Items

            </div>

          )}

      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-100">

        <button
          onClick={handleLogout}
          className={`group relative flex items-center ${
            expanded
              ? "gap-3 px-4"
              : "justify-center"
          } py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200`}
        >

          {/* ICON */}
          <LogOut
            size={20}
            strokeWidth={2}
          />

          {/* TEXT */}
          {expanded && (

            <span className="text-sm font-medium">

              Logout

            </span>

          )}

          {/* TOOLTIP */}
          {!expanded && (

            <span className="absolute left-16 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-50">

              Logout

            </span>

          )}

        </button>

      </div>

    </div>
  );
}

export default Sidebar;