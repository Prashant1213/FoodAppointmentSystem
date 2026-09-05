import { useEffect, useState } from "react";
import axios from "../axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(
    localStorage.getItem("user")
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/admin/users");

      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Change role
  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(
        `/api/admin/users/${userId}/role?role=${role}`
      );

      alert("User role updated successfully");

      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role");
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    if (user.id === loggedInUser?.id) {
      alert("You cannot delete your own admin account.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `/api/admin/users/${user.id}`
      );

      alert("User deleted successfully");

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const getRoleClass = (role) => {
    if (role === "ADMIN") {
      return "bg-danger";
    }

    return "bg-primary";
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading users...</h4>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          Manage Users
        </h2>

        <button
          className="btn btn-outline-primary"
          onClick={fetchUsers}
        >
          Refresh
        </button>
      </div>

      {/* Users */}
      {users.length === 0 ? (
        <div className="alert alert-info">
          No users found.
        </div>
      ) : (
        <div className="card shadow-sm">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user.id}>

                    <td>
                      {user.id}
                    </td>

                    <td className="fw-semibold">
                      {user.name}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.phone}
                    </td>

                    <td>
                      <span
                        className={`badge ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>

                      {/* Role */}
                      <select
                        className="form-select form-select-sm d-inline-block me-2"
                        style={{ width: "130px" }}
                        value={user.role}
                        disabled={
                          user.id === loggedInUser?.id
                        }
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="CUSTOMER">
                          CUSTOMER
                        </option>

                        <option value="ADMIN">
                          ADMIN
                        </option>
                      </select>

                      {/* Delete */}
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={
                          user.id === loggedInUser?.id
                        }
                        onClick={() =>
                          handleDelete(user)
                        }
                      >
                        Delete
                      </button>

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

export default AdminUsers;