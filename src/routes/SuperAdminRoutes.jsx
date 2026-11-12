import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import SuperAdminLayout from "../layouts/SuperAdminLayout";

/* AUTH */
import Login from "../pages/superAdmin/Login";
import Signup from "../pages/superAdmin/Signup";
import ForgotPassword from "../components/superAdmin/login/ForgotPassword";
import ResetPassword from "../components/superAdmin/login/ResetPassword";

/* DASHBOARD AND CASES */
import Home from "../pages/superAdmin/Home";
import Analytics from "../pages/superAdmin/Analytics";
import SuperAdminCases from "../pages/superAdmin/SuperAdminCases";
import SuperAdminEmploymentDetails from "../pages/superAdmin/SuperAdminEmploymentDetails";
import SuperAdminAddressDetails from "../pages/superAdmin/SuperAdminAddressDetails";
import SuperAdminDrugTestDetails from "../pages/superAdmin/SuperAdminDrugTestDetails";
import SuperAdminEducationDetails from "../pages/superAdmin/SuperAdminEducationDetails";
import SuperAdminCriminalDetails from "../pages/superAdmin/SuperAdminCriminalDetails";
import SuperAdminIdentificationDetails from "../pages/superAdmin/SuperAdminIdentificationDetails";
import SuperAdminReferenceDetails from "../pages/superAdmin/SuperAdminReferenceDetails";
import SuperAdminAssignedApplications from "../pages/superAdmin/SuperAdminAssignedApplications";
import SuperAdminVerifiedApplications from "../pages/superAdmin/SuperAdminVerifiedApplications";
import SuperAdminRefuteApplications from "../pages/superAdmin/SuperAdminRefuteApplications";
import SuperAdminUnverifiedApplications from "../pages/superAdmin/SuperAdminUnverifiedApplications";

/* CLIENT */
import ClientListPage from "../pages/superAdmin/ClientListPage";
import CreateClientPage from "../pages/superAdmin/CreateClientPage";
import ViewClientPage from "../pages/superAdmin/ViewClientPage";
import EditClientPage from "../pages/superAdmin/EditClientPage";

/* VENDOR */
import Vendor from "../pages/superAdmin/Vendor";
import CreateVendor from "../pages/superAdmin/CreateVendor";

/* HR */
import Hr from "../pages/superAdmin/Hr";
import CreateHR from "../pages/superAdmin/CreateHR";
import ViewHr from "../pages/superAdmin/ViewHr";
import EditHr from "../pages/superAdmin/EditHr";

/* CANDIDATES */
import Candidates from "../pages/superAdmin/Candidates";

/* ASSIGN VERIFICATION */
import AssignVerificationOfficer from "../pages/superAdmin/AssignVerificationOfficerPage";
import CreateCandidateForm from "../components/superAdmin/candidate/CreateCandidateForm";

import BulkUpload from "../pages/superAdmin/BulkUpload";
import View from "../components/superAdmin/candidate/View";
import EditCandidate from "../components/superAdmin/candidate/EditCandidate";
import BulkAssignPage from "../pages/superAdmin/BulkAssignPage";
import ViewVendor from "../pages/superAdmin/ViewVendor";
import EditVendor from "../pages/superAdmin/EditVendor";
import Billing from "../pages/superAdmin/Billing";

function SuperAdminRoutes() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />

      {/* PROTECTED LAYOUT */}
      <Route
        path="/"
        element={
          <ProtectedRoute role="super-admin">
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        {/* HOME */}
        <Route path="home" element={<Home />} />

        {/* ANALYTICS */}
        <Route path="analytics" element={<Analytics />} />

        {/* CLIENT */}
        <Route path="clients" element={<ClientListPage />} />

        <Route path="create-client" element={<CreateClientPage />} />

        <Route path="clients/view/:id" element={<ViewClientPage />} />

        <Route path="clients/edit/:id" element={<EditClientPage />} />

        {/* VENDOR */}
        <Route path="vendor" element={<Vendor />} />

        <Route path="create-vendor" element={<CreateVendor />} />
        <Route path="view-vendor/:id" element={<ViewVendor />} />
        <Route path="edit-vendor/:id" element={<EditVendor />} />

        {/* HR */}
        <Route path="hr" element={<Hr />} />

        <Route path="create-hr" element={<CreateHR />} />

        <Route path="view-hr/:id" element={<ViewHr />} />

        <Route path="edit-hr/:id" element={<EditHr />} />

        <Route path="candidate" element={<Candidates />} />

        <Route path="create-candidate" element={<CreateCandidateForm />} />

        <Route path="create-candidate-bulk" element={<BulkUpload />} />

         <Route path="view/:id" element={<View />} />
        <Route path="edit-candidate/:id" element={<EditCandidate />} />
        
        {/* CASES AND DETAILS */}
        <Route path="cases" element={<SuperAdminCases />} />
        <Route path="identification-details" element={<SuperAdminIdentificationDetails />} />
        <Route path="employment-details" element={<SuperAdminEmploymentDetails />} />
        <Route path="address-details" element={<SuperAdminAddressDetails />} />
        <Route path="drug-test-details" element={<SuperAdminDrugTestDetails />} />
        <Route path="education-details" element={<SuperAdminEducationDetails />} />
        <Route path="criminal-details" element={<SuperAdminCriminalDetails />} />
        <Route path="reference-details" element={<SuperAdminReferenceDetails />} />
        <Route path="cases/assigned" element={<SuperAdminAssignedApplications />} />
        <Route path="cases/verified" element={<SuperAdminVerifiedApplications />} />
        <Route path="cases/refuted" element={<SuperAdminRefuteApplications />} />
        <Route path="cases/unverified" element={<SuperAdminUnverifiedApplications />} />

        {/* ASSIGN VERIFICATION */}
        <Route
          path="assign-verification"
          element={<AssignVerificationOfficer />}
        />
        <Route path="bulk-assign" element={<BulkAssignPage />} />

        {/* BILLING */}
        <Route path="billing" element={<Billing />} />
      </Route>
    </Routes>
  );
}

export default SuperAdminRoutes;
