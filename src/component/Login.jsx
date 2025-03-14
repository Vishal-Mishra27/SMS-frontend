
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

 const handleInputChange = (e) => {
   let { name, value } = e.target;

   if (name === "password") {
     value = value.replace(/\D/g, ""); // Remove non-numeric characters
     value = value ? Number(value) : ""; // Convert to number if not empty
   }

   setLoginData({ ...loginData, [name]: value });
 };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in...");
      console.log("loginData: ", loginData);

      // ✅ Proper Axios request
      const res = await axios.post(
        "https://sms-backend-wfdy.onrender.com/signup/getLogin",
        loginData
      );
      const data = res.data; // Axios automatically parses JSON

      console.log("userRegister", data);

    navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-sm p-6 bg-gray-200 rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-center text-black">
          Login Page
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-black">Email:</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-black">Password:</label>
            <input
              type="password" // Keep it as "password" for security
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter your password"
              inputMode="numeric" // Suggests numeric keyboard on mobile
              pattern="[0-9]*" // Ensures only numbers are entered
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;