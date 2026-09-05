import { useEffect, useState } from "react";
import api from "../axios";

function Profile() {
  const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [changingPassword, setChangingPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/auth/me");

      setUser(response.data);

      setFormData({
        name: response.data.name || "",
        phone: response.data.phone || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
    });

    setEditing(false);
  };

  const handlePasswordChange = (e) => {
  setPasswordData({
    ...passwordData,
    [e.target.name]: e.target.value,
  });
};
    
    const handleChangePassword = async (e) => {
      e.preventDefault();
    
      if (!passwordData.currentPassword) {
        alert("Current password is required");
        return;
      }
    
      if (!passwordData.newPassword) {
        alert("New password is required");
        return;
      }
    
      if (passwordData.newPassword.length < 6) {
        alert("New password must be at least 6 characters");
        return;
      }
    
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("New password and confirm password do not match");
        return;
      }
    
      try {
        setChangingPassword(true);
    
        const response = await api.put(
          "/api/auth/change-password",
          passwordData
        );
    
        alert(response.data);
    
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Failed to change password", error);
    
        alert(
          error.response?.data ||
            "Failed to change password"
        );
      } finally {
        setChangingPassword(false);
      }
    };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone is required");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/api/auth/me", {
        name: formData.name,
        phone: formData.phone,
      });

      setUser(response.data);

      setFormData({
        name: response.data.name || "",
        phone: response.data.phone || "",
      });

      setEditing(false);

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile", error);

      alert(
        error.response?.data ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Failed to load profile.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">My Profile</h2>

        {!editing ? (
          <>
            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Phone:</strong> {user.phone}
            </p>

            <p>
              <strong>Role:</strong> {user.role}
            </p>

            <button
              className="btn btn-primary"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label">
                Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                value={user.email}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Role
              </label>

              <input
                type="text"
                className="form-control"
                value={user.role}
                disabled
              />
            </div>

            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </form>
        )}
        <hr className="my-4" />
        
        <h4 className="mb-3">Change Password</h4>
        
        <form onSubmit={handleChangePassword}>
          <div className="mb-3">
            <label className="form-label">
              Current Password
            </label>
        
            <input
              type="password"
              name="currentPassword"
              className="form-control"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
        
          <div className="mb-3">
            <label className="form-label">
              New Password
            </label>
        
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
        
          <div className="mb-3">
            <label className="form-label">
              Confirm New Password
            </label>
        
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        
          <button
            type="submit"
            className="btn btn-warning"
            disabled={changingPassword}
          >
            {changingPassword
              ? "Changing..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;