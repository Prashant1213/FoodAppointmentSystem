import { useEffect, useState } from "react";
import axios from "../axios";

function AdminMonthlyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/admin/reports/monthly");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching monthly reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getMonthName = (month) => {
    return new Date(2000, month - 1, 1).toLocaleString("default", {
      month: "long",
    });
  };

  const getMaxBookings = () => {
    if (reports.length === 0) return 1;

    return Math.max(
      ...reports.map((report) => Number(report.bookings)),
      1
    );
  };

  return (
    <div className="container mt-4 mb-5">

      {/* Page Title */}
      <h2 className="mb-4">Monthly Reports</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status"></div>
          <p className="mt-2">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="alert alert-info">
          No confirmed booking reports available.
        </div>
      ) : (
        <>
          {/* Monthly Confirmed Bookings */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-4">
                Monthly Confirmed Bookings
              </h5>

              {reports.map((report, index) => {
                const percentage =
                  (Number(report.bookings) / getMaxBookings()) * 100;

                return (
                  <div key={index} className="mb-4">

                    <div className="d-flex justify-content-between mb-2">
                      <strong>
                        {getMonthName(report.month)} {report.year}
                      </strong>

                      <span className="fw-bold">
                        {report.bookings}{" "}
                        {Number(report.bookings) === 1
                          ? "booking"
                          : "bookings"}
                      </span>
                    </div>

                    <div
                      className="progress"
                      style={{ height: "30px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${percentage}%`,
                        }}
                        aria-valuenow={report.bookings}
                        aria-valuemin="0"
                        aria-valuemax={getMaxBookings()}
                      >
                        {report.bookings}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Advance Revenue */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-4">
                Monthly Advance Revenue
              </h5>

              {reports.map((report, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center border-bottom py-3"
                >
                  <div>
                    <strong>
                      {getMonthName(report.month)} {report.year}
                    </strong>

                    <div className="text-muted small">
                      {report.bookings} confirmed{" "}
                      {Number(report.bookings) === 1
                        ? "booking"
                        : "bookings"}
                    </div>
                  </div>

                  <div className="fs-5 fw-bold">
                    ₹{Number(report.revenue).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Report Table */}
          <div className="card shadow-sm">
            <div className="card-body">

              <h5 className="mb-4">
                Monthly Report Details
              </h5>

              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">

                  <thead className="table-dark">
                    <tr>
                      <th>Year</th>
                      <th>Month</th>
                      <th>Confirmed Bookings</th>
                      <th>Advance Revenue</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.map((report, index) => (
                      <tr key={index}>

                        <td>
                          {report.year}
                        </td>

                        <td>
                          {getMonthName(report.month)}
                        </td>

                        <td>
                          <span className="badge bg-success">
                            {report.bookings}
                          </span>
                        </td>

                        <td className="fw-bold">
                          ₹{Number(report.revenue).toFixed(2)}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminMonthlyReports;