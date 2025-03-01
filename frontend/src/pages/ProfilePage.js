import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const userId = localStorage.getItem("userId") || 1;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUserData(response.data);
        setProfileImage(`http://localhost:5000/uploads/${response.data.profile_image}`);
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle image selection
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  // Upload new profile image
  const handleProfileUpdate = async () => {
    if (!newImage) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", newImage);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/update-profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Profile updated successfully!");
      setProfileImage(`http://localhost:5000/uploads/${response.data.profile_image}`);
    } catch (err) {
      console.error("Error updating profile", err);
      alert("There was an error updating the profile.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>{userData.owner_name} <b>Profile</b></h2>
      </div>
      <div className="profile-image-section">
        <img src={profileImage} alt="Profile" className="profile-image" />
        <div className="file-upload">
          <input type="file" accept="image/*" onChange={handleImageChange} className="image-input" />
          <button onClick={handleProfileUpdate} className="upload-button">Update Profile Image</button>
        </div>
      </div>
      <div className="profile-details">
        <h3>Personal Details</h3>
        <p>Email: {userData.email}</p>
        <p>Membership ID: {userData.membership_id}</p>
      </div>
    </div>
  );
};

export default ProfilePage;