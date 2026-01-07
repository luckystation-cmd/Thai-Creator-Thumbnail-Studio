
import React from 'react';

const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="bg-gradient-to-br from-red-600 to-orange-500 p-2 rounded-xl shadow-lg shadow-red-900/20">
            <i className="fa-solid fa-bolt-lightning text-white"></i>
          </div>
          <h1 className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
            THUMBNAIL <span className="text-red-500">STUDIO</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <button onClick={() => scrollToSection('how-to-use')} className="hover:text-red-500 transition-colors">วิธีใช้งาน</button>
          <button onClick={() => scrollToSection('features')} className="hover:text-red-500 transition-colors">ฟีเจอร์</button>
          
          <div className="flex items-center space-x-4 pl-4 border-l border-slate-800">
            <a href="https://www.facebook.com/luckystation88" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors flex items-center gap-2">
              <i className="fa-brands fa-facebook text-base"></i>
              <span>Facebook</span>
            </a>
            <div className="flex items-center gap-2 text-green-500">
              <i className="fa-brands fa-line text-base"></i>
              <span className="text-slate-400">Line:</span>
              <span className="text-white select-all">mylucky14</span>
            </div>
          </div>
        </nav>

        {/* Mobile Contact Only Icon */}
        <div className="md:hidden flex space-x-4">
          <a href="https://www.facebook.com/luckystation88" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
            <i className="fa-brands fa-facebook text-xl"></i>
          </a>
          <div className="text-green-500">
            <i className="fa-brands fa-line text-xl"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
