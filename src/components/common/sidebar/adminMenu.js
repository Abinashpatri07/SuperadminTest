import {
  Home,
  Users,
  BadgeCheck,
  ReceiptText,
  BarChart3,
} from "lucide-react";

export const adminMenu = [

  /* HOME */
  {
    name: "Home",
    icon: Home,
    path: "/admin/home",

    activePaths: [
      "/admin/home",
    ],
  },

  /* CANDIDATE */
  {
  name: "Candidate",
  icon: Users,
  path: "/admin/candidates",

  activePaths: [
    "/admin/candidates",
    "/admin/create-candidate",
    "/admin/view/",
    "/admin/edit-candidate",
    "/admin/candidate-details",
    "/admin/audit-log",
  ],
},
  /* HR */
  {
    name: "HR",
    icon: BadgeCheck,
    path: "/admin/hr",

    activePaths: [
      "/admin/hr",
      "/admin/create-hr",
      "/admin/view-hr",
      "/admin/edit-hr",
      "/admin/hr-details",
    ],
  },

  /* BILLING */
  {
    name: "Billing",
    icon: ReceiptText,
    path: "/admin/billing",

    activePaths: [
      "/admin/billing",
      "/admin/invoice",
      "/admin/payment-history",
    ],
  },

  /* ANALYTICS */
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",

    activePaths: [
      "/admin/analytics",
      "/admin/reports",
    ],
  },

];