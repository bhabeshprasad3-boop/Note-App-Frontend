import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import BackgroundLayout from "../components/BackgroundLayout";


const BACKEND_URL = "https://note-app-backend-khaki.vercel.app";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating account...");

    try {
      // ✅ Updated URL: Ab Live Server par request jayegi
      const res = await axios.post(`${BACKEND_URL}/api/auth/register`, formData);
      
      if (res.status === 201) {
        toast.success("Account Created! Please Login.", { id: loadingToast });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed", { id: loadingToast });
    }
  };

  return (
    <BackgroundLayout>
      <Toaster position="top-center" />
      <div className="flex justify-center items-center h-screen px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Join us to manage your notes</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-700 text-white p-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-700 text-white p-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-700 text-white p-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Register;