import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLeaf, FaSeedling } from "react-icons/fa";
import { useParams } from "react-router-dom";

const Bill = ({ }) => {
  const greenCoins = 90;
  const { preorderId } = useParams();// Get preorderId from URL params
  const [preorder, setPreorder] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const[msg, setMessage] = useState("");
  const sustainabilityMessage =
    greenCoins >= 100
      ? "Congratulations! You have earned 100 Green Coins. Please collect your plant reward from the restaurant."
      : `You have ${greenCoins} Green Coins. Earn more to get a plant reward!`;

  useEffect(() => {
    const fetchPreorderDetails = async () => {
      try {
        // Fetch preorder details
        // const response = await axios.get(`http://localhost:5000/api/preorder/${preorderId}`);
        // setPreorder(response.data);
        // console.log("Preorder details:", response.data);

        // Fetch QR code
        const qrResponse = await axios.get(`http://localhost:5000/api/payment/generate-qrcode/${preorderId}`);
        setQrCode(qrResponse.data.qrCode);
      } catch (error) {
        console.error("Error fetching preorder details or QR code:", error);
        setMessage("Failed to fetch preorder details or QR code.");
      }
    };

    fetchPreorderDetails();
  }, [preorderId]);

  const markOrderAsComplete = async () => {
    try {
      await axios.post("http://localhost:5000/api/payment/mark-complete", { preorderId });
      setMessage("Order marked as complete!");
    } catch (error) {
      console.error("Error marking order as complete:", error);
      setMessage("Failed to mark order as complete.");
    }
  };

  // if (!preorder) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div className="p-4 bg-green-50 min-h-screen flex flex-col items-center mt-20">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 text-center animate-bounce">
        Your Bill
      </h1>

      {/* Responsive Layout */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {/* Left Section (30%) */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-4">QR Code:</h2>
          {qrCode ? (
            <img src={qrCode} alt="QR Code" className="mt-4 w-[70%] h-auto m-auto" />
          ) : (
            <p>Loading QR Code...</p>
          )}
          {/* <button
            onClick={markOrderAsComplete}
            className="mt-6 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 w-full"
          >
            Mark Order as Complete
          </button> */}
  
        </div>

        {/* Right Section (70%) */}
        <div className="bg-green-100 p-6 rounded-lg shadow-lg w-full md:w-2/3">
          <h2 className="text-2xl font-semibold text-green-700 flex items-center">
            <FaLeaf className="mr-2" /> Sustainability Initiative
          </h2>
          <p className="text-green-600 mt-4 text-lg">{sustainabilityMessage}</p>
          <p className="text-gray-600 mt-2 text-sm">
            For every 100 Green Coins you earn, you will receive a plant as a reward to promote sustainability.
          </p>
          {greenCoins < 100 && (
            <div className="mt-4 bg-green-200 p-4 rounded-lg shadow-md flex items-center">
              <FaSeedling className="text-green-700 text-3xl mr-4 animate-spin" />
              <p className="text-green-700 font-medium">
                Earn {100 - greenCoins} more Green Coins to get a plant reward!
              </p>
            </div>
          )}
          <div className="mt-8 bg-green-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-green-700 flex items-center">
              <FaSeedling className="mr-2" /> Your Green Coins
            </h2>
            <p className="text-green-600 text-4xl font-bold mt-4">{greenCoins}</p>
            <p className="text-gray-600 mt-2 text-sm">
              Keep earning Green Coins by placing more orders and contributing to a sustainable future!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;