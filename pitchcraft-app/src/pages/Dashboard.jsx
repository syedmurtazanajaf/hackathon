// src/pages/Dashboard.jsx

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section (from Step 6) remains the same */}
        <div className="pb-6 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Pitches ({savedPitches.length})
          </h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
            >
              + Create New Pitch (New Idea)
            </Link>
          </div>
        </div>

        {/* Pitches List Area */}
        <div className="mt-8">
          {loadingPitches ? (
            <div className="text-center p-12 text-indigo-600">Loading your pitches...</div>
          ) : error ? (
            <div className="text-center p-12 text-red-600">{error}</div>
          ) : savedPitches.length === 0 ? (
            // Empty State UI (from Step 6)
            <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1-1.429 1.429A2 2 0 005.172 6H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-2.172a2 2 0 00-1.429-.571M8 12h.01M16 12h.01"/>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No pitches found!
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Apna pehla AI-generated pitch banane ke liye button click karein.
              </p>
              <div className="mt-6">
                <Link to="/create" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  Start PitchCrafting!
                </Link>
              </div>
            </div>
          ) : (
            // List of Pitches
            <ul className="divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
              {savedPitches.map((pitch) => (
                <li 
                  key={pitch.id} 
                  className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50 transition duration-150 cursor-pointer"
                  onClick={() => navigate(`/pitch/${pitch.id}`)} // Navigate on click
                >
                  <div>
                    <p className="text-lg font-semibold text-indigo-700">{pitch.pitchName || 'Untitled Pitch'}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{pitch.tagline}</p>
                    <p className="text-xs text-gray-400 mt-1">Created: {formatDate(pitch.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pitch.tone === 'formal' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                    }`}>
                      {pitch.tone}
                    </span>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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