const form = document.getElementById('search-form');
const err = document.getElementById('err');
const card = document.getElementById('card');
const quick = document.getElementById('quick');
const list = document.getElementById('list');

let LABELS = {};
let ROOM_COL = 'room_no'; // default; overwritten by /api/config

// Load config and expose a promise we can await
const ready = (async function loadConfig() {
  try {
    const r = await fetch('/api/config');
    const cfg = await r.json();
    LABELS = cfg.labels || {};
    ROOM_COL = cfg.roomCol || 'room_no';
  } catch {
    // keep defaults
  }
})();

function prettyKey(k) {
  return LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Find the primary key in a given row's keys that corresponds to ROOM_COL
function findPrimaryKey(keys) {
  const want = (ROOM_COL || '').toLowerCase();
  const exact = keys.find(k => k === ROOM_COL);
  if (exact) return exact;
  const ci = keys.find(k => k.toLowerCase() === want);
  if (ci) return ci;
  return keys.find(k => /room/i.test(k)) || keys[0]; // fallback
}

function renderDetails(obj) {
  const entries = Object.entries(obj).filter(([k, v]) => k !== 'id' && v !== '' && v != null);
  card.innerHTML = entries.length
    ? `<dl>${entries.map(([k, v]) => `<dt>${prettyKey(k)}</dt><dd>${String(v)}</dd>`).join('')}</dl>`
    : '<p>No details available.</p>';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await ready;
  err.textContent = '';
  card.classList.add('hidden');
  card.innerHTML = '';

  const room = document.getElementById('room').value.trim();
  if (!room) return;

  try {
    const r = await fetch(`/api/rooms/${encodeURIComponent(room)}`);
    if (!r.ok) {
      err.textContent = r.status === 404 ? 'Room not found' : 'Server error';
      return;
    }
    const data = await r.json();
    renderDetails(data);
    card.classList.remove('hidden');
  } catch {
    err.textContent = 'Network error';
  }
});

// Debounced prefix search
let timer = null;
quick.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    await ready;
    const q = quick.value.trim();
    if (!q) {
      list.innerHTML = '';
      return;
    }

    try {
      const r = await fetch(`/api/rooms?q=${encodeURIComponent(q)}&limit=100`);
      const data = await r.json();

      if (!Array.isArray(data) || data.length === 0) {
        list.innerHTML = '';
        return;
      }

      const keys = Object.keys(data[0]).filter(k => k !== 'id');
      const primary = findPrimaryKey(keys);
      const secondary = keys.find(k => k !== primary) || '';

      list.innerHTML = data.map(row => `
        <div class="row" data-room="${row[primary] ?? ''}">
          <div class="k">${row[primary] ?? ''}</div>
          <div class="v">${secondary ? (row[secondary] ?? '') : ''}</div>
        </div>
      `).join('');

      document.querySelectorAll('.row').forEach(el => {
        el.addEventListener('click', () => {
          const rm = el.getAttribute('data-room');
          document.getElementById('room').value = rm;
          form.dispatchEvent(new Event('submit'));
        });
      });
    } catch {
      list.innerHTML = '';
    }
  }, 250);
});
