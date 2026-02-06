import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, LogOut, Search, X, Layers, AlertTriangle } from "lucide-react";
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

  useEffect(() => {
    fetchNotes();
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
      // ✅ Updated URL
      const response = await axios.get(`${BACKEND_URL}/api/show-notes`, { withCredentials: true });
      setNotes(response.data.showNote);
      setFilteredNotes(response.data.showNote);
    } catch (error) {
      if (error.response && error.response.status === 401) {
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
        // ✅ Updated URL (PATCH)
        await axios.patch(
            `${BACKEND_URL}/api/update-note/${editId}`, 
            { title, description }, 
            { withCredentials: true }
        );
        toast.success("Note Updated!", { id: loadingToast });
      } else {
        // ✅ Updated URL (POST)
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

  // 1. Jab Dustbin par click hoga -> Sirf Popup khulega
  const confirmDeleteClick = (id) => {
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };

  // 2. Jab Popup me "Yes, Delete" dabayenge -> Tab API call hogi
  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    try {
      // ✅ Updated URL (DELETE)
      await axios.delete(`${BACKEND_URL}/api/delete-note/${noteToDelete}`, { withCredentials: true });
      
      setNotes(notes.filter((n) => n._id !== noteToDelete));
      toast.success("Note Deleted Successfully");
      
      // Modal band karo aur state clear karo
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] relative overflow-hidden text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* --- Background Design --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <Toaster position="bottom-right" />

      {/* --- DELETE CONFIRMATION POPUP (MODAL) --- */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f172a] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                  <AlertTriangle className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Note?</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Are you sure you want to delete this note? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg transition"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Layers size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Note<span className="text-blue-500">Master</span></h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden md:block text-gray-400 text-sm">
              Hello, <span className="text-white font-semibold">{user.username || "User"}</span> 👋
            </span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10 flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* --- Left Panel: Form --- */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`lg:w-1/3 w-full bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl h-fit sticky top-28 ${showForm ? 'block' : 'hidden lg:block'}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {isEditing ? <Edit className="text-green-400"/> : <Plus className="text-blue-400"/>}
              {isEditing ? "Edit Note" : "New Note"}
            </h2>
            <button onClick={() => setShowForm(false)} className="lg:hidden text-gray-400 hover:text-white"><X /></button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., Grocery List)"
              className="bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something..."
              className="bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 h-40 resize-none transition"
            />
            <div className="flex gap-2">
              <button type="submit" className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg ${isEditing ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'} transition-all`}>
                {isEditing ? "Update Note" : "Create Note"}
              </button>
              {isEditing && <button onClick={resetForm} className="px-4 bg-gray-700 rounded-xl hover:bg-gray-600 text-white">Cancel</button>}
            </div>
          </form>
        </motion.div>

        {/* --- Right Panel: Notes List --- */}
        <div className="lg:w-2/3 w-full">
          
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search your notes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <button onClick={() => setShowForm(true)} className="lg:hidden bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
              <Plus size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <motion.div
                    key={note._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-150"></div>
                    
                    <h3 className="text-lg font-bold text-gray-100 mb-2">{note.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap mb-10">{note.description}</p>
                    
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button onClick={() => handleEdit(note)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => confirmDeleteClick(note._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 opacity-50">
                  <Layers size={64} className="mx-auto mb-4 text-gray-600" />
                  <p>No notes found...</p>
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