import React from "react";

const restaurants = [
  {
    name: "Hotel Guru Kripa Restaurant",
    address: "10 Shanti Mandapum, Indore",
    price: 500,
    image: "https://indoretalk.com/wp-content/uploads/2018/01/Hotel-Guru-Kripa-01.jpg",
  },
  {
    name: "Shreemaya Celebration",
    address: "A.B. Road, Near Press Complex, Indore",
    price: 800,
    image: "https://cdn1.goibibo.com/voy_mmt/t_g/htl-imgs/200809291751449007-750a8f60f3c611e8a7f70242ac110002.jpg",
  },
  {
    name: "Apna Sweets",
    address: "Vijay Nagar, Scheme No 54, Indore",
    price: 400,
    image: "https://b.zmtcdn.com/data/pictures/6/1400486/7376880bc92dee50387b2cd4c54d218b_featured_v2.jpg",
  },
  {
    name: "Sayaji Hotel – Kebabsville",
    address: "Vijay Nagar, Indore",
    price: 1200,
    image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/423327202.jpg?k=3035f08c4075787d673945a78874f7acf17c420f096ddb2ace1a35f70efd3c35&o=&hp=1",
  },
];

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-lg h-96 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{restaurant.name}</h3>
        <p className="text-sm text-gray-600">{restaurant.address}</p>
        <div className="mt-2 text-indigo-600 font-semibold">
          Avg Price: Rs {restaurant.price}
        </div>
      </div>
    </div>
  );
};

const Restaurants = () => {
  return (
    <section className="py-12 min-h-screen bg-cover bg-center relative bg-gray-100" id="restaurants"  style={{
      backgroundImage: "url('https://img.freepik.com/free-photo/empty-wood-table-top-abstract-blurred-restaurant-cafe-background-can-be-used-display-montage-your-products_7191-916.jpg?size=626&ext=jpg')",
    }}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Our Partner Restaurants in Indore
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={index} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Restaurants;
