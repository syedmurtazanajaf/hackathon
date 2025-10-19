
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
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        <Link to="/dashboard" className="text-2xl font-bold text-indigo-700">
          PitchCraft <span className="text-sm font-normal text-gray-500">AI Partner</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            {currentUser && `Welcome, ${currentUser.email}`}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-400 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition duration-150"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;