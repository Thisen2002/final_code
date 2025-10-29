// import necessary packages 
import express from "express";  // web framework to handle routes & requests
import cors from "cors";  // allows frontend (React) to call backend (cross-origin)
import pkg from "pg";  //PostgreSQL client for Node.js, used to connect and run queries
import fs from "fs";  // file system module to handle CSV file operations
import path from "path";  // handle file paths
import { fileURLToPath } from "url"; // needed to get current directory in ES modules
const { Pool } = pkg;  // extract pool class from pg package

const app = express();
app.use(cors());  // allow requests from frontend
app.use(express.json());  // parse JSON bodies (from frontend POST requests)

// CSV file path 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, 'feedbacks.csv');


// Helper function to append feedback to CSV file
async function appendFeedbackToCSV(rating, message) {
  try {
    const header = 'rating,message,created_at\n';  //column headers
    const safeMessage = String(message).replace(/"/g, '""'); // escape double quotes
    const line = `${rating},"${safeMessage}","${new Date().toISOString()}"\n`;

    if (!fs.existsSync(csvPath)) {
      // if CSV doesn't exist, create it and add the header 
      await fs.promises.writeFile(csvPath, header + line, 'utf8');
    } else {
      // if CSV exists, just append the new line
      await fs.promises.appendFile(csvPath, line, 'utf8');
    }
  } catch (err) {
    // sends the error back to caller 
    throw err;
  }
}

// Database connection
const pool = new Pool({
  user: "postgres",     
  host: "localhost",
  database: "feedbackdb",
  password: "hds19735",  
  port: 5432,
});

// Test connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB connection error", err));

// API endpoint to save feedback
app.post("/feedback", async (req, res) => {
  try {
    const { rating, message } = req.body;  // get data from frontend JSON 
    await pool.query(
      "INSERT INTO feedbacks (rating, message) VALUES ($1, $2)",
      [rating, message]
    );

    // save a backup to CSV as well
    appendFeedbackToCSV(rating, message).catch(err => console.error('CSV save error:', err));
    res.json({ success: true });  // send success response to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });  // send error response to the frontend
  }
});

// serve the live CSV file so clients can download/refresh it
app.get('/feedbacks.csv', (req, res) => {
  res.sendFile(csvPath);
});

// start the server
app.listen(5020, () => console.log("Server running on port 5020"));
