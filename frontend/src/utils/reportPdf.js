const formatCurrency = (value = 0) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const escapePdfText = (value) =>
  String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");

const addText = (content, text, x, y, size = 11) => {
  content.push(`BT /F1 ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`);
};

const addLine = (content, x1, y1, x2, y2) => {
  content.push(`${x1} ${y1} m ${x2} ${y2} l S`);
};

const buildPdf = (lines) => {
  const objects = [];
  const content = lines.join("\n");

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

export const downloadAdminReportPdf = (report) => {
  const content = [];
  const generatedDate = new Date(report.generatedAt || Date.now());
  let y = 744;

  addText(content, "V SHOP", 48, y, 24);
  addText(content, "Admin Marketplace Report", 48, y - 28, 18);
  addText(content, `Generated: ${generatedDate.toLocaleString()}`, 48, y - 48, 10);
  addLine(content, 48, y - 62, 564, y - 62);
  y -= 92;

  addText(content, "Summary", 48, y, 15);
  y -= 24;
  [
    ["Total revenue", formatCurrency(report.summary?.totalRevenue)],
    ["Total orders", report.summary?.totalOrders || 0],
    ["Total vendors", report.summary?.totalVendors || 0],
    ["Total customers", report.summary?.totalCustomers || 0],
    ["Pending vendor approvals", report.summary?.pendingVendorApprovals || 0],
  ].forEach(([label, value]) => {
    addText(content, `${label}: ${value}`, 58, y, 11);
    y -= 18;
  });

  y -= 12;
  addText(content, "Top Selling Products", 48, y, 15);
  y -= 24;
  (report.topSellingProducts || []).slice(0, 6).forEach((product, index) => {
    addText(
      content,
      `${index + 1}. ${product.name} | ${product.category} | Sold: ${product.sold || 0} | Revenue: ${formatCurrency(product.revenue)}`,
      58,
      y,
      10
    );
    y -= 16;
  });

  y -= 12;
  addText(content, "Recent Orders", 48, y, 15);
  y -= 24;
  (report.recentOrders || []).slice(0, 7).forEach((order, index) => {
    addText(
      content,
      `${index + 1}. ${order.customer} | ${order.status} | ${order.paymentStatus} | ${formatCurrency(order.totalAmount)}`,
      58,
      y,
      10
    );
    y -= 16;
  });

  y -= 12;
  addText(content, "Reviews Summary", 48, y, 15);
  y -= 24;
  addText(content, `Total reviews: ${report.reviewsSummary?.totalReviews || 0}`, 58, y, 11);
  addText(content, `Average rating: ${report.reviewsSummary?.averageRating || 0}`, 220, y, 11);
  addText(content, `Low rating alerts: ${report.reviewsSummary?.lowRatingReviews || 0}`, 380, y, 11);

  const blob = buildPdf(content);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = generatedDate.toISOString().slice(0, 10);

  link.href = url;
  link.download = `VSHOP_Report_${dateStamp}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
