import { useEffect, useState } from "react";
import axios from "../axios";

function AdminMenuItems() {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load restaurants
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("/api/admin/restaurants");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error loading restaurants:", error);
      alert("Failed to load restaurants");
    }
  };

  // Load menu items
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("/api/admin/menu-items");
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error loading menu items:", error);
      alert("Failed to load menu items");
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchMenuItems();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add menu item
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      alert("Please select a restaurant");
      return;
    }

    if (!formData.name || !formData.price) {
      alert("Name and price are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `/api/admin/menu-items/restaurant/${selectedRestaurant}`,
        {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
        }
      );

      alert("Menu item added successfully");

      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const handleEdit = (item) => {
    setEditingId(item.id);

    setSelectedRestaurant(item.restaurant?.id || "");

    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Update menu item
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert("Name and price are required");
      return;
    }

    try {
      setLoading(true);

      await axios.put(`/api/admin/menu-items/${editingId}`, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
      });

      alert("Menu item updated successfully");

      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert("Failed to update menu item");
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`/api/admin/menu-items/${id}`);

      alert("Menu item deleted successfully");

      fetchMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item");
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setSelectedRestaurant("");

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
    });
  };

  return (
    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          {editingId ? "Edit Menu Item" : "Manage Menu Items"}
        </h2>
      </div>

      {/* Add / Edit Form */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">

          <h5 className="card-title mb-4">
            {editingId ? "Edit Menu Item" : "Add New Menu Item"}
          </h5>

          <form
            onSubmit={editingId ? handleUpdate : handleAdd}
          >

            {/* Restaurant */}
            <div className="mb-3">
              <label className="form-label">
                Restaurant
              </label>

              <select
                className="form-select"
                value={selectedRestaurant}
                onChange={(e) =>
                  setSelectedRestaurant(e.target.value)
                }
                disabled={editingId !== null}
                required
              >
                <option value="">
                  Select Restaurant
                </option>

                {restaurants.map((restaurant) => (
                  <option
                    key={restaurant.id}
                    value={restaurant.id}
                  >
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label">
                Menu Item Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter menu item name"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">
                Description
              </label>

              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows="3"
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">
                Price
              </label>

              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="1"
                step="0.01"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="form-label">
                Category
              </label>

              <input
                type="text"
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Example: Starter, Main Course, Dessert"
              />
            </div>

            {/* Buttons */}
            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Menu Item"
                : "Add Menu Item"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </form>
        </div>
      </div>

      {/* Menu Items */}
      <h4 className="fw-bold mb-3">
        Menu Items
      </h4>

      {menuItems.length === 0 ? (
        <div className="alert alert-info">
          No menu items found.
        </div>
      ) : (
        <div className="row g-4">

          {menuItems.map((item) => (
            <div
              className="col-md-6 col-lg-4"
              key={item.id}
            >
              <div className="card h-100 shadow-sm">

                <div className="card-body">

                  <h5 className="card-title fw-bold">
                    {item.name}
                  </h5>

                  <p className="text-muted mb-2">
                    {item.description || "No description"}
                  </p>

                  <p className="mb-2">
                    <strong>Category:</strong>{" "}
                    {item.category || "N/A"}
                  </p>

                  <p className="mb-3">
                    <strong>Price:</strong> ₹
                    {item.price}
                  </p>

                  <p className="mb-3">
                    <strong>Restaurant:</strong>{" "}
                    {item.restaurant?.name || "N/A"}
                  </p>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdminMenuItems;