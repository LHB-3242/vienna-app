import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'قوانين أمن الدولة', path: '/state-security-laws' },
    { name: 'بروتوكلات أمن الدولة', path: '/state-security-protocols' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-md shadow-lg border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="https://customer-assets.emergentagent.com/job_c486fc1f-6d38-4395-b181-39a9a2989cf0/artifacts/tdjrzc77_image.png" 
                alt="Vienna RP Logo" 
                className="h-14 w-14 rounded-lg shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-lg bg-pink-500/20 blur-xl group-hover:bg-pink-500/40 transition-all duration-300"></div>
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-white hidden sm:block">
              Vienna RP
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 relative group ${
                  location.pathname === link.path
                    ? 'text-white bg-pink-500/30 shadow-lg shadow-pink-500/20'
                    : 'text-pink-100 hover:text-white hover:bg-pink-500/20'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-pink-100 hover:text-white hover:bg-pink-500/20 transition-all duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-purple-900/98 to-pink-900/98 backdrop-blur-lg border-t border-pink-500/20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-white bg-pink-500/30 shadow-lg shadow-pink-500/20'
                    : 'text-pink-100 hover:text-white hover:bg-pink-500/20'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;