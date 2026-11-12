import { useParams } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../../API/axiosInstance";
import {
  User,
  MapPin,
  IdCard,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Activity,
  Users,
  CheckCircle,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    {name === "phone" ? (
      <div className="border rounded-lg transition border-gray-300">
        <PhoneInput
          country={'in'}
          countryCodeEditable={false}
          value={value}
          onChange={(phone) => onChange({ target: { name: "phone", value: phone } })}
          enableSearch={true}
          disableSearchIcon={true}
          inputStyle={{ width: '100%', height: '38px', border: 'none', background: 'transparent', fontSize: '14px', paddingLeft: '48px' }}
          buttonStyle={{ border: 'none', background: '#f9fafb', padding: '0 4px', borderRight: '1px solid #e5e7eb' }}
        />
      </div>
    ) : (
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#01026E]"
      />
    )}
  </div>
);

const EditCandidate = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Personal");
  const [showEducationView, setShowEducationView] = useState(false);
  const [showEmploymentView, setShowEmploymentView] = useState(false);
  const [criminalView, setCriminalView] = useState(false);
  const [drugView, setDrugView] = useState(false);
  const [identityView, setIdentityView] = useState(null);

  const tabs = [
    { name: "Personal", icon: User },
    { name: "Address", icon: MapPin },
    { name: "Identity", icon: IdCard },
    { name: "Education", icon: GraduationCap },
    { name: "Employment", icon: Briefcase },
    { name: "Criminal", icon: ShieldAlert },
    { name: "Drug", icon: Activity },
    { name: "Reference", icon: Users },
  ];

  const handleSaveProfile = async () => {

  try {

    const finalData = {
      name: "Ramesh Kumar Mishra",
      phone: "1234567890",
      email: "abcdsew67@mail.com",
      function: "Product",
      tag: "May Batch",
    };

    const response = await axiosInstance.put(
      `/api/candidate/update/${id}`,
      finalData
    );

    console.log(response.data);

    alert(response.data.message);

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#F4F7FE] min-h-screen">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800">
        Edit Candidate Profile
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Update Information And Manage Verification Status For Ramesh Kumar
        Mishra.
      </p>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md border">
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 py-4 border-b text-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setIdentityView(null);
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#01026E] text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Only Personal Tab (others can be added later) */}
          {activeTab === "Personal" && (
            <>
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                General Profile Details And Contact Information.
              </p>

              <div className="grid grid-cols-2 gap-5">
                <InputField label="Name" value="Ramesh Kumar Mishra" />
                <InputField label="Phone no" name="phone" value="1234567890" />

                <InputField label="Email" value="abcdsew67@mail.com" />
                <InputField label="Date Of Birth" value="5/10/1998" />

                <InputField label="Function" value="Product" />
                <InputField label="Tag" value="May Batch" />
              </div>
            </>
          )}

          {activeTab === "Address" && (
            <>
              {/* Present Address */}
              <h3 className="text-lg font-semibold text-gray-800">
                Present Address
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                General Profile Details And Contact Information.
              </p>

              <div className="grid grid-cols-2 gap-5 mb-8">
                <InputField label="House And Apartment Number" value="G-501" />
                <InputField label="Pin Code" value="524158" />

                <InputField
                  label="Address Line 1"
                  value="Kula Layout, Sanjib Nagar 3 Rd Phase"
                />
                <InputField
                  label="Address Line 2"
                  value="Bingolike, Bangalore"
                />

                <InputField label="City" value="Bangalore" />
                <InputField label="State" value="Karnataka" />
              </div>

              {/* Permanent Address */}
              <h3 className="text-lg font-semibold text-gray-800">
                Permanent Address
              </h3>

              <div className="grid grid-cols-2 gap-5">
                <InputField
                  label="House And Apartment Number"
                  value="14 Krishna Avenue"
                />
                <InputField label="Pin Code" value="110009" />

                <InputField label="Address Line 1" value="Model Town" />
                <InputField label="Address Line 2" value="New Delhi" />

                <InputField label="City" value="Delhi" />
                <InputField label="State" value="Delhi" />
              </div>
            </>
          )}
          {activeTab === "Identity" && (
            <>
              {!identityView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Identity Information
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    General Profile Details And Contact Information.
                  </p>

                  <div className="space-y-5">
                    {/* Passport */}
                    <div className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-[#01026E]">Passport</h4>
                        <div className="flex items-center gap-4">
                          <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} /> Verified
                          </span>
                          <div 
                            onClick={() => setIdentityView("passport")}
                            className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </div>
                      </div>

                      <InputField label="ID Number" value="OFE5214VD80015" />
                    </div>

                    {/* PAN Card */}
                    <div className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-[#01026E]">Pan Card</h4>
                        <div className="flex items-center gap-4">
                          <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} /> Verified
                          </span>
                          <div 
                            onClick={() => setIdentityView("pan")}
                            className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </div>
                      </div>

                      <InputField label="Card Number" value="JAHPQ6443G" />
                    </div>

                    {/* Driving License */}
                    <div className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-[#01026E]">
                          Driving License
                        </h4>
                        <div className="flex items-center gap-4">
                          <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} /> Verified
                          </span>
                          <div 
                            onClick={() => setIdentityView("dl")}
                            className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </div>
                      </div>

                      <InputField label="License Number" value="DL-04202000045" />
                    </div>

                    {/* Voter ID */}
                    <div className="border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-[#01026E]">Voter ID</h4>
                        <div className="flex items-center gap-4">
                          <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} /> Verified
                          </span>
                          <div 
                            onClick={() => setIdentityView("voter")}
                            className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </div>
                      </div>

                      <InputField label="Voter ID Number" value="XYZ9088271" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Identity Details
                    </h3>
                    <button 
                      onClick={() => setIdentityView(null)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        {identityView === "passport" && (
                          <>
                            <InputField label="Name" value="Ramesh Kumar Mishra" />
                            <InputField label="Passport Number" value="OFE5214VD80015" />
                            <InputField label="Issue Date" value="12/05/2018" />
                            <InputField label="Expiry Date" value="11/05/2028" />
                            <InputField label="Nationality" value="Indian" />
                          </>
                        )}
                        {identityView === "pan" && (
                          <>
                            <InputField label="Name" value="Ramesh Kumar Mishra" />
                            <InputField label="PAN Number" value="JAHPQ6443G" />
                            <InputField label="Issue Date" value="20/08/2020" />
                            <InputField label="Date Of Birth" value="05/10/1998" />
                            <InputField label="Father's Name" value="Suresh Kumar Mishra" />
                          </>
                        )}
                        {identityView === "dl" && (
                          <>
                            <InputField label="Name" value="Ramesh Kumar Mishra" />
                            <InputField label="DL Number" value="DL-04202000045" />
                            <InputField label="Issue Date" value="15/01/2019" />
                            <InputField label="Expiry Date" value="14/01/2039" />
                            <InputField label="Vehicle Class" value="MCWG, LMV" />
                          </>
                        )}
                        {identityView === "voter" && (
                          <>
                            <InputField label="Name" value="Ramesh Kumar Mishra" />
                            <InputField label="Voter ID Number" value="XYZ9088271" />
                            <InputField label="Date Of Birth" value="05/10/1998" />
                            <InputField label="Assembly Constituency" value="Model Town" />
                            <InputField label="Epic Number" value="XYZ9088271" />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">Document Preview</p>
                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        alt="document preview"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Education" && (
            <>
              {!showEducationView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Education Details
                  </h3>

                  <div className="space-y-4 mt-4">
                    {[
                      "Matriculation",
                      "Intermediate",
                      "Graduation",
                      "Post Graduation",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between border rounded-xl px-4 py-3 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle size={18} className="text-green-500" />
                          <span className="text-sm font-medium text-[#01026E]">
                            {item}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-gray-500">
                          <Eye
                            size={16}
                            className="cursor-pointer hover:text-black"
                            onClick={() => setShowEducationView(true)}
                          />
                          <Trash2
                            size={16}
                            className="cursor-pointer text-red-500 hover:text-red-600"
                            onClick={() => {
                              console.log("Delete clicked:", item);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* 🔥 EDUCATION DETAILS VIEW */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Education Details
                  </h3>

                  <div className="grid grid-cols-3 gap-6">
                    {/* LEFT FORM */}
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <InputField
                          label="Institute Name"
                          value="Noida Group Of Institutions"
                        />
                        <InputField label="Degree" value="M tech" />

                        <InputField label="Start Date" value="25/5/2018" />
                        <InputField label="End Date" value="06/04/2022" />

                        <InputField
                          label="Course"
                          value="Computer Science Engineering"
                        />
                        <InputField label="Percentage/CGPA" value="8.9 CGPA" />
                      </div>
                    </div>

                    {/* RIGHT PREVIEW */}
                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">
                        Preview
                      </p>

                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        alt="certificate"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {activeTab === "Employment" && (
            <>
              {!showEmploymentView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Employment Details
                  </h3>

                  <div className="mt-5">
                    <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
                      {/* Left */}
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-semibold text-gray-800">
                            UI/UX Designer
                          </h4>
                          <Pencil
                            size={16}
                            className="text-gray-500 cursor-pointer"
                          />
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          DQnex Consultant
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Full-Time | May 2024 To Aug 2026 (18 Months)
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          Responsible UI UX Designer And Web Or Application
                          Designer
                        </p>
                      </div>

                      {/* Right */}
                      <div
                        onClick={() => setShowEmploymentView(true)}
                        className="flex items-center gap-2 text-[#01026E] cursor-pointer"
                      >
                        <Eye size={16} />
                        <span className="text-sm">view</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* 🔥 EMPLOYMENT DETAILS VIEW */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Employment Details
                  </h3>

                  <div className="grid grid-cols-3 gap-6">
                    {/* LEFT FORM */}
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <InputField label="Employee ID" value="GAD54217899" />
                        <InputField
                          label="Company Name"
                          value="DQnex Private LTD"
                        />

                        <InputField label="From Date" value="25/5/2018" />
                        <InputField label="To Date" value="06/04/2024" />

                        <InputField
                          label="Designation"
                          value="UI/UX Designer"
                        />
                        <InputField label="Drawn CTC" value="9 LPA" />
                      </div>
                    </div>

                    {/* RIGHT PREVIEW */}
                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">
                        Preview
                      </p>

                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Criminal" && (
            <>
              {!criminalView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Criminal Record
                  </h3>

                  <div className="mt-4 mb-6">
                    <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Criminal Record Exist
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Case Number 1547254
                        </p>
                      </div>

                      <div
                        onClick={() => setCriminalView(true)}
                        className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                      >
                        <Eye size={16} />
                        <span className="text-sm font-medium">View</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Criminal Details
                    </h3>
                    <button 
                      onClick={() => setCriminalView(false)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <InputField label="Name" value="Ramesh Kumar Mishra" />
                        <InputField label="Case No" value="BAN472-98201" />

                        <div className="col-span-2">
                          <label className="text-sm text-gray-600 mb-1 block">
                            Case Details
                          </label>

                          <textarea
                            className="w-full border rounded-lg px-3 py-2 text-sm h-28"
                            defaultValue="On [date], the accused committed offense... case under trial."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">
                        Preview
                      </p>

                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        alt="document preview"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Drug" && (
            <>
              {!drugView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Drug Test Report
                  </h3>

                  <div className="mt-4">
                    <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Drug Test Report Available
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Report Number 154872031
                        </p>
                      </div>

                      <div
                        onClick={() => setDrugView(true)}
                        className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                      >
                        <Eye size={16} />
                        <span className="text-sm font-medium">View</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Drug Details
                    </h3>
                    <button 
                      onClick={() => setDrugView(false)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <InputField label="Name" value="Ramesh Kumar Mishra" />
                        <InputField label="Test Id" value="15498201" />

                        <div className="col-span-2">
                          <label className="text-sm text-gray-600 mb-1 block">
                            Test Details
                          </label>

                          <textarea
                            className="w-full border rounded-lg px-3 py-2 text-sm h-28"
                            defaultValue="The drug test ensures a safe workplace..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">
                        Preview
                      </p>

                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        alt="document preview"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {activeTab === "Reference" && (
            <>
              <h3 className="text-lg font-semibold text-[#01026E]">
                Reference Details
              </h3>

              {/* Reference 1 */}
              <h4 className="mt-4 font-medium text-[#01026E]">Reference 1</h4>

              <div className="grid grid-cols-2 gap-5 mt-3">
                <InputField label="Name *" value="Varun Kummel" />
                <InputField label="Phone no *" value="+91 1234567890" />

                <InputField label="Email *" value="abcsdew67@mail.com" />
                <InputField label="Gender *" value="Male" />

                <InputField
                  label="Institute Name *"
                  value="Brindavan College of Engineering"
                />
                <InputField label="Designation *" value="Director" />
              </div>

              {/* Reference 2 */}
              <h4 className="mt-6 font-medium text-[#01026E]">Reference 2</h4>

              <div className="grid grid-cols-2 gap-5 mt-3">
                <InputField label="Name *" value="Manisha Dixit" />
                <InputField label="Phone no *" value="+91 1234567890" />

                <InputField label="Email *" value="manishad5487@gmail.com" />

                {/* Dropdown for Gender */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Gender *
                  </label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>

                <InputField
                  label="Institute Name *"
                  value="Brindavan College of Engineering"
                />
                <InputField label="Designation *" value="Professor" />
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-gray-400">
              Last edited by Admin on Oct 24, 2023
            </p>

            <div className="flex gap-3">
              {/* Cancel → go back from education view */}
              <button
                onClick={() => {
                  if (showEducationView) {
                    setShowEducationView(false);
                  } else if (showEmploymentView) {
                    setShowEmploymentView(false);
                  } else if (criminalView) {
                    setCriminalView(false);
                  } else if (drugView) {
                    setDrugView(false);
                  } else if (identityView) {
                    setIdentityView(null);
                  } else {
                    console.log("Go back or reset form");
                  }
                }}
              >
                Cancel
              </button>

              {/* Save → works for both normal + education */}
              <button
  onClick={handleSaveProfile}
  className="px-5 py-2 bg-[#01026E] text-white rounded-lg text-sm"
>
  Save Profile Details
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCandidate;
