import { useState } from "react";
import { generateReport } from "../../services/reportService";

function ReportsPage() {
  const [loading, setLoading] =
    useState(false);

  const [report, setReport] =
    useState(null);

  const [error, setError] =
    useState("");

  const handleGenerateReport =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await generateReport();

        setReport(data);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to generate report"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">
            Reports
          </p>

          <h1>
            Marketplace analytics reports.
          </h1>

          <p>
            Generate live reports directly
            from MongoDB data.
          </p>
        </div>

        <button
          className="hero-action"
          onClick={
            handleGenerateReport
          }
        >
          {loading
            ? "Generating..."
            : "Generate Report"}
        </button>
      </section>

      {error && <h2>{error}</h2>}

      {report && (
        <section className="glass-panel">
          <h2>Generated Report</h2>

          <pre>
            {JSON.stringify(
              report,
              null,
              2
            )}
          </pre>
        </section>
      )}
    </div>
  );
}

export default ReportsPage;