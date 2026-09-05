import { useEffect, useState } from "react";
import axios from "../axios";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/admin/payments");

      setPayments(response.data);
    } catch (error) {
      console.error("Error loading payments:", error);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusClass = (status) => {
    if (status === "SUCCESS") {
      return "bg-success";
    }

    if (status === "FAILED") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading payments...</h4>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          Payment Management
        </h2>

        <button
          className="btn btn-outline-primary"
          onClick={fetchPayments}
        >
          Refresh
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="alert alert-info">
          No payments found.
        </div>
      ) : (
        <div className="card shadow-sm">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Booking</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Amount</th>
                  <th>Order ID</th>
                  <th>Payment ID</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {payments.map((payment) => (
                  <tr key={payment.id}>

                    <td>
                      {payment.id}
                    </td>

                    <td>
                      #{payment.booking?.id || "N/A"}
                    </td>

                    <td>
                      <strong>
                        {payment.booking?.customerName || "N/A"}
                      </strong>
                      <br />
                      <small className="text-muted">
                        {payment.booking?.customerEmail || ""}
                      </small>
                    </td>

                    <td>
                      {payment.booking?.restaurant?.name || "N/A"}
                    </td>

                    <td>
                      <strong>
                        ₹{payment.amount}
                      </strong>
                    </td>

                    <td className="text-break">
                      <small>
                        {payment.razorpayOrderId || "N/A"}
                      </small>
                    </td>

                    <td className="text-break">
                      <small>
                        {payment.razorpayPaymentId || "N/A"}
                      </small>
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusClass(
                          payment.status
                        )}`}
                      >
                        {payment.status || "UNKNOWN"}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPayments;