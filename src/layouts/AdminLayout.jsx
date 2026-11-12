import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/sidebar/Sidebar";
import Header from "../components/common/Header";
import {
  adminMenu,
} from "../components/common/sidebar/adminMenu";

function AdminLayout() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <Header />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar menu={adminMenu} />

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default AdminLayout;