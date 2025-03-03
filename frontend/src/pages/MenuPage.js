import React, { useState, useEffect } from "react";
import axios from "axios";

const MenuPage = () => {
    const [menu, setMenu] = useState([]);  // ✅ menu is used in JSX
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        restaurant_id: 1,
        category: "Starters",
        name: "",
        description: "",
        price: "",
        image: null,
        image_url: "",
    });

    useEffect(() => {
        fetchMenu();
    }, []);

    // ✅ Fetch Menu from Database
    const fetchMenu = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/menu/1");
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
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/menu/${editingItem.id}`, form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Menu item updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/menu", form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Menu item added successfully!");
            }
            setEditingItem(null);
            setFormData({
                restaurant_id: 1,
                category: "Starters",
                name: "",
                description: "",
                price: "",
                image: null,
                image_url: "",
            });
            fetchMenu(); // ✅ Refresh Menu List after Add/Update
        } catch (error) {
            console.error("Error adding/updating menu item:", error);
            alert("Failed to add/update menu item.");
        }
    };

    // ✅ Delete Menu Item
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

    // ✅ Edit Menu Item
    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            restaurant_id: item.restaurant_id,
            category: item.category,
            name: item.name,
            description: item.description,
            price: item.price,
            image: null,
            image_url: item.image_url,
        });
    };

    return (
        <div className="max-w-6xl mx-auto mt-20 p-10 bg-gray-100 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Restaurant Menu</h2>

            {/* Add/Update Menu Form */}
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
                    <input type="file" onChange={handleFileChange} className="border p-2 rounded-lg" />
                </div>
                <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 transition">
                    {editingItem ? "Update Menu Item" : "Add Menu Item"}
                </button>
            </form>

            {/* ✅ Menu List (Ensures `menu` is Used) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menu.length === 0 ? (
                    <p className="text-center text-gray-500">No menu items available.</p>
                ) : (
                    menu.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                            <img src={`http://localhost:5000/uploads/${item.image_url}`} alt={item.name} className="w-full h-40 object-cover rounded-lg" />
                            <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                            <p className="text-gray-600">{item.category}</p>
                            <p className="text-gray-900 font-bold mt-1">${item.price}</p>
                            <div className="mt-4 flex justify-between">
                                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                                    ✏️ Edit
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MenuPage;
