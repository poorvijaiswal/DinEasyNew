import React, { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    address: "123 Main St, City, Country",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // You can handle the save action here, e.g., updating user data in the backend.
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">{userInfo.name}</h2>
          <p className="text-gray-600 mb-4">{userInfo.email}</p>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            <button
              className="text-blue-500"
              onClick={toggleEditMode}
            >
              {isEditing ? <FaSave /> : <FaEdit />} {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-600">Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                />
              ) : (
                <p className="text-gray-800">{userInfo.phone}</p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <label className="text-gray-600">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                />
              ) : (
                <p className="text-gray-800">{userInfo.address}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
