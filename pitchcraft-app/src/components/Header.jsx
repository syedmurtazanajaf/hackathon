
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Logout failed:', e);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md shadow-2xl shadow-indigo-900/40 border-b border-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        <Link to="/dashboard" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-wide">
          PitchCraft <span className="text-sm font-medium text-gray-400">AI Partner</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 hidden sm:block">
            {currentUser && `Welcome, ${currentUser.email}`}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 cursor-pointer border border-red-700 text-sm font-medium rounded-lg text-red-400 hover:bg-red-900/30 transition duration-150"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;