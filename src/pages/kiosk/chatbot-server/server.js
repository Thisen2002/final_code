// server.js
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import OpenAI from "openai"

// Load .env file (contains your API key)
dotenv.config()

// Initialize Express app
const app = express()
app.use(cors())
app.use(express.json())

// Create OpenAI client using the key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// POST endpoint for chatbot messages
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body

    // Send the message to OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    })

    // Send back the chatbot's reply
    res.json({ reply: response.choices[0].message.content })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error connecting to AI")
  }
})

// Start the server
app.listen(5005, () => console.log("🤖 Chatbot server running on http://localhost:5005"))
