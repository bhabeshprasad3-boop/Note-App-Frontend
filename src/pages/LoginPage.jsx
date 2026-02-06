import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Logging in...");

    try {
      // Backend request
      const res = await axios.post("http://localhost:3000/api/auth/login", formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("Login Successful!", { id: loadingToast });
        
        // Data save kar rahe hain (Backend se user aaye ya saveUsers ya kuch aur)
        const userData = res.data.user || res.data.saveUsers || { username: "User" };
        localStorage.setItem("user", JSON.stringify(userData));

        // 🔥 FORCE REDIRECT (Ye aapko Home par bhej dega)
        setTimeout(() => {
            window.location.href = "/";
        }, 500);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login Failed", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] relative overflow-hidden text-white font-sans flex justify-center items-center px-4">
      {/* Background Blobs (Same as Home) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Login to access your notes</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;