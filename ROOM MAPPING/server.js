const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Load DB + config
const DB_PATH = path.join(__dirname, 'db', 'rooms.db');
const CONFIG_PATH = path.join(__dirname, 'db', 'import-config.json');

if (!fs.existsSync(CONFIG_PATH)) {
  console.error('Missing import-config.json. Run: node db/import-from-xls.js');
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const TABLE = cfg.table;
const ROOM_COL = cfg.roomCol;
const LABELS = cfg.labels || {};

if (!TABLE || !ROOM_COL) {
  console.error('Config must include "table" and "roomCol".');
  process.exit(1);
}

const db = new Database(DB_PATH);

// Build a safe, quoted column list from labels (order is UI-friendly)
const COLUMNS = Object.keys(LABELS);
const COLS_SQL = COLUMNS.length
  ? COLUMNS.map(c => `"${c}"`).join(', ')
  : '*'; // fallback if labels empty

// --- Config endpoint for frontend
app.get('/api/config', (req, res) => {
  res.json({ roomCol: ROOM_COL, labels: LABELS });
});

// --- Exact match (case-insensitive)
app.get('/api/rooms/:room', (req, res) => {
  const q = String(req.params.room || '').trim().toLowerCase();
  try {
    const row = db.prepare(
      `SELECT ${COLS_SQL}
       FROM "${TABLE}"
       WHERE LOWER("${ROOM_COL}") = ? 
       LIMIT 1`
    ).get(q);

    if (!row) return res.status(404).json({ error: 'Room not found' });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Prefix search: /api/rooms?q=C-2&limit=50
app.get('/api/rooms', (req, res) => {
  const q = (req.query.q || '').toString().trim().toLowerCase();
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);

  try {
    if (!q) {
      const rows = db.prepare(
        `SELECT ${COLS_SQL}
         FROM "${TABLE}"
         LIMIT ?`
      ).all(limit);
      return res.json(rows);
    }

    const rows = db.prepare(
      `SELECT ${COLS_SQL}
       FROM "${TABLE}"
       WHERE LOWER("${ROOM_COL}") LIKE ? 
       LIMIT ?`
    ).all(`${q}%`, limit);

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Room Lookup running at http://localhost:${PORT}`);
});
