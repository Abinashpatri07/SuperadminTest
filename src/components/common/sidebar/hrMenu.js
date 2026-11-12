import {
  Home,
  LayoutDashboard,
  FileText,
} from "lucide-react";

export const hrMenu = [

  /* HOME */
  {
    name: "Home",
    icon: Home,
    path: "/hr/home",

    activePaths: [
      "/hr/home",
    ],
  },

  /* CANDIDATE */
  {
    name: "Candidate",
    icon: LayoutDashboard,
    path: "/hr/dashboard",

    activePaths: [
      "/hr/dashboard",
      "/hr/create-candidate",
      "/hr/view",
      "/hr/edit",
      "/hr/bulk-upload",
      "/hr/candidate-details",
    ],
  },

  /* ANALYTICS */
  {
    name: "Analytics",
    icon: FileText,
    path: "/hr/analytics",

    activePaths: [
      "/hr/report",
      "/hr/analytics",
    ],
  },

];