import React from "react";

import PageHeader from "../../components/superAdmin/client/PageHeader";
import CreateClientForm from "../../components/superAdmin/client/CreateClientForm";

export default function CreateClientPage() {
  return (
    <div className="min-h-screen px-8 py-6">

      {/* Header */}
      <PageHeader
        title="Create A New Client"
        subtitle="Create a client account to manage users and verifications."
        breadcrumb1="Client"
        breadcrumb2="Create Client"
        backPath="/super-admin/clients"
      />

      {/* Form */}
      <CreateClientForm />

    </div>
  );
}