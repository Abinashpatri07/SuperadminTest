import { CheckCircle, XCircle, Download, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import * as XLSX from "xlsx";

const BulkUpload = () => {
  const fileRef = useRef();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [previewData, setPreviewData] = useState([]);

  const handleClick = () => fileRef.current.click();

  const handleReset = () => {
    setFile(null);
    setShowTable(false);
    setUploadResult(null);
    setUploadError(false);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = [".csv", ".xls", ".xlsx"];
    const maxSize = 5 * 1024 * 1024;

    const isValidType = validTypes.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );

    if (!isValidType || selectedFile.size > maxSize) {
      setUploadError(true);
      setFile(null);
      return;
    }

    setUploadError(false);
    setFile(selectedFile);
  };

  const handleFileChange = (e) =>
    validateAndSetFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleDownloadTemplate = () => {
    setDownloading(true);

    setTimeout(() => setDownloading(false), 3000);

    const csv =
      "First Name,Last Name,Phone,Email,Function,Tag\n";

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Sample_template.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientAdminId", 1);

      const res = await axiosInstance.post(
        "/api/client-admin/candidate/bulk-create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setUploadResult({
          created: res.data.created,
          skipped: res.data.skipped,
          total: res.data.totalRecords,
          skippedList: res.data.skippedList || [],
        });
      }
    } catch (err) {
      console.error(err);
      setUploadResult({
        created: 0,
        skipped: previewData.length,
        total: previewData.length,
        skippedList: [],
      });
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
      const parsedData = json.map(item => ({
        name: `${item["First Name"] || item.firstName || item.name || ""} ${item["Last Name"] || item.lastName || ""}`.trim(),
        phone: item["Phone"] || item.phone || "",
        email: item["Email"] || item.email || "",
        function: item["Function"] || item.function || "",
        tag: item["Tag"] || item.tag || "",
      }));
      setPreviewData(parsedData);
      setShowTable(true);
      setShowDuplicateModal(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-[#2B3674]">
            Bulk Upload Candidates
          </h2>

          <p className="text-base text-gray-500 mt-2">
            Upload Multiple Candidate Profiles At Once Using A
            Standardized File Format.
          </p>
        </div>

        {/* ================= RESULT MODAL ================= */}
        {uploadResult && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-3xl p-8 w-[400px] text-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-green-500" />
              </div>
              <h3 className="text-[#01026E] font-bold text-xl mb-2">
                {uploadResult.created} Successful Candidates Added
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Candidates Uploaded Successfully! ✅
              </p>
              <button
                onClick={() => {
                  handleReset();
                  navigate("/super-admin/candidates");
                }}
                className="px-8 py-3 bg-[#01026E] text-white rounded-xl text-base hover:bg-[#02038a] transition font-medium w-full"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {!showTable && (
          <>
            {/* FIRST TIME UPLOADING */}
            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-700">First time uploading?</p>
                  <p className="text-xs text-gray-500 mt-0.5">Download our dummy data template to see the required format.</p>
                </div>
              </div>

              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 bg-[#02027A] hover:bg-[#00005E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shrink-0 ml-4 cursor-pointer"
              >
                <Download size={18} />
                Download CSV Template
              </button>
            </div>

            {/* UPLOAD ZONE */}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer transition ${
                uploadError
                  ? "border-red-300 bg-red-50"
                  : file
                  ? "border-green-300 bg-green-50"
                  : "border-indigo-300 bg-[#F4F7FE] hover:bg-[#eef0fc]"
              }`}
            >
              {file ? (
                <>
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-3">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>

                  <p className="text-base text-green-700 font-semibold">
                    Document uploaded successfully
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    {file.name}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#E0EEFF] flex items-center justify-center mb-3">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 44 44"
                      fill="none"
                    >
                      <path
                        d="M6 14C6 11.8 7.8 10 10 10H18L21 14H34C36.2 14 38 15.8 38 18V32C38 34.2 36.2 36 34 36H10C7.8 36 6 34.2 6 32V14Z"
                        fill="url(#folderGrad)"
                      />

                      <path
                        d="M22 29V21M22 21L19 24M22 21L25 24"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <defs>
                        <linearGradient
                          id="folderGrad"
                          x1="6"
                          y1="10"
                          x2="38"
                          y2="36"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#5BB8F5" />
                          <stop offset="1" stopColor="#1A56DB" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <p className="text-base text-gray-600">
                    <span className="text-[#01026E] font-bold">
                      Click Here
                    </span>{" "}
                    to upload your File or Drag
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Supported formats: .CSV, .XLSX
                  </p>
                </>
              )}

              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                accept=".csv,.xls,.xlsx"
                className="hidden"
              />
            </div>

            {uploadError && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                <XCircle size={16} />
                Upload Failed. Ensure Your File Is In The Correct
                Format And Size.
              </p>
            )}

            {/* GUIDELINES */}
            <div className="bg-[#FDF2F2] border border-[#FECACA] rounded-xl p-4">

              <p className="text-sm font-semibold text-orange-500 mb-2 flex items-center gap-2">
                ⓘ Important Guidelines
              </p>

              <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-5">
                <li>
                  Only .csv, .xls, .xlsx file types are accepted.
                </li>

                <li>
                  Ensure that the sheet includes a header row.
                </li>

                <li>
                  Full name, phone number and e-mail must be
                  present for each candidate.
                </li>

                <li>
                  Keep your file within the allowed size limit
                  (5MB).
                </li>

                <li>
                  Currently, we accept batches of up to 1000
                  records at a time.
                </li>

                <li>
                  We'll highlight any issues after upload.
                </li>
              </ul>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-between pt-3">

              <div>
                {downloading && (
                  <div className="flex items-center gap-2 bg-green-500 text-white text-sm font-medium px-5 py-3 rounded-xl">
                    <CheckCircle size={16} />
                    Downloading Sample_template.csv...
                  </div>
                )}
              </div>

              <div className="flex gap-4 ml-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="px-8 py-2.5 border-2 border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition font-medium cursor-pointer"
                >
                  Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={!file}
                  className="px-10 py-2.5 bg-[#02027A] text-white rounded-xl text-sm hover:bg-[#02038a] disabled:opacity-50 transition font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* TABLE */}
        {showTable && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

            <div className="px-5 pt-5 pb-3 text-base text-gray-500 border-b border-gray-100">
              Total Records: {previewData.length}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-base">

                <thead className="bg-[#FAFAFA] border-b border-gray-200 text-sm tracking-wide sticky top-0">
                  <tr>
                    <th className="px-5 py-4 w-10">
                      <input
                        type="checkbox"
                        className="accent-[#01026E]"
                      />
                    </th>

                    {[
                      "Candidate ID",
                      "Date",
                      "Candidate Name",
                      "Phone Number",
                      "Assigned HR",
                      "Progress",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left font-semibold text-gray-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {previewData.map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          className="accent-[#01026E]"
                        />
                      </td>

                      <td className="px-5 py-4 text-gray-500 font-medium text-sm">
                        Pending
                      </td>

                      <td className="px-5 py-4 text-gray-500 text-sm">
                        {new Date().toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                            {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">{item.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600 text-sm">
                        {item.phone}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            AD
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">
                              Unassigned
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400 rounded-full" style={{ width: `0%` }} />
                          </div>
                          <span className="text-sm text-gray-500">0%</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap bg-gray-100 text-gray-500">
                          Pending
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setPreviewData(prev => prev.filter((_, idx) => idx !== i))}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <XCircle size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4 px-5 py-5 border-t border-gray-200 rounded-b-2xl">

              <button
                onClick={() => {
                  setShowTable(false);
                  setFile(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl text-base text-gray-700 hover:bg-gray-100 transition font-medium cursor-pointer"
              >
                Back
              </button>

              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="px-7 py-3 bg-[#01026E] text-white rounded-xl text-base hover:bg-[#02038a] transition font-medium disabled:opacity-60 cursor-pointer"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showTable && showDuplicateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">

          <div className="bg-white rounded-3xl p-8 w-[400px] text-center shadow-xl">

            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 text-2xl">
                ⚠
              </span>
            </div>

            <h3 className="text-[#01026E] font-semibold text-xl mb-2">
              10 Duplicate Records Found
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              Some candidate data is already registered. You can
              remove duplicates and continue.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  setShowDuplicateModal(false)
                }
                className="px-6 py-3 border border-gray-300 rounded-xl text-base text-gray-700 hover:bg-gray-100 transition font-medium cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={() =>
                  setShowDuplicateModal(false)
                }
                className="px-6 py-3 bg-[#01026E] text-white rounded-xl text-base hover:bg-[#02038a] transition font-medium cursor-pointer"
              >
                Delete Duplicate Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;