import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Removes mongo-internal fields and flattens for export
function cleanRows(rows) {
  return rows.map((row) => {
    const { _id, __v, createdAt, updatedAt, ...rest } = row;
    return {
      ...rest,
      Created: createdAt ? new Date(createdAt).toLocaleString() : "",
    };
  });
}

export function exportToExcel(rows, filename = "export") {
  const cleaned = cleanRows(rows);
  const worksheet = XLSX.utils.json_to_sheet(cleaned);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(rows, filename = "export", title = "Report") {
  const cleaned = cleanRows(rows);
  if (cleaned.length === 0) return;

  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 21);

  const columns = Object.keys(cleaned[0]);
  const body = cleaned.map((row) => columns.map((c) => (row[c] ?? "").toString()));

  autoTable(doc, {
    head: [columns],
    body,
    startY: 26,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [30, 64, 175] },
  });

  doc.save(`${filename}.pdf`);
}
