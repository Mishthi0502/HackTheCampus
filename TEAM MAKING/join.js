const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app.db');

const sql = `
SELECT 
  e.id AS event_id,
  e.name AS event_name,
  e.date AS event_date,
  e.desc AS event_desc,
  t.id AS team_id,
  t.name AS team_name,
  t.req AS team_req,
  m.name AS member_name
FROM events e
LEFT JOIN teams t ON e.id = t.event_id
LEFT JOIN team_members m ON t.id = m.team_id
ORDER BY e.id, t.id, m.id;
`;

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error('❌ Error:', err.message);
  } else {
    console.table(rows);
  }
  db.close();
});
