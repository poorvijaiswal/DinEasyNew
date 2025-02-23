import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const RestaurantPartner = () => {
  return (
    <div>
      <section
        className="hero-section bg-cover bg-center relative py-16 text-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/empty-wood-table-top-abstract-blurred-restaurant-cafe-background-can-be-used-display-montage-your-products_7191-916.jpg?size=626&ext=jpg')",
        }}
      >
        <div className="overlay absolute inset-0 bg-black opacity-50"></div>
        <div className="container relative z-10">
          <h1 className="text-white text-4xl font-bold mb-4">Grow Your Restaurant with Smart Digital Ordering</h1>
          <p className="text-white text-lg mb-6">Boost efficiency, manage orders seamlessly, and enhance customer experience.</p>
          {/* Use Link component to navigate to /Register page */}
          <Link
            to="/Register"
            className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded-lg shadow-md transition-all"
          >
            Join Now
          </Link>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="py-12 bg-gray-100" id="why-partner">
        <div className="container text-center mx-auto">
          <h2 className="text-3xl font-bold mb-6">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="benefit-card p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Faster Table Turnover</h3>
              <p>Streamline the order process and reduce waiting times for customers.</p>
            </div>
            <div className="benefit-card p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Automated Order Management</h3>
              <p>Receive, process, and track orders in real-time with zero mistakes.</p>
            </div>
            <div className="benefit-card p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Seamless Payment Integration</h3>
              <p>Allow customers to pay directly via app, reducing manual errors and wait times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-300" id="features">
        <div className="container text-center mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="feature-card p-6 bg-indigo-50 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-3">QR Code Ordering</h3>
              <p>Customers can scan the table QR code to instantly view and order from the menu.</p>
            </div>
            <div className="feature-card p-6 bg-indigo-50 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Real-Time Order Dashboard</h3>
              <p>Track orders in real-time for efficient kitchen management and faster service.</p>
            </div>
            <div className="feature-card p-6 bg-indigo-50 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Multi-Branch Management</h3>
              <p>Manage multiple restaurant branches from one centralized system, reducing workload.</p>
            </div>
            <div className="feature-card p-6 bg-indigo-50 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Menu Customization</h3>
              <p>Easily update menu items, prices, and special offers across all locations in one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-200" id="testimonials">
        <div className="container text-center mx-auto">
          <h2 className="text-3xl font-bold mb-6">What Our Partners Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial-card p-6 bg-white shadow-lg rounded-lg text-center">
              <img
                src="https://indoretalk.com/wp-content/uploads/2018/01/Hotel-Guru-Kripa-01.jpg"
                alt="Hotel Guru Kripa Restaurant"
                className="w-48 h-48 rounded-full mx-auto mb-4"
              />
              <p>"This system transformed our restaurant operations! The automation has increased our efficiency by 30%."</p>
              <h4 className="mt-4 font-semibold">Mukesh Arora- Owner, Shreemaya Celebration</h4>
            </div>
            {/* Testimonial 2 */}
            <div className="testimonial-card p-6 bg-white shadow-lg rounded-lg text-center">
              <img
                src="https://cdn1.goibibo.com/voy_mmt/t_g/htl-imgs/200809291751449007-750a8f60f3c611e8a7f70242ac110002.jpg"
                alt="Shreemaya Celebration"
                className="w-48 h-48 rounded-full mx-auto mb-4"
              />
              <p>"A must-have for any modern restaurant! Customers love the ease of QR code ordering, and it's really boosted our sales."</p>
              <h4 className="mt-4 font-semibold">Prakash Rathore  - Owner, Apna Sweets</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta py-12 bg-gray-400 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Your Restaurant to the Next Level?</h2>
          <Link
            to="/Dashboard"
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-lg shadow-md transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RestaurantPartner;
