import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND}/login`, { username, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-8">Sign In</h2>
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
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition-colors"
        >
          Sign In
        </button>
        <p
          onClick={() => navigate("/signup")}
          className="mt-4 text-center text-gray-500 hover:text-blue-500 cursor-pointer text-sm"
        >
          Don't have an account? Sign Up
        </p>
      </div>
    </div>
  );
}

export default SignIn;
