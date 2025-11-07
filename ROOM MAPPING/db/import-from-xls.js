// Import the first sheet from an .xls/.xlsx into SQLite, preserving all columns.
// Renames bad headers (empty, empty_1, empty_2) to: room_no, floor, building.

const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const Database = require('better-sqlite3');

const SRC_XL = path.join(__dirname, 'Lecture and Tutorial Location.xls'); // your file
const DB_PATH = path.join(__dirname, 'rooms.db');
const TABLE = 'rooms';

// Map the auto-generated "empty" headers from the sheet to proper names
const headerRename = {
  'empty': 'room_no',
  'empty_1': 'floor',
  'empty_2': 'building',
  // add more renames here if needed
};

// Normalize header -> SQLite column name (snake_case, [a-z0-9_])
function normCol(header) {
  return String(header || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase() || 'col';
}

// Try to find the "room" column unless we forced it to 'room_no'
function detectRoomColumn(headers, mapped) {
  // If any mapped column is 'room_no', prefer that
  const forced = Object.entries(mapped).find(([, v]) => v === 'room_no');
  if (forced) return forced[1];

  const joined = headers.map(h => [h, h.replace(/[^a-z0-9]/gi, '').toLowerCase()]);
  const candidates = [
    'room', 'roomno', 'roomnum', 'roomnumber',
    'room_no', 'room_num', 'roomcode', 'roomid',
    'location', 'venue'
  ];
  for (const [orig, cleaned] of joined) {
    if (candidates.includes(cleaned)) return mapped[orig];
  }
  const loose = headers.find(h => /room/i.test(h));
  return loose ? mapped[loose] : mapped[headers[0]];
}

function main() {
  if (!fs.existsSync(SRC_XL)) {
    console.error('Excel file not found at:', SRC_XL);
    process.exit(1);
  }

  const wb = xlsx.readFile(SRC_XL);
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: '' }); // array of objects

  if (rows.length === 0) {
    console.error('No rows found in the first sheet.');
    process.exit(1);
  }

  const headersRaw = Object.keys(rows[0]);

  // apply renames then normalize -> map original header => normalized column
  const mapCols = {};
  for (const h of headersRaw) {
    const renamed = headerRename[h] || h;
    mapCols[h] = normCol(renamed);
  }

  const roomCol = detectRoomColumn(headersRaw, mapCols);

  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');

  // Build table with TEXT columns (safe for mixed types); you can later cast types as needed
  const colsSql = headersRaw.map(h => `"${mapCols[h]}" TEXT`).join(', ');
  db.exec(`DROP TABLE IF EXISTS ${TABLE};`);
  db.exec(`
    CREATE TABLE ${TABLE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ${colsSql}
    );
  `);

  // Insert all rows
  const placeholders = headersRaw.map(() => '?').join(', ');
  const insert = db.prepare(`
    INSERT INTO ${TABLE} (${headersRaw.map(h => `"${mapCols[h]}"`).join(', ')})
    VALUES (${placeholders})
  `);
  const insMany = db.transaction((arr) => {
    for (const obj of arr) {
      insert.run(headersRaw.map(h => obj[h] ?? ''));
    }
  });
  insMany(rows);

  // Helpful index for fast lookup by room (case-insensitive)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_${TABLE}_${roomCol}_lower ON ${TABLE}(LOWER("${roomCol}"));`);

  // Save config + pretty labels for the frontend
  const labelMap = {};
  for (const [orig, normed] of Object.entries(mapCols)) {
    const nice = (headerRename[orig] || orig)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    labelMap[normed] = nice;
  }

  const configPath = path.join(__dirname, 'import-config.json');
  fs.writeFileSync(configPath, JSON.stringify({
    table: TABLE,
    roomCol,
    columns: mapCols,
    labels: labelMap,
    sheetName
  }, null, 2));

  console.log('✅ Import complete.');
  console.log('DB:', DB_PATH);
  console.log('Sheet:', sheetName);
  console.log('Detected room column ->', roomCol);
}

main();
