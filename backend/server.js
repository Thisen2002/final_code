import dotenv from "dotenv";
dotenv.config({ path: "./notifications.env" });

import express from "express";
import cors from "cors";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

console.log("PGUSER:", process.env.PGUSER);
console.log("PGPASSWORD:", process.env.PGPASSWORD);

// ✅ Connect to PostgreSQL
const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL!"))
  .catch((err) => console.error("PostgreSQL connection failed:", err));

// ✅ Example route to get notifications
app.get("/notifications/selected", async (req, res) => {
  const query = "SELECT id, title, message,time FROM notifications ORDER BY id DESC";

  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch selected columns" });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
