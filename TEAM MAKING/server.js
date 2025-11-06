// server.js
// Run: npm i express cors body-parser sqlite3 && node server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'app.db');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serves index.html, script.js

// --- SQLite init ---
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) console.error('❌ DB error:', err.message);
  else console.log('✅ SQLite connected:', DB_FILE);
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id    INTEGER PRIMARY KEY,
      name  TEXT NOT NULL,
      date  TEXT,
      desc  TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id        INTEGER PRIMARY KEY,
      event_id  INTEGER NOT NULL,
      name      TEXT NOT NULL,
      req       TEXT,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS team_members (
      id      INTEGER PRIMARY KEY,
      team_id INTEGER NOT NULL,
      name    TEXT NOT NULL,
      UNIQUE(team_id, name),
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    )
  `);
});

// Helper to shape team with members for the frontend
function teamWithMembers(row) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT name FROM team_members WHERE team_id = ? ORDER BY id ASC`, [row.id], (err, rows) => {
      if (err) return reject(err);
      resolve({
        id: row.id,
        eventId: row.event_id,
        name: row.name,
        req: row.req || '',
        members: rows.map(r => r.name),
      });
    });
  });
}

// ============ EVENT ROUTES ============

// GET /api/events
app.get('/api/events', (req, res) => {
  db.all(`SELECT id, name, date, desc FROM events ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/events
app.post('/api/events', (req, res) => {
  const { name, date, desc } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Event name is required' });

  db.run(`INSERT INTO events (name, date, desc) VALUES (?, ?, ?)`,
    [name.trim(), date || '', desc || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT id, name, date, desc FROM events WHERE id = ?`, [this.lastID], (e2, row) => {
        if (e2) return res.status(500).json({ error: e2.message });
        res.status(201).json(row);
      });
    }
  );
});

// GET /api/events/:id
app.get('/api/events/:id', (req, res) => {
  db.get(`SELECT id, name, date, desc FROM events WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Event not found' });
    res.json(row);
  });
});

// DELETE /api/events/:id
app.delete('/api/events/:id', (req, res) => {
  db.run(`DELETE FROM events WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  });
});

// ============ TEAM ROUTES ============

// GET /api/teams
app.get('/api/teams', (req, res) => {
  db.all(`SELECT id, event_id, name, req FROM teams ORDER BY id DESC`, [], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const out = await Promise.all(rows.map(teamWithMembers));
      res.json(out);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

// POST /api/teams
app.post('/api/teams', (req, res) => {
  const { eventId, name, req: requirements } = req.body;
  if (!eventId || !name || !name.trim()) {
    return res.status(400).json({ error: 'Event ID and team name are required' });
  }

  db.get(`SELECT id FROM events WHERE id = ?`, [eventId], (err, ev) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!ev) return res.status(404).json({ error: 'Event not found' });

    db.run(
      `INSERT INTO teams (event_id, name, req) VALUES (?, ?, ?)`,
      [eventId, name.trim(), requirements || ''],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get(`SELECT id, event_id, name, req FROM teams WHERE id = ?`, [this.lastID], async (e3, row) => {
          if (e3) return res.status(500).json({ error: e3.message });
          const team = await teamWithMembers(row);
          res.status(201).json(team);
        });
      }
    );
  });
});

// GET /api/teams/:id
app.get('/api/teams/:id', (req, res) => {
  db.get(`SELECT id, event_id, name, req FROM teams WHERE id = ?`, [req.params.id], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Team not found' });
    try {
      const team = await teamWithMembers(row);
      res.json(team);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

// POST /api/teams/:id/join
app.post('/api/teams/:id/join', (req, res) => {
  const teamId = parseInt(req.params.id, 10);
  const { name } = req.body;
  const clean = (name || '').trim();
  if (!clean) return res.status(400).json({ error: 'Name is required' });

  db.get(`SELECT id FROM teams WHERE id = ?`, [teamId], (err, team) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    db.run(
      `INSERT OR IGNORE INTO team_members (team_id, name) VALUES (?, ?)`,
      [teamId, clean],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        if (this.changes === 0) return res.status(400).json({ error: 'You already joined this team' });

        db.get(`SELECT id, event_id, name, req FROM teams WHERE id = ?`, [teamId], async (e3, row) => {
          if (e3) return res.status(500).json({ error: e3.message });
          const teamObj = await teamWithMembers(row);
          res.json(teamObj);
        });
      }
    );
  });
});

// DELETE /api/teams/:id
app.delete('/api/teams/:id', (req, res) => {
  db.run(`DELETE FROM teams WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team deleted successfully' });
  });
});

// GET /api/teams/search/:keyword
app.get('/api/teams/search/:keyword', (req, res) => {
  const k = `%${(req.params.keyword || '').toLowerCase()}%`;
  const sql = `
    SELECT t.id, t.event_id, t.name, t.req
    FROM teams t
    LEFT JOIN events e ON e.id = t.event_id
    WHERE lower(t.name) LIKE ? OR lower(t.req) LIKE ? OR lower(e.name) LIKE ?
    ORDER BY t.id DESC
  `;
  db.all(sql, [k, k, k], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const out = await Promise.all(rows.map(teamWithMembers));
      res.json(out);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🗄️  DB file: ${DB_FILE}`);
});
