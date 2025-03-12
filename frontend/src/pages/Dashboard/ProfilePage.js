import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [profileImage, setProfileImage] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [restaurantData, setRestaurantData] = useState({});
    
    const token = localStorage.getItem("token"); // Get token from localStorage
    const membershipId = localStorage.getItem("membership_id");

    //  Fetch user data
    useEffect(() => {
      const fetchUserData = async () => {
          try {
              console.log("Fetching user data for membershipId:", membershipId); // Debugging
              const response = await axios.get(`http://localhost:5000/api/user/${membershipId}`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
  
              console.log("User Data Response:", response.data); // 🔍 Check API Response
              setUserData(response.data);
              setProfileImage(`http://localhost:5000${response.data.profile_image}`);
          } catch (err) {
              console.error("Error fetching user data", err);
          }
      };
  
      fetchUserData();
  }, [membershipId, token]);
  

    //  Fetch restaurant data
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/restaurant/${membershipId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setRestaurantData(response.data);
            } catch (err) {
                console.error("Error fetching restaurant data", err);
            }
        };

        fetchRestaurantData();
    }, [membershipId, token]);

    //  Handle image selection
    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    //  Upload new profile image
    const handleProfileUpdate = async () => {
        if (!newImage) {
            alert("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("profileImage", newImage);

        try {
            const response = await axios.post(
                `http://localhost:5000/api/user/update-profile/${membershipId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Profile updated successfully!");
            setProfileImage(`http://localhost:5000${response.data.profile_image}`);
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
                <p>Phone: {userData.phone}</p>
                <p>Owner Name: {userData.owner_name}</p>
                <p>Membership Type: {userData.membership_type}</p>
                <p>Start Date: {new Date(userData.start_date).toLocaleDateString()}</p>
                <p>End Date: {new Date(userData.end_date).toLocaleDateString()}</p>
                <h3>Restaurant Details</h3>
                <p>Name: {restaurantData.name}</p>
                <p>Address: {restaurantData.address}</p>
                <h3>Reset Password</h3>
                <button onClick={() => window.location.href = '/forgot-password'} className="reset-password-button">Reset Password</button>
            </div>
        </div>
    );
};

export default ProfilePage;
