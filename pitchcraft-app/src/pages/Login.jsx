
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard'); 
      } else {
        await signup(email, password);
        navigate('/dashboard'); 
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please check your email and password, or try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(prev => !prev);
    setError(''); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 font-sans">
      <div className="w-full max-w-md p-8 md:p-10 space-y-8 bg-gray-800 shadow-2xl shadow-purple-900/50 rounded-2xl border border-indigo-700 transform transition duration-300 hover:scale-[1.02] ease-in-out">
        <h2 className="text-4xl font-extrabold text-center text-white tracking-tight">
          {isLogin ? 'Login to PitchCraft' : 'Create Your PitchCraft Account'}
        </h2>
        <p className="text-center text-gray-400 text-lg">
          {isLogin 
            ? 'Access your saved pitches.' 
            : 'Start shaping your idea today.'
          }
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-md"
          />
          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-md"
          />

          {error && (
            <div className={`p-4 text-sm font-medium ${error.includes('successful') ? 'text-green-300 bg-green-900/50' : 'text-red-300 bg-red-900/50'} rounded-xl transition-all duration-300 border border-current`}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center cursor-pointer py-3 px-4 text-white text-lg font-semibold rounded-xl shadow-lg transition duration-300 ease-in-out transform 
                ${loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-300'
                }`}
            >
              {loading ? (
                <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </div>
              ) : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </div>
        </form>

        <div className="text-sm text-center pt-2">
          <button 
            onClick={toggleMode}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1 -m-1"
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;