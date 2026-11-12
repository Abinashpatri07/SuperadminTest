import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadPDF(data, title, filename) {
  if (!data || !data.length) return;
  
  const doc = new jsPDF();
  
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj));

  doc.setFontSize(14);
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] } // matches the UI color theme
  });

  doc.save(filename);
}

export function downloadSingleInvoicePDF(invoiceData) {
  if (!invoiceData) return;
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229);
  doc.text("INVOICE", 105, 20, { align: "center" });
  
  // Invoice Details
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text(`Invoice Number: ${invoiceData.invoice}`, 14, 40);
  doc.text(`Date: ${invoiceData.date}`, 14, 47);
  doc.text(`Status: ${invoiceData.status}`, 14, 54);
  
  // Table
  autoTable(doc, {
    startY: 65,
    head: [["Description", "Type", "Amount"]],
    body: [
      [invoiceData.description, invoiceData.subdescription, invoiceData.amount]
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }
  });
  
  // Total
  const finalY = doc.lastAutoTable.finalY || 90;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Amount: ${invoiceData.amount}`, 14, finalY + 15);
  
  doc.save(`${invoiceData.invoice}.pdf`);
}
