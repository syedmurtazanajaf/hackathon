// src/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc,
  doc,             // <-- Added doc import
  getDoc,          // <-- Added getDoc import
  query, 
  where, 
  orderBy, 
  getDocs 
} from "firebase/firestore"; 

// --- Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// --- Exported Firebase Services ---
export const auth = getAuth(app); 
export const db = getFirestore(app);

// --- 1. Function to Save Pitch ---

/**
 * Saves the generated pitch data to the 'pitches' collection in Firestore.
 * @param {string} userId - The unique ID of the current user.
 * @param {object} ideaData - The user's input data.
 * @param {object} pitchData - The structured AI output.
 * @returns {Promise<string>} The ID of the newly created pitch document.
 */
export async function savePitchToDB(userId, ideaData, pitchData) {
  try {
    const fullPitchRecord = {
      userId: userId,
      ideaName: ideaData.ideaName || pitchData.pitchName, // Use AI name if user didn't give one
      description: ideaData.description,
      industry: ideaData.industry,
      tone: ideaData.tone,
      ...pitchData, // Adds all the AI-generated fields
      createdAt: new Date().toISOString(), // Standard timestamp
    };

    const docRef = await addDoc(collection(db, "pitches"), fullPitchRecord);
    return docRef.id;

  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Could not save the pitch to the database.");
  }
}

// --- 2. Function to Fetch a Single Pitch (MISSING FUNCTION ADDED HERE) ---

/**
 * Fetches a single pitch document from Firestore using its ID.
 * @param {string} pitchId - The ID of the pitch document to fetch.
 * @returns {Promise<object | null>} The pitch data or null if not found.
 */
export async function getPitchById(pitchId) {
  try {
    const docRef = doc(db, "pitches", pitchId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error fetching document: ", e);
    throw new Error("Could not retrieve the pitch details.");
  }
}

// --- 3. Function to Fetch All User Pitches ---

/**
 * Fetches all pitches saved by a specific user, ordered by creation date.
 * @param {string} userId - The unique ID of the current user.
 * @returns {Promise<Array<object>>} A list of pitch documents.
 */
export async function getPitchesByUser(userId) {
  try {
    const pitchesRef = collection(db, "pitches");
    const q = query(
      pitchesRef, 
      where("userId", "==", userId), 
      orderBy("createdAt", "desc") // Newest pitches first
    );

    const querySnapshot = await getDocs(q);
    
    // Map the snapshot to an array of pitch objects
    const pitchesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return pitchesList;

  } catch (e) {
    console.error("Error fetching user pitches: ", e);
    throw new Error("Could not load your saved pitches.");
  }
}