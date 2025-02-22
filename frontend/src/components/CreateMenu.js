import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateMenu = () => {
  const categories = [
    { category_id: 1, name: 'Starters' },
    { category_id: 2, name: 'Main Course' },
    { category_id: 3, name: 'Desserts' },
    { category_id: 4, name: 'Beverages' },
  ];

  const [menuItem, setMenuItem] = useState({
    category_id: '',
    name: '',
    price: '',
    description: '',
    image_url: null,
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Fetch menu items when component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then(response => {
        console.log(response.data); // Check if data is coming
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setMenuItem({ ...menuItem, image_url: e.target.files[0] });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const formData = new FormData();
    formData.append('category_id', menuItem.category_id);
    formData.append('name', menuItem.name);
    formData.append('price', menuItem.price);
    formData.append('description', menuItem.description);
    formData.append('image_url', menuItem.image_url);

    try {
      const response = await axios.post('http://localhost:5000/api/menu', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response);
      setMessage('Menu item added successfully!');
      setMenuItem({
        category_id: '',
        name: '',
        price: '',
        description: '',
        image_url: null,
      });
    } catch (err) {
      setError('Failed to add menu item.');
      console.error('Error adding menu item', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create Menu Item
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Dropdown */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Category</label>
          <select
            name="category_id"
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Item Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Item Name</label>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            required
            className="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Menu Item'}
        </button>
      </form>
    </div>
  );
};

export default CreateMenu;
