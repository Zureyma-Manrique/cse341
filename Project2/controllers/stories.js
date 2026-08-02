const mongodb = require("../db/connect");
const { GoogleGenAI } = require("@google/genai");

const generateStories = async (req, res) => {
  try {
    const { prompt, projectName } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `
      You are an agile product manager. Based on the user's prompt, generate an array of user stories. 
      Return strictly a JSON array of objects. Each object must have:
      - title (string)
      - description (string)
      - estimatedHours (number)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemInstruction}\n\nUser Prompt: ${prompt}`,
    });

    const cleanJson = response.text.replace(/```json|```/g, "").trim();
    const generatedStories = JSON.parse(cleanJson);

    const dbDocuments = generatedStories.map((story) => ({
      title: story.title,
      description: story.description,
      promptSource: prompt,
      status: "pending",
      estimatedHours: story.estimatedHours,
      scheduledDate: null,
      googleEventId: null,
      isSynced: false,
      projectName: projectName || "General",
      createdAt: new Date(),
    }));

    const result = await mongodb
      .getDb()
      .db()
      .collection("userStories")
      .insertMany(dbDocuments);

    res.status(201).json({
      message: "Stories generated successfully.",
      insertedCount: result.insertedCount,
      data: dbDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error during generation." });
  }
};

const getPendingStories = async (req, res) => {
  try {
    const db = mongodb.getDb().db();
    const stories = await db
      .collection("userStories")
      .find({ status: "pending" })
      .toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories." });
  }
};

module.exports = { generateStories, getPendingStories };
