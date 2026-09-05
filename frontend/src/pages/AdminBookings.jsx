import { useEffect, useState } from "react";
import axios from "../axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = [
    "PENDING_PAYMENT",
    "CONFIRMED",
    "CANCELLED",
  ];

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/admin/bookings");

      setBookings(response.data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      await axios.put(
        `/api/admin/bookings/${bookingId}/status?status=${status}`
      );

      alert("Booking status updated successfully");

      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking status");
    }
  };

  const getStatusClass = (status) => {
    if (status === "CONFIRMED") {
      return "bg-success";
    }

    if (status === "CANCELLED") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading bookings...</h4>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          Manage Bookings
        </h2>

        <button
          className="btn btn-outline-primary"
          onClick={fetchBookings}
        >
          Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="alert alert-info">
          No bookings found.
        </div>
      ) : (
        <div className="row g-4">

          {bookings.map((booking) => (
            <div
              className="col-12"
              key={booking.id}
            >
              <div className="card shadow-sm">

                <div className="card-body">

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="fw-bold mb-0">
                      Booking #{booking.id}
                    </h5>

                    <span
                      className={`badge ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                  </div>

                  <hr />

                  <div className="row">

                    {/* Customer */}
                    <div className="col-md-4 mb-3">

                      <h6 className="fw-bold">
                        Customer
                      </h6>

                      <p className="mb-1">
                        <strong>Name:</strong>{" "}
                        {booking.customerName}
                      </p>

                      <p className="mb-1">
                        <strong>Email:</strong>{" "}
                        {booking.customerEmail}
                      </p>

                      <p className="mb-1">
                        <strong>Phone:</strong>{" "}
                        {booking.customerPhone}
                      </p>

                    </div>

                    {/* Booking Details */}
                    <div className="col-md-4 mb-3">

                      <h6 className="fw-bold">
                        Booking Details
                      </h6>

                      <p className="mb-1">
                        <strong>Restaurant:</strong>{" "}
                        {booking.restaurant?.name || "N/A"}
                      </p>

                      <p className="mb-1">
                        <strong>Date:</strong>{" "}
                        {booking.bookingDate}
                      </p>

                      <p className="mb-1">
                        <strong>Time:</strong>{" "}
                        {booking.bookingTime}
                      </p>

                      <p className="mb-1">
                        <strong>People:</strong>{" "}
                        {booking.numberOfPeople}
                      </p>

                    </div>

                    {/* Payment */}
                    <div className="col-md-4 mb-3">

                      <h6 className="fw-bold">
                        Payment
                      </h6>

                      <p className="mb-1">
                        <strong>Total:</strong>{" "}
                        ₹{booking.totalAmount}
                      </p>

                      <p className="mb-1">
                        <strong>Advance:</strong>{" "}
                        ₹{booking.advanceAmount}
                      </p>

                      <p className="mb-1 text-break">
                        <strong>Razorpay Order:</strong>{" "}
                        {booking.razorpayOrderId || "Not created"}
                      </p>

                    </div>

                  </div>

                  {/* Special Request */}
                  {booking.specialRequest && (
                    <div className="alert alert-light border">
                      <strong>Special Request:</strong>{" "}
                      {booking.specialRequest}
                    </div>
                  )}

                  <hr />

                  {/* Status Update */}
                  <div className="row align-items-end">

                    <div className="col-md-4">

                      <label className="form-label fw-bold">
                        Update Status
                      </label>

                      <select
                        className="form-select"
                        value={booking.status || ""}
                        onChange={(e) =>
                          handleStatusChange(
                            booking.id,
                            e.target.value
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                    </div>

                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdminBookings;