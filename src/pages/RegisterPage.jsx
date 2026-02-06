import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ShieldCheck, Zap, UserPlus } from "lucide-react";

const BACKEND_URL = "https://note-app-backend-khaki.vercel.app";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating account...");

    try {
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
    // h-screen + overflow-hidden to prevent scrolling
    <div className="h-screen w-full bg-[#f6f7eb] flex items-center justify-center p-0 sm:p-4 lg:p-8 overflow-hidden font-sans">
      
      <Toaster position="top-center" />

      {/* Main Container - Matches Login Page Styling */}
      <div className="w-full max-w-6xl h-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-none lg:rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#393e41]/5 relative z-10">
        
        {/* --- LEFT SIDE: REGISTER FORM --- */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6 lg:justify-start justify-center">
                <div className="bg-[#e94f37] p-2 rounded-xl">
                    <UserPlus className="text-[#f6f7eb]" size={24} />
                </div>
                <span className="text-2xl font-black text-[#393e41] tracking-tighter uppercase">NoteMaster</span>
            </div>
            <h1 className="text-3xl font-black text-[#393e41] text-center lg:text-left leading-tight">Create Account</h1>
            <p className="text-[#393e41]/60 mt-2 text-sm text-center lg:text-left font-medium">Start organizing your ideas globally today.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#393e41]/80 ml-1 uppercase tracking-wider">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Your name"
                onChange={handleChange}
                className="w-full bg-[#f6f7eb] border-2 border-transparent text-[#393e41] p-4 rounded-xl focus:outline-none focus:border-[#e94f37] transition-all placeholder:text-[#393e41]/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#393e41]/80 ml-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                onChange={handleChange}
                className="w-full bg-[#f6f7eb] border-2 border-transparent text-[#393e41] p-4 rounded-xl focus:outline-none focus:border-[#e94f37] transition-all placeholder:text-[#393e41]/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#393e41]/80 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full bg-[#f6f7eb] border-2 border-transparent text-[#393e41] p-4 rounded-xl focus:outline-none focus:border-[#e94f37] transition-all placeholder:text-[#393e41]/30"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#e94f37] hover:bg-[#d13d28] text-[#f6f7eb] font-bold py-4 rounded-xl shadow-lg shadow-[#e94f37]/20 transition-all duration-300 mt-4 active:scale-95"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-[#393e41]/50 mt-8 text-xs font-bold uppercase tracking-widest">
            Already have an account? <Link to="/login" className="text-[#e94f37] hover:underline">Login here</Link>
          </p>
        </div>

        {/* --- RIGHT SIDE: THEMED VISUAL (Matches Login) --- */}
        <div className="hidden lg:flex bg-[#393e41] flex-col items-center justify-center p-12 relative overflow-hidden border-l border-[#f6f7eb]/5">
          
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e94f37]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f6f7eb]/5 rounded-full blur-[100px]" />
          
          {/* Central Rotating Globe */}
          <div className="relative mb-10 scale-90">
            <div className="absolute inset-0 bg-[#e94f37]/20 blur-[60px] rounded-full" />
            <Globe size={220} className="text-[#f6f7eb]/5 animate-[spin_40s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Globe size={110} className="text-[#e94f37] drop-shadow-[0_0_15px_rgba(233,79,55,0.3)]" />
            </div>
          </div>

          <div className="text-center space-y-4 relative z-10">
            <h2 className="text-2xl font-bold text-[#f6f7eb]">Join NoteMaster</h2>
            <p className="text-[#f6f7eb]/40 max-w-xs mx-auto text-sm leading-relaxed">
              Create an account and sync your thoughts across the globe with zero friction.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex gap-4 mt-12">
            <div className="bg-white/5 px-5 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#e94f37]" />
                <span className="text-[10px] font-bold text-[#f6f7eb] uppercase tracking-[0.2em]">Privacy</span>
            </div>
            <div className="bg-white/5 px-5 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                <Zap size={16} className="text-[#e94f37]" />
                <span className="text-[10px] font-bold text-[#f6f7eb] uppercase tracking-[0.2em]">Sync</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;