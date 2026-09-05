import { useEffect, useState } from "react";
import api from "../axios";

function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cuisine: "",
    rating: "",
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/api/admin/restaurants");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Failed to load restaurants", error);
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

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      cuisine: "",
      rating: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const restaurantData = {
        name: formData.name,
        location: formData.location,
        cuisine: formData.cuisine,
        rating: Number(formData.rating),
      };

      if (editingId) {
        await api.put(
          `/api/admin/restaurants/${editingId}`,
          restaurantData
        );

        alert("Restaurant updated successfully");
      } else {
        await api.post(
          "/api/admin/restaurants",
          restaurantData
        );

        alert("Restaurant added successfully");
      }

      resetForm();
      fetchRestaurants();

    } catch (error) {
      console.error("Failed to save restaurant", error);

      alert(
        error.response?.data ||
          "Failed to save restaurant"
      );
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant.id);

    setFormData({
      name: restaurant.name || "",
      location: restaurant.location || "",
      cuisine: restaurant.cuisine || "",
      rating: restaurant.rating || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="container mt-5">
        Loading restaurants...
      </div>
    );
  }

  return (
    <div className="container mt-5">

      <h2 className="mb-4">
        Restaurant Management
      </h2>

      {/* Add / Edit Form */}
      <div className="card shadow p-4 mb-5">

        <h4 className="mb-3">
          {editingId
            ? "Edit Restaurant"
            : "Add Restaurant"}
        </h4>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Restaurant Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Location
              </label>

              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Cuisine
              </label>

              <input
                type="text"
                name="cuisine"
                className="form-control"
                value={formData.cuisine}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Rating
              </label>

              <input
                type="number"
                name="rating"
                className="form-control"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="btn btn-success me-2"
          >
            {editingId
              ? "Update Restaurant"
              : "Add Restaurant"}
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

      {/* Restaurant List */}
      <h4 className="mb-3">
        All Restaurants
      </h4>

      <div className="row g-4">

        {restaurants.map((restaurant) => (
          <div
            className="col-md-6"
            key={restaurant.id}
          >
            <div className="card shadow p-4">

              <h5>{restaurant.name}</h5>

              <p className="mb-1">
                <strong>Location:</strong>{" "}
                {restaurant.location}
              </p>

              <p className="mb-1">
                <strong>Cuisine:</strong>{" "}
                {restaurant.cuisine}
              </p>

              <p className="mb-3">
                <strong>Rating:</strong>{" "}
                ⭐ {restaurant.rating}
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  handleEdit(restaurant)
                }
              >
                Edit
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default AdminRestaurants;