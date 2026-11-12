import Footer from "../components/common/Footer";
import Sidebar from "../components/common/sidebar/Sidebar";
import HRHeader from "../components/common/Header";

import {
  Outlet,
} from "react-router-dom";

import {
  hrMenu,
} from "../components/common/sidebar/hrMenu";

function HRLayout() {

  return (

    <div className="h-screen flex flex-col bg-gray-100">

      {/* TOP HEADER */}
      

        <HRHeader />

      

      {/* BELOW HEADER */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar menu={hrMenu} />

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default HRLayout;