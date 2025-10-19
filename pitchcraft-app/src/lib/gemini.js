
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey });
const model = "gemini-2.5-flash";
/**
 * Generates structured pitch content using Gemini AI.
 * @param {object} data - Input data from the form (ideaName, description, industry, tone).
 * @returns {Promise<object>} - Structured pitch data.
 */
export async function generatePitch(data) {
  const { ideaName, description, industry, tone } = data;
  
  // 1. System Instruction (AI ko role dena)
  // This tells Gemini *how* to behave and what its goal is.
  const systemInstruction = `You are PitchCraft, an expert AI startup partner and creative director. Your job is to take a raw startup idea and generate a professional, structured pitch components.
  - The output MUST be a valid JSON object.
  - The output MUST adhere strictly to the JSON schema provided.
  - The tone must match the user's request: "${tone}".
  - The content should be compelling, professional, and concise.`;

  // 2. User Prompt (AI ko sawal dena)
  // This is the input data, structured for clarity.
  const userPrompt = `Generate a complete pitch based on this startup idea:
  - Startup Name (User Suggestion, use this if provided): ${ideaName || 'None'}
  - Detailed Description: ${description}
  - Primary Industry: ${industry}
  
  Generate the following components:
  1. Creative Startup Name (If user didn't provide a good one).
  2. A catchy, 5-word maximum tagline.
  3. A 2-3 sentence elevator pitch summary.
  4. A clear problem statement.
  5. A clear solution statement.
  6. A definition of the ideal target audience persona.
  7. 3-4 lines of website hero section copy.`;

  // 3. JSON Output Schema (AI se format fix karwana)
  // This forces Gemini to return the data in the exact structure we need.
  const schema = {
      type: "object",
      properties: {
        pitchName: { type: "string", description: "The final, best startup name." },
        tagline: { type: "string", description: "A catchy, 5-word maximum tagline." },
        pitch: { type: "string", description: "The 2-3 sentence elevator pitch." },
        problemStatement: { type: "string", description: "A clear problem definition." },
        solutionStatement: { type: "string", description: "A clear solution definition." },
        targetAudience: { type: "string", description: "A detailed persona description of the target audience." },
        landingCopy: { type: "string", description: "The website hero section copy (3-4 lines)." },
      },
      required: ["pitchName", "tagline", "pitch", "problemStatement", "solutionStatement", "targetAudience", "landingCopy"]
  };
  
  try {
    const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schema,
        }
    });

    // The response text is a JSON string, so we parse it.
    const jsonOutput = JSON.parse(response.text);
    return jsonOutput;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate pitch. Please check your API key and connection.");
  }
}