import React, {useState} from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Dashboard from "./Components/Dashboard";
import ProtectedRoute from "./ProtectedRoute"

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
