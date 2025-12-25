// server.js
// ----------------------
// Backend to connect the kiosk chatbot to OpenAI
// Keeps the API key safe (not visible to users)
// ----------------------

import express from "express";       // Web server framework
import cors from "cors";             // Lets frontend talk to backend safely
import OpenAI from "openai";         // OpenAI API library
import dotenv from "dotenv";         // Loads secret keys from .env file

dotenv.config();                     // Read the .env file

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client using your secret key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Gets key from .env file (safe!)
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;   // Get user's message from kiosk

  try {
    // Send the message to OpenAI model
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",             // You can change to another model if needed
      messages: [
        { role: "system", content: "You are a helpful assistant for a kiosk system." },
        { role: "user", content: userMessage },
      ],
    });

    // Send the AI’s reply back to the kiosk
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Run the server on port 3000
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
