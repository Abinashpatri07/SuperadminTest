import {
  Home,
  LayoutGrid,
  BarChart3,
  ReceiptText,
} from "lucide-react";

export const vendorMenu = [
  {
    name: "Home",
    icon: Home,
    path: "/vendor/home",
  },
  {
    name: "Dashboard",
    icon: LayoutGrid,
    path: "/vendor/dashboard",
    activePaths: [
      "/vendor/dashboard",
      "/vendor/verified-applications",
      "/vendor/refute-applications",
      "/vendor/assigned-applications",
      "/vendor/unverified-applications",
      "/vendor/employment-details",
      "/vendor/address-details",
      "/vendor/drug-test-details",
      "/vendor/education-details",
      "/vendor/criminal-details"
    ],
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/vendor/analytics",
  },
  {
    name: "Billing",
    icon: ReceiptText,
    path: "/vendor/billing",
  },
];
