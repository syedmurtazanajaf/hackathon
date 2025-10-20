import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getPitchesByUser } from '../lib/firebase'; // <-- Import the new function

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [savedPitches, setSavedPitches] = useState([]);
  const [loadingPitches, setLoadingPitches] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPitches = async () => {
      if (!currentUser?.uid) return; // Wait for user UID

      try {
        const pitches = await getPitchesByUser(currentUser.uid);
        setSavedPitches(pitches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPitches(false);
      }
    };

    fetchPitches();
  }, [currentUser]); // Re-fetch when user object loads

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    // Convert ISO string to a human-readable format
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section (from Step 6) remains the same */}
        <div className="pb-6 border-b border-gray-700 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            My Pitches ({savedPitches.length})
          </h1>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              + Create New Pitch (New Idea)
            </Link>
          </div>
        </div>

        {/* Pitches List Area */}
        <div className="mt-10">
          {loadingPitches ? (
            <div className="text-center p-12 text-indigo-400 flex justify-center items-center space-x-3">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span className="text-xl font-medium">Loading your pitches...</span>
            </div>
          ) : error ? (
            <div className="text-center p-12 text-red-400 bg-red-900/30 border border-red-700 rounded-xl">
                <p className="font-semibold">Error fetching data:</p>
                <p>{error}</p>
            </div>
          ) : savedPitches.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1-1.429 1.429A2 2 0 005.172 6H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-2.172a2 2 0 00-1.429-.571M8 12h.01M16 12h.01"/>
              </svg>
              <h3 className="mt-4 text-xl font-medium text-white">
                No pitches found!
              </h3>
              <p className="mt-2 text-base text-gray-400">
                Apna pehla AI-generated pitch banane ke liye button click karein.
              </p>
              <div className="mt-8">
                <Link to="/create" className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition duration-300">
                  Start PitchCrafting!
                </Link>
              </div>
            </div>
          ) : (
            // List of Pitches
            <ul className="divide-y divide-gray-700 bg-gray-800 shadow-2xl shadow-purple-900/30 rounded-2xl">
              {savedPitches.map((pitch) => (
                <li 
                  key={pitch.id} 
                  className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-700/50 transition duration-150 cursor-pointer rounded-xl"
                  onClick={() => navigate(`/pitch/${pitch.id}`)} // Navigate on click
                >
                  <div>
                    <p className="text-xl font-semibold text-indigo-400">{pitch.pitchName || 'Untitled Pitch'}</p>
                    <p className="text-sm text-gray-400 truncate mt-1">{pitch.tagline}</p>
                    <p className="text-xs text-gray-500 mt-2 font-mono">Created: {formatDate(pitch.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider  ${
                        pitch.tone === 'formal' ? 'bg-blue-900/50 text-blue-300 border border-blue-600'  : 'bg-pink-900/50 text-pink-300 border border-pink-600'
                    }`}>
                      {pitch.tone}
                    </span>
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;