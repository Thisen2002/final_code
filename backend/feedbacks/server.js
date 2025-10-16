import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

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

// API to save feedback
app.post("/feedback", async (req, res) => {
  try {
    const { rating, message } = req.body;
    await pool.query(
      "INSERT INTO feedbacks (rating, message) VALUES ($1, $2)",
      [rating, message]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(5020, () => console.log("Server running on port 5020"));
