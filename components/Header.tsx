
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <i className="fa-solid fa-play text-white"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Thumbnail Studio
          </h1>
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">วิธีใช้งาน</span>
          <span className="hover:text-white cursor-pointer transition-colors">ฟีเจอร์</span>
          <span className="hover:text-white cursor-pointer transition-colors">ติดต่อเรา</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
