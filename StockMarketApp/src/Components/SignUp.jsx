import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND}/signup`, { username, password });
      alert("User created successfully!");
      navigate("/signin");
    } catch (err) {
      alert("Signup failed: " + err.response.data.detail);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-8">Sign Up</h2>
        <input 
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition-colors"
        >
          Sign Up
        </button>
        <p
          onClick={() => navigate("/signin")}
          className="mt-4 text-center text-gray-500 hover:text-blue-500 cursor-pointer text-sm"
        >
          Already have an account? Sign In
        </p>
      </div>
    </div>
  );
}

export default SignUp;
