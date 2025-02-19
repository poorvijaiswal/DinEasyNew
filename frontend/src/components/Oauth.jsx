import React from "react";
import { signInWithGoogle } from "../firebases/firebase";
import { useNavigate } from "react-router-dom";

export default function Oauth() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        alert(`Welcome, ${user.displayName}`);
        navigate("/"); // Redirect after login
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
    >
      Continue with Google
    </button>
  );
}
