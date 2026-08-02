// services/aiService.js
// Wraps the @google/genai client and forces the model to return
// strict JSON matching our userStories schema, so the controller
// can map the response directly into MongoDB documents.

const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set. AI generation calls will fail.');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = 'gemini-flash-latest';

// JSON schema Gemini must conform to. Using responseSchema (structured output)
// removes the need to hand-parse markdown fences or free-form text.
const storySchema = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      title: { type: 'STRING' },
      description: { type: 'STRING' },
      estimatedHours: { type: 'NUMBER' },
      scheduledDate: {
        type: 'STRING',
        description: 'ISO 8601 date (YYYY-MM-DD) the story is tentatively scheduled for.',
      },
      projectName: { type: 'STRING' },
    },
    required: ['title', 'description', 'estimatedHours', 'projectName'],
  },
};

const SYSTEM_INSTRUCTION = `You are an agile delivery assistant embedded in a calendar automation tool.
Given a natural-language prompt describing work to be done, break it down into
well-formed agile user stories following the pattern "As a <role>, I want <goal>,
so that <benefit>" in the description field. Keep titles short (under 10 words).
Estimate realistic effort in hours. If the prompt doesn't specify a project name,
infer a reasonable short one. Only return the structured data — no commentary.`;

/**
 * Calls Gemini to turn a free-text prompt into an array of structured user stories.
 * @param {string} prompt - Natural language description of the work.
 * @returns {Promise<Array<{title:string, description:string, estimatedHours:number, scheduledDate:string, projectName:string}>>}
 */
async function generateUserStories(prompt) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('A non-empty "prompt" string is required to generate user stories.');
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: storySchema,
      temperature: 0.4,
    },
  });

  const rawText = response.text;

  let stories;
  try {
    stories = JSON.parse(rawText);
  } catch (err) {
    throw new Error(`Gemini returned non-JSON output that could not be parsed: ${err.message}`);
  }

  if (!Array.isArray(stories) || stories.length === 0) {
    throw new Error('Gemini did not return any user stories for this prompt.');
  }

  return stories;
}

module.exports = { generateUserStories };
