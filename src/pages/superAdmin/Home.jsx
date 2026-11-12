import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";
import ClientVendorOverview from "../../components/superAdmin/home/ClientVendorOverview";
import RevenueGrowth from "../../components/superAdmin/home/RevenueGrowth";
import ClientPageHeader from "../../components/superAdmin/client/ClientPageHeader";

function Home() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosInstance.get("/api/dashboard/metrics");
        if (res.data.success) {
          setMetrics(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className=" bg-[#F5F7FF] min-h-screen">

      {/* HEADER */}
      <div className="bg-white rounded-2xl px-6 py-5 border border-[#ECEFFC] shadow-sm">
        <ClientPageHeader
          showCreateButton={false}
          showExportButton={false}
        />
      </div>

      {/* CLIENT + VENDOR OVERVIEW */}
      <div className="mt-2 ">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading metrics...</div>
        ) : (
          <ClientVendorOverview data={metrics} />
        )}
      </div>

      {/* REVENUE */}
      <div className="mt-4 bg-[#EEF1FF] rounded-2xl border border-[#E5E9FF] p-1.5">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading revenue...</div>
        ) : (
          <RevenueGrowth metricsData={metrics?.revenue} />
        )}
      </div>

    </div>
  );
}

export default Home;