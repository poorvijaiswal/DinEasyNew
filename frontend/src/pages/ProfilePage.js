import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css"; // Importing external CSS file for styling

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  // Fetch user data on page load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/1`, { // Replace "1" with actual user ID
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(response.data);
        setProfileImage(response.data.profile_image || "default-profile-image.jpg");
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
  
    fetchUserData();
  }, []);
  

  // Handle profile image change
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!newImage) {
      alert("Please select an image first!");
      return;
    }
  
    const formData = new FormData();
    formData.append("profileImage", newImage);
  
    try {
      const response = await axios.post(`/user/upload/1`, formData, { // Replace "1" with actual user ID
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Profile updated successfully!");
      setProfileImage(response.data.profileImage);
    } catch (err) {
      console.error("Error updating profile", err);
      alert("There was an error updating the profile.");
    }
  };
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>{userData.name}Profile</h2>
      </div>
      <div className="profile-image-section">
        <img
          src={profileImage}
          alt="Profile"
          className="profile-image"
        />
        <div className="file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="image-input"
          />
          <button onClick={handleProfileUpdate} className="upload-button">
            Update Profile Image
          </button>
        </div>
      </div>
      <div className="profile-details">
        <h3>Personal Details</h3>
        <p>Email: {userData.email}</p>
        <p>Phone: {userData.phone}</p>
      </div>
    </div>
  );
};

export default ProfilePage;