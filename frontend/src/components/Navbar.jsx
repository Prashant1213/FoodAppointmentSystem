import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">

        {/* Brand */}
        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          Food Appointment
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >
          <ul className="navbar-nav ms-auto">

            {/* Home */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
              >
                Home
              </Link>
            </li>

            {/* Restaurants */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/restaurants"
              >
                Restaurants
              </Link>
            </li>

            {/* NOT LOGGED IN */}
            {!isLoggedIn ? (
              <>
                {/* Login */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                {/* Register */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* My Bookings */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/my-bookings"
                  >
                    My Bookings
                  </Link>
                </li>

                {/* Admin Dropdown */}
                {user?.role === "ADMIN" && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Admin
                    </a>

                    <ul className="dropdown-menu dropdown-menu-end">

                      {/* Dashboard */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      {/* Restaurants */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/restaurants"
                        >
                          Manage Restaurants
                        </Link>
                      </li>

                      {/* Menu */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/menu-items"
                        >
                          Manage Menu
                        </Link>
                      </li>

                      {/* Bookings */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/bookings"
                        >
                          Manage Bookings
                        </Link>
                      </li>

                      {/* Payments */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/payments"
                        >
                          Manage Payments
                        </Link>
                      </li>

                      {/* Users */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/users"
                        >
                          Manage Users
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      {/* Monthly Reports */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/reports/monthly"
                        >
                          Monthly Reports
                        </Link>
                      </li>

                    </ul>
                  </li>
                )}

                {/* Owner Dropdown */}
                {user?.role === "RESTAURANT_OWNER" && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Owner
                    </a>
                
                    <ul className="dropdown-menu dropdown-menu-end">
                
                      {/* Dashboard */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/owner/dashboard"
                        >
                          Owner Dashboard
                        </Link>
                      </li>
                
                      {/* Restaurant */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/owner/restaurant"
                        >
                          My Restaurant
                        </Link>
                      </li>
                
                      {/* Menu */}
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/owner/menu"
                        >
                          My Menu
                        </Link>
                      </li>
                
                    </ul>
                  </li>
                )}

                {/* Profile Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Hello, {user?.name}
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end">

                    {/* Profile */}
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile"
                      >
                        My Profile
                      </Link>
                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    {/* Logout */}
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>

                  </ul>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;