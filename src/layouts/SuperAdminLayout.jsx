import Footer from "../components/common/Footer";
import { API_BASE_URL } from "../API/config.js";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";
import Sidebar from "../components/common/sidebar/Sidebar";
import { superAdminMenu } from "../components/common/sidebar/superAdminMenu";
import Header from "../components/common/Header";

function SuperAdminLayout() {
  const [menu, setMenu] = useState(superAdminMenu);

  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const API_BASE = API_BASE_URL;
        const response = await axiosInstance.get(`${API_BASE}/api/superadmin/cases/get-all`);
        const pendingCount = response.data.filter(c => c.status === "Pending").length;
        
        setMenu(prevMenu => prevMenu.map(item => 
          item.name === "Case" ? { ...item, badge: pendingCount } : item
        ));
      } catch (error) {
        console.error("Error fetching cases for sidebar:", error);
      }
    };
    
    fetchPendingCases();
  }, []);

  return (
     <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <Header />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar menu={menu} />

        {/* CONTENT */}
        <div className="flex-1 p-3 overflow-y-auto">
          <Outlet />
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default SuperAdminLayout;