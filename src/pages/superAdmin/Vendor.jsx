import React, { useState } from "react";
import VendorStats from "../../components/superAdmin/vendor/VendorStats";
import VendorTable from "../../components/superAdmin/vendor/VendorTable";
import ClientPageHeader from "../../components/superAdmin/client/ClientPageHeader";

export default function Vendor() {
  const [stats, setStats] = useState({
    total: "0",
    active: "0",
    inactive: "0",
    suspended: "0",
  });
  return (
    <div className="p-4 flex flex-col">

      {/* HEADER */}
      <ClientPageHeader
        showCreateButton={true}
        showExportButton={false}
        createType="vendor"
      />

      {/* STATS */}
      <div className="mt-5">
        <VendorStats statsData={stats} />
      </div>

      {/* TABLE */}
      <VendorTable onStatsFetched={setStats} />

      {/* PAGINATION */}
      {/* <div className="mt-4">
        <Pagination
          total={40}
          perPage={9}
          current={1}
          onChange={(page) => console.log("page", page)}
        />
      </div> */}

    </div>
  );
}