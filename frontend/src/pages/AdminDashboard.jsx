import { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get("/api/admin/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h5>Loading Dashboard...</h5>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Unable to load dashboard data.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">
            Food Appointment System overview
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchDashboard}
        >
          Refresh
        </button>
      </div>

      {/* Main Statistics */}
      <div className="row g-4 mb-4">

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Total Users</p>
              <h3 className="fw-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Restaurants</p>
              <h3 className="fw-bold">{stats.totalRestaurants}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Menu Items</p>
              <h3 className="fw-bold">{stats.totalMenuItems}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Total Bookings</p>
              <h3 className="fw-bold">{stats.totalBookings}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Booking & Payment Statistics */}
      <div className="row g-4 mb-4">

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-success h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Confirmed Bookings</p>
              <h3 className="fw-bold text-success">
                {stats.confirmedBookings}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-warning h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Pending Payments</p>
              <h3 className="fw-bold text-warning">
                {stats.pendingPayments}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-danger h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Cancelled Bookings</p>
              <h3 className="fw-bold text-danger">
                {stats.cancelledBookings}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-primary h-100">
            <div className="card-body">
              <p className="text-muted mb-2">Total Payments</p>
              <h3 className="fw-bold">
                {stats.totalPayments}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Revenue */}
      <div className="row mb-4">

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Successful Payments
              </p>

              <h3 className="fw-bold text-success">
                {stats.successfulPayments}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-2">
                Confirmed Advance Revenue
              </p>

              <h3 className="fw-bold text-primary">
                ₹{Number(stats.totalRevenue).toFixed(2)}
              </h3>

              <small className="text-muted">
                Revenue from confirmed booking advances
              </small>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="card shadow-sm">
        <div className="card-body">

          <h5 className="fw-bold mb-3">
            Quick Actions
          </h5>

          <div className="d-flex flex-wrap gap-2">

            <Link
              to="/admin/restaurants"
              className="btn btn-outline-primary"
            >
              Manage Restaurants
            </Link>

            <Link
              to="/admin/menu-items"
              className="btn btn-outline-primary"
            >
              Manage Menu
            </Link>

            <Link
              to="/admin/bookings"
              className="btn btn-outline-primary"
            >
              Manage Bookings
            </Link>

            <Link
              to="/admin/payments"
              className="btn btn-outline-primary"
            >
              Payments
            </Link>

            <Link
              to="/admin/users"
              className="btn btn-outline-primary"
            >
              Users
            </Link>

            <Link
              to="/admin/reports/monthly"
              className="btn btn-outline-primary"
            >
              Monthly Reports
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;