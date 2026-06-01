import { useEffect, useMemo, useState } from "react";
import { generateReport } from "../../services/reportService";
import { downloadAdminReportPdf } from "../../utils/reportPdf";

const currency = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "INR",
});

const number = new Intl.NumberFormat("en-IN");

const formatCurrency = (value) => currency.format(Number(value || 0));
const formatNumber = (value) => number.format(Number(value || 0));
const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "";

const reportSections = [
  {
    title: "Revenue Report",
    accent: "dashboard-card--purple",
    metrics: [
      ["Total Revenue", "totalRevenue", formatCurrency],
      ["Revenue Today", "revenueToday", formatCurrency],
      ["Revenue This Week", "revenueThisWeek", formatCurrency],
      ["Revenue This Month", "revenueThisMonth", formatCurrency],
      ["Revenue Growth", "revenueGrowthPercent", (value) => `${Number(value || 0).toFixed(1)}%`],
    ],
  },
  {
    title: "Order Report",
    accent: "dashboard-card--cyan",
    metrics: [
      ["Total Orders", "totalOrders", formatNumber],
      ["Pending Orders", "pendingOrders", formatNumber],
      ["Completed Orders", "completedOrders", formatNumber],
      ["Cancelled Orders", "cancelledOrders", formatNumber],
      ["Refund Requests", "refundRequests", formatNumber],
    ],
  },
  {
    title: "Vendor Report",
    accent: "dashboard-card--blue",
    metrics: [
      ["Total Vendors", "totalVendors", formatNumber],
      ["Approved Vendors", "approvedVendors", formatNumber],
      ["Pending Vendors", "pendingVendors", formatNumber],
      ["Rejected Vendors", "rejectedVendors", formatNumber],
    ],
  },
  {
    title: "Customer Report",
    accent: "dashboard-card--violet",
    metrics: [
      ["Total Customers", "totalCustomers", formatNumber],
      ["Active Customers", "activeCustomers", formatNumber],
      ["New Customers", "newCustomers", formatNumber],
      ["Repeat Customers", "repeatCustomers", formatNumber],
    ],
  },
  {
    title: "Product Report",
    accent: "dashboard-card--purple",
    metrics: [
      ["Total Products", "totalProducts", formatNumber],
      ["Active Products", "activeProducts", formatNumber],
      ["Low Stock Products", "lowStockProducts", formatNumber],
      ["Out Of Stock Products", "outOfStockProducts", formatNumber],
    ],
  },
  {
    title: "Review Report",
    accent: "dashboard-card--cyan",
    source: "reviewsSummary",
    metrics: [
      ["Total Reviews", "totalReviews", formatNumber],
      ["Average Rating", "averageRating", (value) => Number(value || 0).toFixed(1)],
      ["Positive Reviews", "positiveReviews", formatNumber],
      ["Negative Reviews", "negativeReviews", formatNumber],
    ],
  },
];

const toCsv = (report) => {
  const rows = [["Section", "Metric", "Value"]];

  reportSections.forEach((section) => {
    const source = section.source ? report[section.source] || {} : report.summary || {};
    section.metrics.forEach(([label, key]) => {
      rows.push([section.title, label, source[key] ?? 0]);
    });
  });

  return rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
};

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const summaryText = useMemo(() => {
    if (!report) return "";
    return `${formatCurrency(report.summary?.totalRevenue)} revenue from ${formatNumber(
      report.summary?.totalOrders
    )} orders, ${formatNumber(report.summary?.totalVendors)} vendors, and ${formatNumber(
      report.summary?.totalCustomers
    )} customers.`;
  }, [report]);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError("");
      setReport(await generateReport());
    } catch (err) {
      setError(err.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    generateReport()
      .then((data) => {
        if (isMounted) {
          setReport(data);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to generate report");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCsvExport = () => {
    if (!report) return;
    const blob = new Blob([toCsv(report)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-report-${new Date(report.generatedAt).toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Reports</p>
          <h1>Marketplace analytics reports.</h1>
          <p>Generate live executive reports directly from MongoDB data.</p>
        </div>

        <div className="modal-actions">
          {report ? (
            <>
              <button className="text-button" type="button" onClick={() => window.print()}>
                Print Page
              </button>
              <button className="text-button" type="button" onClick={() => downloadAdminReportPdf(report)}>
                Download PDF
              </button>
              <button className="text-button" type="button" onClick={handleCsvExport}>
                Export CSV
              </button>
            </>
          ) : null}
          <button className="hero-action" onClick={handleGenerateReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </section>

      {error ? <p className="admin-action-status admin-action-status--error">{error}</p> : null}

      {report ? (
        <section className="report-stack">
          <article className="glass-panel report-summary-panel">
            <div className="panel-header">
              <div>
                <p className="admin-eyebrow">Generated {formatDateTime(report.generatedAt)}</p>
                <h2>Report Summary</h2>
              </div>
              <span className="panel-pill">{Number(report.summary?.revenueGrowthPercent || 0).toFixed(1)}% growth</span>
            </div>
            <p>{summaryText}</p>
          </article>

          {reportSections.map((section) => {
            const source = section.source ? report[section.source] || {} : report.summary || {};
            return (
              <article className="glass-panel" key={section.title}>
                <div className="panel-header">
                  <div>
                    <p className="admin-eyebrow">Live MongoDB data</p>
                    <h2>{section.title}</h2>
                  </div>
                </div>
                <div className="report-metric-grid">
                  {section.metrics.map(([label, key, formatter]) => (
                    <div className={`dashboard-card ${section.accent}`} key={key}>
                      <div className="dashboard-card__top">
                        <span>{label}</span>
                        <strong>Live</strong>
                      </div>
                      <h2>{formatter(source[key])}</h2>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}

          <section className="report-data-grid">
            <ReportChart title="Revenue Trend" rows={report.charts?.revenueTrend || []} valueKey="revenue" formatter={formatCurrency} />
            <ReportChart title="Order Trend" rows={report.charts?.orderTrend || []} valueKey="orders" formatter={formatNumber} />
          </section>

          <section className="report-data-grid">
            <ReportTable
              title="Top Selling Products"
              columns={["Product", "Category", "Sold", "Revenue"]}
              rows={(report.topSellingProducts || []).map((product) => [
                product.name,
                product.category,
                formatNumber(product.sold),
                formatCurrency(product.revenue),
              ])}
            />
            <ReportTable
              title="Recent Orders"
              columns={["Customer", "Status", "Payment", "Total"]}
              rows={(report.recentOrders || []).map((order) => [
                order.customer,
                order.status,
                order.paymentStatus,
                formatCurrency(order.totalAmount),
              ])}
            />
          </section>
        </section>
      ) : (
        <section className="glass-panel">
          <div className="notification-state">Generate a report to view live marketplace metrics.</div>
        </section>
      )}
    </div>
  );
}

function ReportChart({ title, rows, valueKey, formatter }) {
  const maxValue = Math.max(...rows.map((row) => Number(row[valueKey] || 0)), 1);

  return (
    <article className="glass-panel">
      <div className="panel-header"><div><p className="admin-eyebrow">Trend</p><h2>{title}</h2></div></div>
      <div className="report-chart">
        {rows.length ? rows.map((row) => (
          <div className="report-chart__bar" key={row._id}>
            <span style={{ height: `${Math.max(8, (Number(row[valueKey] || 0) / maxValue) * 100)}%` }} />
            <small>{String(row._id).slice(5)}</small>
            <strong>{formatter(row[valueKey])}</strong>
          </div>
        )) : <div className="notification-state">No trend data available.</div>}
      </div>
    </article>
  );
}

function ReportTable({ title, columns, rows }) {
  return (
    <article className="glass-panel orders-panel">
      <div className="panel-header"><div><p className="admin-eyebrow">Table</p><h2>{title}</h2></div></div>
      <table className="admin-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, index) => (
            <tr key={`${title}-${index}`}>
              {row.map((cell, cellIndex) => <td key={`${title}-${index}-${cellIndex}`}>{cell}</td>)}
            </tr>
          )) : (
            <tr><td colSpan={columns.length}>No records available.</td></tr>
          )}
        </tbody>
      </table>
    </article>
  );
}

export default ReportsPage;
