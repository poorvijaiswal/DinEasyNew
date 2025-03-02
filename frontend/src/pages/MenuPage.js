import React, { useState, useEffect } from "react";
import axios from "axios";

const MenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [formData, setFormData] = useState({
        restaurant_id: 1, // Update dynamically for logged-in restaurant
        category: "Starters",
        name: "",
        description: "",
        price: "",
        image: null,
    });

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/menu");
            setMenu(response.data);
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.restaurant_id || !formData.category || !formData.name || !formData.price) {
            alert("All fields are required.");
            return;
        }

        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));

        try {
            await axios.post("http://localhost:5000/api/menu", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Menu item added successfully!");
            fetchMenu();
        } catch (error) {
            console.error("Error adding menu item:", error);
            alert("Failed to add menu item.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            try {
                await axios.delete(`http://localhost:5000/api/menu/${id}`);
                alert("Menu item deleted successfully!");
                fetchMenu();
            } catch (error) {
                console.error("Error deleting menu item:", error);
                alert("Failed to delete menu item.");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-20 p-10 bg-gray-100 rounded-2xl shadow-lg w-full ">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Restaurant Menu</h2>

            {/* Add Menu Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded-lg">
                        <option value="Starters">Starters</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                    </select>
                    <input type="text" name="name" placeholder="Dish Name" value={formData.name} onChange={handleChange} className="border p-2 rounded-lg" required />
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded-lg" />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border p-2 rounded-lg" required />
                    <input type="file" onChange={handleFileChange} className="border p-2 rounded-lg" required />
                </div>
                <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 transition">
                    Add Menu Item
                </button>
            </form>

            {/* Menu List (Grid View) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menu.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                        <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="w-full h-40 object-cover rounded-lg" />
                        <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                        <p className="text-gray-600">{item.category}</p>
                        <p className="text-gray-900 font-bold mt-1">${item.price}</p>
                        <div className="mt-4 flex justify-between">
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 transition">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;
