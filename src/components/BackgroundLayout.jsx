import React from 'react';

const BackgroundLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#030712] relative overflow-hidden text-white selection:bg-purple-500 selection:text-white font-sans">
      {/* --- Background Glowing Blobs --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;