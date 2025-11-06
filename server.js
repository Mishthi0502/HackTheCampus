import express from "express";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));


const db = new Database("./db/database.db");


db.prepare(`
  CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    studentName TEXT NOT NULL,
    studentEmail TEXT NOT NULL,
    studentRollNo TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();


app.post("/api/issues", (req, res) => {
  const {
    title,
    description,
    category,
    location,
    studentName,
    studentEmail,
    studentRollNo,
  } = req.body;

  const stmt = db.prepare(`
    INSERT INTO issues (title, description, category, location, studentName, studentEmail, studentRollNo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(title, description, category, location, studentName, studentEmail, studentRollNo);
  res.status(201).json({ message: "Issue submitted successfully" });
});

app.get("/api/issues", (req, res) => {
  const issues = db.prepare("SELECT * FROM issues ORDER BY createdAt DESC").all();
  res.json(issues);
});

app.patch("/api/issues/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.prepare("UPDATE issues SET status = ? WHERE id = ?").run(status, id);
  res.json({ message: "Status updated successfully" });
});

app.listen(5000, () => console.log(" Server running on http://localhost:5000"));