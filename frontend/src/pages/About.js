import React from "react";

export default function About() {
  return (
    <div 
    className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-8 md:px-16 lg:px-32"
    style={{ 
      backgroundImage: "url('https://t4.ftcdn.net/jpg/02/92/20/37/360_F_292203735_CSsyqyS6A4Z9Czd4Msf7qZEhoxjpzZl1.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed" // Optional: Creates a parallax effect
    }}
    >
      {/* Overlay for better readability */}
      <div className="bg-black bg-opacity-60 py-12 px-6 md:px-16 lg:px-32 rounded-lg w-full">
        <div className="max-w-5xl  text-center text-white">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg">
            We provide innovative restaurant solutions to enhance customer experience,  
            offering QR-based ordering and real-time data analytics for seamless operations.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white bg-opacity-80 p-6 shadow-md rounded-lg text-black">
            <h3 className="text-2xl font-semibold mb-2">Our Mission</h3>
            <p>
              To revolutionize dining with technology, reducing wait times, optimizing  
              operations, and providing valuable insights for restaurant growth.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white bg-opacity-80 p-6 shadow-md rounded-lg text-black">
            <h3 className="text-2xl font-semibold mb-2">What We Offer</h3>
            <ul className="list-disc list-inside">
              <li>Contactless QR-based ordering</li>
              <li>Real-time analytics for smarter decisions</li>
              <li>Seamless digital payments</li>
              <li>Efficient table and order management</li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white bg-opacity-80 p-6 shadow-md rounded-lg text-black">
            <h3 className="text-2xl font-semibold mb-2">Why Choose Us?</h3>
            <ul className="list-disc list-inside">
              <li>Fast and efficient order processing</li>
              <li>Data-driven decision making</li>
              <li>User-friendly interface for customers & staff</li>
            </ul>
          </div>
        </div>

        {/* Future Goals */}
        <div className="mt-10 bg-white bg-opacity-80 p-6 shadow-md rounded-lg text-center text-black">
          <h3 className="text-2xl font-semibold mb-2">Our Future Goals</h3>
          <p>
            We plan to integrate AI-driven recommendations, multilingual support,  
            and advanced customer engagement features to redefine the dining experience.
          </p>
        </div>
      </div>
    </div>
  );
}