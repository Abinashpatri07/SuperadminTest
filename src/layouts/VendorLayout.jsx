import Footer from "../components/common/Footer";
import Sidebar from "../components/common/sidebar/Sidebar";
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";
import { vendorMenu } from "../components/common/sidebar/vendorMenu";

function VendorLayout() {
  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar menu={vendorMenu} />
        <div className="flex-1 p-3 overflow-y-auto">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VendorLayout;
