import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerOwner } from "../services/api";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaIdBadge,
} from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ngo_name: "",
    contact_person: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, contain a number, a letter, and a special character."
      );
      return;
    }

    setLoading(true);

    try {
      const { status } = await registerOwner({
        ngo_name: formData.ngo_name,
        contact_person: formData.contact_person,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      });

      if (status === 201) {
        setMessage("Registration successful!");
        setFormData({
          ngo_name: "",
          contact_person: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
        });
        navigate("/verify-email", { state: { email: formData.email } });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error connecting to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400 bg-white";

  const LabelWithIcon = ({ icon: Icon, label }) => (
    <label className="flex items-center text-gray-700 font-medium mb-1">
      <Icon className="mr-2 text-red-500" />
      {label}
    </label>
  );

  return (
    <div
      className="flex justify-center items-center min-h-screen  max-h-screen bg-gray-100 bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/wooden-planks-with-blurred-restaurant-background_1253-56.jpg?size=626&ext=jpg')",
      }}
    >
      <div className="bg-white/90 w-full max-w-4xl md:flex rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            NGO Registration
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-sm mb-4 text-center">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <LabelWithIcon icon={FaUser} label="NGO Name" />
              <input
                type="text"
                id="ngo_name"
                className={inputClass}
                value={formData.ngo_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <LabelWithIcon icon={FaIdBadge} label="Contact Person Name" />
              <input
                type="text"
                id="contact_person"
                className={inputClass}
                value={formData.contact_person}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <LabelWithIcon icon={FaEnvelope} label="Email" />
              <input
                type="email"
                id="email"
                className={inputClass}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <LabelWithIcon icon={FaLock} label="Password" />
              <input
                type="password"
                id="password"
                className={inputClass}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <LabelWithIcon icon={FaLock} label="Confirm Password" />
              <input
                type="password"
                id="confirmPassword"
                className={inputClass}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <LabelWithIcon icon={FaPhone} label="Phone Number" />
              <input
                type="tel"
                id="phone"
                className={inputClass}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <LabelWithIcon icon={FaMapMarkerAlt} label="NGO Address" />
              <input
                type="text"
                id="address"
                className={inputClass}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 mt-2 font-semibold shadow"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        {/* Right: Image + Links */}
        <div className="w-full md:w-1/2 bg-red-50 flex flex-col items-center justify-center p-6">
          <img
            src="https://i0.wp.com/99v.in/wp-content/uploads/2023/06/images-7.jpeg?fit=700,400&ssl=1"
            alt="Signup"
            className="w-full max-w-xs md:max-w-sm rounded-xl mb-6 shadow-md"
          />
          <p className="text-gray-700 text-sm text-center">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-red-600 hover:underline font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
