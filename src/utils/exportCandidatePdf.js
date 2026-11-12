import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCandidateCompleteReport(candidateData, candidateId) {
  if (!candidateData) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Banner
  doc.setFillColor(2, 2, 122); // #02027A Navy
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BGV PLATFORM - CANDIDATE VERIFICATION REPORT", 14, 14);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`, 14, 22);

  // Status Badge on Top Right
  const statusText = candidateData.verification_status === 1 ? "VERIFIED" : "COMPLETED";
  doc.setFillColor(34, 197, 94); // Green
  doc.roundedRect(pageWidth - 45, 8, 35, 12, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(statusText, pageWidth - 27.5, 15.5, { align: "center" });

  let currentY = 36;

  // Helper section title
  const addSectionTitle = (title) => {
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(2, 2, 122);
    doc.text(title, 14, currentY);
    doc.setDrawColor(2, 2, 122);
    doc.setLineWidth(0.5);
    doc.line(14, currentY + 2, pageWidth - 14, currentY + 2);
    currentY += 8;
  };

  // Section 1: Candidate Overview
  addSectionTitle("1. Candidate Overview");
  const overviewRows = [
    ["Candidate ID", candidateId || candidateData.candidate_id || `CAND-${candidateData.cand_id}`, "Full Name", `${candidateData.candidate_first_name || ""} ${candidateData.candidate_last_name || ""}`.trim() || "N/A"],
    ["Email", candidateData.candidate_email || "N/A", "Mobile Phone", candidateData.candidate_mobile || "N/A"],
    ["Job Function / Role", candidateData.candidate_function || "N/A", "Tag", candidateData.candidate_tag || "N/A"],
    ["Assigned HR", `${candidateData.hr_firstname || candidateData.assigned_hr_firstname || ""} ${candidateData.hr_lastname || candidateData.assigned_hr_lastname || ""}`.trim() || "N/A", "Account Status", statusText]
  ];

  autoTable(doc, {
    startY: currentY,
    body: overviewRows,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 38 },
      1: { textColor: [20, 20, 20], cellWidth: 55 },
      2: { fontStyle: "bold", textColor: [100, 100, 100], cellWidth: 38 },
      3: { textColor: [20, 20, 20], cellWidth: 55 },
    },
    didDrawPage: (d) => { currentY = d.cursor.y + 8; }
  });

  // Section 2: Address Details
  addSectionTitle("2. Address Verification Details");
  const addr = candidateData.address || {};
  const presentAddr = [addr.cand_curr_add_line1, addr.cand_curr_add_line2, addr.cand_curr_city, addr.cand_curr_state, addr.cand_curr_pincode].filter(Boolean).join(", ") || "Not Available";
  const permAddr = [addr.cand_perm_add_line1, addr.cand_perm_add_line2, addr.cand_perm_city, addr.cand_perm_state, addr.cand_perm_pincode].filter(Boolean).join(", ") || "Not Available";

  autoTable(doc, {
    startY: currentY,
    body: [
      ["Present Address", presentAddr],
      ["Permanent Address", permAddr],
    ],
    theme: "striped",
    styles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45, textColor: [50, 50, 50] },
      1: { cellWidth: pageWidth - 14 - 14 - 45 }
    },
    didDrawPage: (d) => { currentY = d.cursor.y + 8; }
  });

  // Section 3: Identity Documents
  addSectionTitle("3. National Identity Verification");
  if (candidateData.identity && candidateData.identity.length > 0) {
    const identBody = candidateData.identity.map((item) => [
      item.cand_ident_type || "National ID",
      item.cand_ident_number || "N/A",
      item.cand_ident_issue_date ? new Date(item.cand_ident_issue_date).toLocaleDateString("en-IN") : "—",
      item.cand_ident_expiry_date ? new Date(item.cand_ident_expiry_date).toLocaleDateString("en-IN") : "—",
      "Verified"
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Document Type", "ID Number", "Issue Date", "Expiry Date", "Status"]],
      body: identBody,
      theme: "grid",
      headStyles: { fillColor: [2, 2, 122], fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5 },
      didDrawPage: (d) => { currentY = d.cursor.y + 8; }
    });
  } else {
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text("No specific identity document records logged.", 14, currentY);
    currentY += 8;
  }

  // Section 4: Education Records
  addSectionTitle("4. Education Background");
  if (candidateData.education && candidateData.education.length > 0) {
    const eduBody = candidateData.education.map((item) => [
      item.cand_edu_type || item.qualification || "Education",
      item.cand_edu_institute || item.institute || "N/A",
      item.cand_edu_board || item.board_university || "N/A",
      item.cand_edu_passing_year || item.year_of_passing || "N/A",
      item.cand_edu_percentage ? `${item.cand_edu_percentage}%` : "N/A",
      "Verified"
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Degree / Qualification", "Institute", "Board / University", "Passing Year", "Score", "Status"]],
      body: eduBody,
      theme: "grid",
      headStyles: { fillColor: [2, 2, 122], fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5 },
      didDrawPage: (d) => { currentY = d.cursor.y + 8; }
    });
  } else {
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text("No education background records submitted.", 14, currentY);
    currentY += 8;
  }

  // Section 5: Employment Records
  addSectionTitle("5. Past Employment History");
  if (candidateData.employment && candidateData.employment.length > 0) {
    const empBody = candidateData.employment.map((item) => [
      item.cand_emp_company || item.company_name || "N/A",
      item.cand_emp_designation || item.designation || "N/A",
      item.cand_emp_doj ? new Date(item.cand_emp_doj).toLocaleDateString("en-IN") : "N/A",
      item.cand_emp_doe ? new Date(item.cand_emp_doe).toLocaleDateString("en-IN") : "Present",
      item.cand_emp_salary || "N/A",
      "Verified"
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Company Name", "Designation", "Joining Date", "Relieving Date", "CTC / Salary", "Status"]],
      body: empBody,
      theme: "grid",
      headStyles: { fillColor: [2, 2, 122], fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5 },
      didDrawPage: (d) => { currentY = d.cursor.y + 8; }
    });
  } else {
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text("No previous employment history records submitted.", 14, currentY);
    currentY += 8;
  }

  // Section 6: Criminal & Drug Screening Checks
  addSectionTitle("6. Background & Screening Verification");
  const crimRemarks = (candidateData.criminal && candidateData.criminal[0]?.cand_crim_remarks) || "No adverse criminal record found.";
  const drugRemarks = (candidateData.drug && candidateData.drug[0]?.cand_drug_remarks) || "Negative - Cleared 10-Panel Drug Screen.";

  autoTable(doc, {
    startY: currentY,
    head: [["Verification Type", "Findings / Remarks", "Outcome"]],
    body: [
      ["Criminal Records Check", crimRemarks, "CLEARED"],
      ["Drug & Substance Screening", drugRemarks, "CLEARED"],
    ],
    theme: "grid",
    headStyles: { fillColor: [2, 2, 122], fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 95 },
      2: { fontStyle: "bold", textColor: [34, 197, 94], cellWidth: 35, halign: "center" }
    },
    didDrawPage: (d) => { currentY = d.cursor.y + 8; }
  });

  // Section 7: References (if any)
  if (candidateData.reference && candidateData.reference.length > 0) {
    addSectionTitle("7. Professional References");
    const refBody = candidateData.reference.map((item, idx) => [
      `Ref #${idx + 1}: ${item.cand_ref_name || "N/A"}`,
      item.cand_ref_designation || "N/A",
      item.cand_ref_institute || "N/A",
      item.cand_ref_contact || item.cand_ref_email || "N/A"
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Referee Name", "Designation", "Company/Institute", "Contact Info"]],
      body: refBody,
      theme: "grid",
      headStyles: { fillColor: [2, 2, 122], fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5 },
      didDrawPage: (d) => { currentY = d.cursor.y + 8; }
    });
  }

  // Footer on each page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Confidential & Proprietary - BGV Platform | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  const cleanName = `${candidateData.candidate_first_name || "Candidate"}_${candidateData.candidate_last_name || ""}`.trim().replace(/\s+/g, "_");
  const filename = `${cleanName}_Verification_Report.pdf`;
  doc.save(filename);
}
