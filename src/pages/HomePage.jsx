import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, LogOut, Search, X, Layers, AlertTriangle, PenTool, Globe } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = "https://note-app-backend-khaki.vercel.app";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // --- DELETE MODAL STATE ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ 1. Security Check & Initial Fetch
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      fetchNotes();
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/show-notes`, { withCredentials: true });
      setNotes(response.data.showNote);
      setFilteredNotes(response.data.showNote);
    } catch (error) {
      if (error.response && error.response.status === 401) {
          localStorage.removeItem("user");
          navigate("/login");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return toast.error("Please fill all fields");

    const loadingToast = toast.loading(isEditing ? "Updating..." : "Creating...");
    try {
      if (isEditing) {
        await axios.patch(
            `${BACKEND_URL}/api/update-note/${editId}`, 
            { title, description }, 
            { withCredentials: true }
        );
        toast.success("Note Updated!", { id: loadingToast });
      } else {
        await axios.post(
            `${BACKEND_URL}/api/add-notes`, 
            { title, description }, 
            { withCredentials: true }
        );
        toast.success("Note Created!", { id: loadingToast });
      }
      resetForm();
      fetchNotes();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { id: loadingToast });
    }
  };

  const confirmDeleteClick = (id) => {
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/delete-note/${noteToDelete}`, { withCredentials: true });
      setNotes(notes.filter((n) => n._id !== noteToDelete));
      toast.success("Note Deleted Successfully");
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.log(error); 
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (note) => {
    setIsEditing(true);
    setEditId(note._id);
    setTitle(note.title);
    setDescription(note.description);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsEditing(false);
    setShowForm(false);
  };

  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("user");
      toast.success("Logged out!", { id: loadingToast });
      window.location.href = "/login";
    } catch (error) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f7eb] text-[#393e41] font-sans selection:bg-[#e94f37] selection:text-[#f6f7eb]">
      
      <Toaster position="bottom-right" />

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#393e41]/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-2 border-[#393e41]/10 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#e94f37]/10 p-4 rounded-full mb-4">
                  <AlertTriangle className="text-[#e94f37]" size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#393e41] mb-2">Delete?</h3>
                <p className="text-[#393e41]/60 text-sm mb-6 font-medium">
                  This note will be gone forever. Sure about this?
                </p>
                <div className="flex gap-3 w-full">
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl bg-[#f6f7eb] text-[#393e41] font-bold border border-[#393e41]/10 hover:bg-[#393e41]/5 transition">
                    Cancel
                  </button>
                  <button onClick={handleDeleteConfirm} className="flex-1 py-3 rounded-xl bg-[#e94f37] text-[#f6f7eb] font-bold shadow-lg shadow-[#e94f37]/20 hover:bg-[#d13d28] transition">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-[#393e41]/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#e94f37] p-2 rounded-xl shadow-lg shadow-[#e94f37]/20">
              <PenTool size={22} className="text-[#f6f7eb]" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-[#393e41] uppercase">Note<span className="text-[#e94f37]">Master</span></h1>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden md:flex items-center gap-2 text-[#393e41]/60 text-sm font-bold">
              <Globe size={16} className="text-[#e94f37]" /> {user.username || "User"}
            </span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-[#393e41] hover:text-[#e94f37] font-bold transition bg-[#393e41]/5 px-4 py-2 rounded-xl">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-10 flex flex-col lg:flex-row gap-10 relative z-10">
        
        {/* --- Left Panel: Form --- */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`lg:w-1/3 w-full bg-white border-2 border-[#393e41]/5 p-8 rounded-[2.5rem] h-fit sticky top-28 shadow-xl shadow-[#393e41]/5 ${showForm ? 'block' : 'hidden lg:block'}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black flex items-center gap-3">
              {isEditing ? <Edit className="text-[#e94f37]"/> : <Plus className="text-[#e94f37]"/>}
              {isEditing ? "Edit" : "New Note"}
            </h2>
            <button onClick={() => setShowForm(false)} className="lg:hidden text-[#393e41]/40 hover:text-[#393e41]"><X /></button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title..."
              className="bg-[#f6f7eb] border-2 border-transparent rounded-2xl p-4 text-[#393e41] font-bold focus:outline-none focus:border-[#e94f37] transition-all placeholder:text-[#393e41]/30"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your thoughts..."
              className="bg-[#f6f7eb] border-2 border-transparent rounded-2xl p-4 text-[#393e41] font-medium focus:outline-none focus:border-[#e94f37] h-48 resize-none transition-all placeholder:text-[#393e41]/30"
            />
            <div className="flex gap-3">
              <button type="submit" className={`flex-1 py-4 rounded-2xl font-bold text-[#f6f7eb] shadow-xl transition-all active:scale-95 ${isEditing ? 'bg-[#393e41]' : 'bg-[#e94f37] shadow-[#e94f37]/20 hover:bg-[#d13d28]'}`}>
                {isEditing ? "Update" : "Create"}
              </button>
              {isEditing && <button onClick={resetForm} className="px-5 bg-[#393e41]/10 rounded-2xl hover:bg-[#393e41]/20 text-[#393e41] font-bold">Cancel</button>}
            </div>
          </form>
        </motion.div>

        {/* --- Right Panel: Notes List --- */}
        <div className="lg:w-2/3 w-full">
          
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-4 text-[#393e41]/30" size={20} />
              <input 
                type="text" 
                placeholder="Search thoughts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-[#393e41]/5 rounded-[1.5rem] pl-14 pr-6 py-4 text-[#393e41] font-bold focus:outline-none focus:border-[#e94f37] shadow-sm transition-all"
              />
            </div>
            <button onClick={() => setShowForm(true)} className="lg:hidden bg-[#e94f37] p-4 rounded-2xl text-[#f6f7eb] shadow-lg shadow-[#e94f37]/20">
              <Plus size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <motion.div
                    key={note._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border border-[#393e41]/5 p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-[#393e41]/5 transition-all group relative border-b-4 border-b-[#393e41]/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black text-[#393e41] leading-tight">{note.title}</h3>
                        <div className="flex gap-1">
                             <button onClick={() => handleEdit(note)} className="p-2 text-[#393e41]/20 hover:text-[#e94f37] hover:bg-[#e94f37]/5 rounded-xl transition">
                                <Edit size={18} />
                             </button>
                             <button onClick={() => confirmDeleteClick(note._id)} className="p-2 text-[#393e41]/20 hover:text-[#e94f37] hover:bg-[#e94f37]/5 rounded-xl transition">
                                <Trash2 size={18} />
                             </button>
                        </div>
                    </div>
                    <p className="text-[#393e41]/60 text-sm leading-relaxed whitespace-pre-wrap font-medium line-clamp-6">{note.description}</p>
                    
                    <div className="mt-6 flex items-center justify-between">
                        <div className="h-1 w-12 bg-[#e94f37]/20 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#393e41]/20">NoteID: {note._id.slice(-4)}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-[#393e41]/10">
                  <Layers size={64} className="mx-auto mb-4 text-[#393e41]/10" />
                  <p className="font-bold text-[#393e41]/40 uppercase tracking-widest">No thoughts captured yet...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;