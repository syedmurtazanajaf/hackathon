
import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext'; 
import { generatePitch } from '../lib/gemini'; 
import { savePitchToDB } from '../lib/firebase.js'; // <-- Import the new function
import { useNavigate } from 'react-router-dom'; 

const CreatePitch = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); 
  const [ideaName, setIdeaName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('Technology'); 
  const [tone, setTone] = useState('formal'); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleSubmit = async (e) => { // <-- IMPORTANT: Change to async
    e.preventDefault();
    setError('');

    if (!description || description.length < 20) {
      setError('Please provide a short description of at least 20 characters.');
      return;
    }

    setLoading(true);

    const startupData = {
      userId: currentUser.uid,
      ideaName,
      description,
      industry,
      tone,
    };

   try {
      // 1. Call the Gemini AI Service
      const aiResponse = await generatePitch(startupData);
      console.log("Gemini Output Received:", aiResponse);
      
      // 2. Save the full record to Firebase Firestore
      const newPitchId = await savePitchToDB(currentUser.uid, startupData, aiResponse);
      
      // 3. Navigate to the Generated Pitch page using the real ID
      navigate(`/pitch/${newPitchId}`); 

    } catch (err) {
      console.error(err);
      // Display the error to the user
      setError(err.message || "AI pitch generation or database saving failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-sans">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-extrabold text-white mb-8 border-b border-indigo-700 pb-3 tracking-tight">
          PitchCraft AI: Enter Your Idea
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800 p-8 shadow-2xl shadow-indigo-900/50 rounded-2xl border border-gray-700">
          
          <div>
            <label htmlFor="ideaName" className="block text-sm font-semibold text-indigo-300 mb-1">
              Startup/Idea Name (Optional)
            </label>
            <input
              type="text"
              id="ideaName"
              value={ideaName}
              onChange={(e) => setIdeaName(e.target.value)}
              placeholder="e.g., MentorMate"
              className="block w-full border border-gray-700 bg-gray-900 text-gray-200 rounded-lg shadow-inner p-3 focus:ring-indigo-600 focus:border-indigo-600 transition duration-150"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-indigo-300 mb-1">
              Startup Description (Idea ko tafseel se samjhao) <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              rows="4"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I want to build a mobile app that connects university students with industry professionals for 1-on-1 career advice and mock interviews."
              className="mt-1 block text-white w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            <p className="mt-2 text-sm text-gray-400">
                Minimum 20 characters. The more detail you give, the better the AI output will be.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="industry" className="block text-sm font-semibold text-indigo-300 mb-1">
                Industry / Sector
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="block w-full border border-gray-700 bg-gray-900 text-gray-200 rounded-lg shadow-inner p-3 focus:ring-indigo-600 focus:border-indigo-600 appearance-none pr-8 transition duration-150"
              >
                <option>Technology</option>
                <option>Education</option>
                <option>Fintech</option>
                <option>Health & Wellness</option>
                <option>E-commerce</option>
                <option>Social Media</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-semibold text-indigo-300 mb-1">
                Pitch Tone (Kaisa lehja chahiye?)
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="block w-full border border-gray-700 bg-gray-900 text-gray-200 rounded-lg shadow-inner p-3 focus:ring-indigo-600 focus:border-indigo-600 appearance-none pr-8 transition duration-150"
              >
                <option value="formal">Formal & Professional</option>
                <option value="fun">Fun & Quirky</option>
                <option value="concise">Concise & Direct</option>
                <option value="empathetic">Empathetic & Mission-driven</option>
              </select>
            </div>
          </div>
          
          {error && (
            <div className="p-4 text-sm font-medium text-red-300 bg-red-900/50 border border-red-700 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-xl font-bold rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.01] ${
              loading 
                ? 'bg-indigo-900/70 text-gray-500 cursor-not-allowed' 
                : 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50'
            }`}
          >
            {loading ? (
                <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Generating Pitch with AI...</span>
                </div>
            ) : (
                'Generate Pitch'
            )}
          </button>
          
        </form>
      </main>
    </div>
  );
};

export default CreatePitch;