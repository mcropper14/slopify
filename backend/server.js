require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Gemini AI API endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    const { task, currentCode } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.'
      });
    }

    // Build the prompt based on context
    let prompt = `You are a helpful coding assistant. ${task}`;

    if (currentCode) {
      prompt += `\n\nHere is the current code in the editor:\n\`\`\`\n${currentCode}\n\`\`\``;
    }

    prompt += '\n\nProvide clear, working code with brief explanations. Keep it concise and practical.';

    // Call Gemini API using the new SDK structure
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const responseText = response.text;

    res.json({ response: responseText || 'No response generated.' });

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      error: `AI request failed: ${error.message}`,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Serve the main index.html file for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(` running on port ${PORT} `);
  console.log(`🎯 Access the IDE at: http://localhost:${PORT}`);
  if (process.env.GEMINI_API_KEY) {
    console.log(`🤖 Gemini AI integration: ENABLED 💪`);
  } else {
    console.log(`🤖 Gemini AI integration: DISABLED (no API key)`);
  }
  
});