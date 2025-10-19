
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
          PitchCraft AI: Enter Your Idea
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-xl rounded-xl">
          
          <div>
            <label htmlFor="ideaName" className="block text-sm font-medium text-gray-700">
              Startup/Idea Name (Optional)
            </label>
            <input
              type="text"
              id="ideaName"
              value={ideaName}
              onChange={(e) => setIdeaName(e.target.value)}
              placeholder="e.g., MentorMate"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Startup Description (Idea ko tafseel se samjhao) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows="4"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I want to build a mobile app that connects university students with industry professionals for 1-on-1 career advice and mock interviews."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            <p className="mt-2 text-sm text-gray-500">
                Minimum 20 characters. The more detail you give, the better the AI output will be.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry / Sector
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
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
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                Pitch Tone (Kaisa lehja chahiye?)
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="formal">Formal & Professional</option>
                <option value="fun">Fun & Quirky</option>
                <option value="concise">Concise & Direct</option>
                <option value="empathetic">Empathetic & Mission-driven</option>
              </select>
            </div>
          </div>
          
          {error && (
            <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-md text-white shadow-lg ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {loading ? 'Generating Pitch with AI...' : 'Generate Pitch with Gemini'}
          </button>
          
        </form>
      </main>
    </div>
  );
};

export default CreatePitch;