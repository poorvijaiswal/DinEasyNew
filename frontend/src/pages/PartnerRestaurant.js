import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./PartnerRestaurant.module.css"; // Import the CSS module

const PartnerRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");

  // Fetch restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/restaurants"); // Use your API endpoint
        setRestaurants(response.data);
        localStorage.setItem("restaurants", JSON.stringify(response.data));
      } catch (err) {
        setError("Error fetching restaurants.");
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <section
        className={styles.heroSection}
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/empty-wood-table-top-abstract-blurred-restaurant-cafe-background-can-be-used-display-montage-your-products_7191-916.jpg?size=626&ext=jpg')",
        }}
      >
        <div className={styles.overlay}></div>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Explore Partner Restaurants</h1>
          <p className={styles.heroSubtitle}>
            Preorder your favorite dishes from our partner restaurants.
          </p>
        </div>
      </section>

      {/* Associated Restaurants Section */}
      <section className={styles.restaurantsSection} id="restaurants">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Partner Restaurants</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className={styles.restaurantGrid}>
            {restaurants.map((restaurant) => (
              <div key={restaurant.restaurant_id} className={styles.restaurantCard}>
                <h3 className={styles.restaurantName}>{restaurant.name}</h3>
                <p className={styles.restaurantAddress}>{restaurant.address}</p>
                <Link
                  to={`/menu/${restaurant.restaurant_id}`} // Navigate to the menu page for the selected restaurant
                  className={styles.viewMenuButton}
                >
                  View Menu & Preorder
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerRestaurant;