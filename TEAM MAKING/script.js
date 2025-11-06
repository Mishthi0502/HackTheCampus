// script.js
// Frontend expects the API at the same origin
const API_BASE_URL = '/api';

let events = [];
let teams = [];

// ============ API HELPER FUNCTIONS ============
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!response.ok) {
      let errorMsg = 'Request failed';
      try { const err = await response.json(); errorMsg = err.error || errorMsg; } catch {}
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    showNotification(`❌ ${error.message}`, 'warning');
    throw error;
  }
}

// ============ EVENT FUNCTIONS ============
async function loadEvents() {
  try {
    events = await apiRequest('/events');
    updateEventList();
    updateEventDropdown();
  } catch (error) {
    console.error('Failed to load events:', error);
  }
}

async function addEvent() {
  const name = document.getElementById('eventName').value.trim();
  const date = document.getElementById('eventDate').value;
  const desc = document.getElementById('eventDesc').value.trim();

  if (!name) {
    showNotification('⚠️ Please enter an event name!', 'warning');
    document.getElementById('eventName').focus();
    return;
  }

  try {
    const newEvent = await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify({ name, date, desc })
    });

    events.push(newEvent);
    document.getElementById('eventName').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventDesc').value = '';

    updateEventList();
    updateEventDropdown();
    showNotification('🎉 Event created successfully!', 'success');
  } catch {}
}

function updateEventList() {
  const list = document.getElementById('eventList');
  list.innerHTML = '';
  if (events.length === 0) {
    list.innerHTML = '<li style="text-align: center; color: #a0aec0; padding: 40px 20px; background: rgba(255, 255, 255, 0.5); border: 2px dashed rgba(255, 255, 255, 0.3); border-left: none; border-radius: 16px;"><div style="font-size: 3rem; margin-bottom: 12px;">🎉</div><div style="font-size: 1.1rem; font-weight: 500;">No events created yet</div><div style="font-size: 0.9rem; margin-top: 8px; opacity: 0.8;">Create your first event above to get started!</div></li>';
    return;
  }
  events.forEach((ev, index) => {
    const li = document.createElement('li');
    li.className = 'card';
    li.style.animationDelay = `${index * 0.06}s`;
    li.style.opacity = '0';
    li.style.animation = 'fadeInUp 0.5s ease-out forwards';
    const dateStr = ev.date ? new Date(ev.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : 'No date set';
    li.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">📅 ${ev.name}</div>
          <div class="card-subtitle">${dateStr}</div>
        </div>
      </div>
      ${ev.desc ? `<div style="margin-top:8px;color:#4b5563">${ev.desc}</div>` : ''}
    `;
    list.appendChild(li);
  });
}

function updateEventDropdown() {
  const sel = document.getElementById('eventSelect');
  sel.innerHTML = '<option value="">Select Event</option>';
  events.forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.textContent = ev.name;
    sel.appendChild(opt);
  });
}

// ============ TEAM FUNCTIONS ============
async function loadTeams() {
  try {
    teams = await apiRequest('/teams');
    updateTeamList();
  } catch (error) {
    console.error('Failed to load teams:', error);
  }
}

async function addTeam() {
  const eventId = document.getElementById('eventSelect').value;
  const name = document.getElementById('teamName').value.trim();
  const req = document.getElementById('requirements').value.trim();

  if (!eventId || !name) {
    showNotification('⚠️ Please select an event and enter a team name!', 'warning');
    if (!eventId) document.getElementById('eventSelect').focus();
    else document.getElementById('teamName').focus();
    return;
  }

  try {
    const newTeam = await apiRequest('/teams', {
      method: 'POST',
      body: JSON.stringify({ eventId, name, req })
    });

    teams.push(newTeam);
    document.getElementById('teamName').value = '';
    document.getElementById('requirements').value = '';

    updateTeamList();
    showNotification('🚀 Team created successfully!', 'success');
  } catch {}
}

function updateTeamList(filtered = teams) {
  const list = document.getElementById('teamList');
  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<li style="text-align: center; color: #a0aec0; padding: 40px 20px; background: rgba(255, 255, 255, 0.5); border: 2px dashed rgba(255, 255, 255, 0.3); border-left: none; border-radius: 16px;"><div style="font-size: 3rem; margin-bottom: 12px;">🔍</div><div style="font-size: 1.1rem; font-weight: 500;">No teams found</div><div style="font-size: 0.9rem; margin-top: 8px; opacity: 0.8;">Create a team or adjust your search to find matches!</div></li>';
    return;
  }

  filtered.forEach((team, index) => {
    const ev = events.find(e => e.id == team.eventId);
    const memberCount = team.members.length;
    const li = document.createElement('li');
    li.className = 'card';
    li.style.animationDelay = `${index * 0.06}s`;
    li.style.opacity = '0';
    li.style.animation = 'fadeInUp 0.5s ease-out forwards';
    li.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">👥 ${team.name}</div>
          <div class="card-subtitle">📅 ${ev ? ev.name : 'Unknown Event'}</div>
        </div>
        <button class="btn-ghost" onclick="deleteTeam(${team.id})">🗑️</button>
      </div>
      ${team.req ? `<div style="margin:8px 0;color:#374151"><i>💼 ${team.req}</i></div>` : ''}
      <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
        <strong style="color:#065f46; display:flex; align-items:center; gap:8px;">
          <span>👤</span><span>Members (${memberCount})</span>
        </strong>
        <div style="margin-top: 8px; color:#4b5563; padding-left: 24px; line-height: 1.8;">
          ${team.members.length > 0
            ? team.members.map(m => `<div style="display:flex;align-items:center;gap:8px;"><span style="color:#10b981;font-weight:700;">•</span><span>${m}</span></div>`).join('')
            : '<span style="color:#9ca3af;font-style:italic;">No members yet - be the first to join!</span>'}
        </div>
      </div>
      <div style="margin-top: 12px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn-primary" onclick="joinTeam(${team.id})">➕ Join Team</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function joinTeam(id) {
  const name = prompt('Enter your name to join:');
  if (!name || !name.trim()) return;
  const trimmedName = name.trim();

  try {
    const updatedTeam = await apiRequest(`/teams/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ name: trimmedName })
    });

    const teamIndex = teams.findIndex(t => t.id === id);
    if (teamIndex !== -1) teams[teamIndex] = updatedTeam;

    updateTeamList();
    showNotification(`🎊 Welcome to ${updatedTeam.name}! You've successfully joined the team!`, 'success');
  } catch {}
}

async function deleteTeam(id) {
  const team = teams.find(t => t.id === id);
  if (!team) return;

  if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
    try {
      await apiRequest(`/teams/${id}`, { method: 'DELETE' });
      teams = teams.filter(t => t.id !== id);
      updateTeamList();
      showNotification('🗑️ Team deleted successfully!', 'success');
    } catch {}
  }
}

async function filterTeams() {
  const keyword = document.getElementById('searchBar').value.toLowerCase();
  if (!keyword.trim()) { updateTeamList(teams); return; }

  try {
    const filtered = await apiRequest(`/teams/search/${encodeURIComponent(keyword)}`);
    updateTeamList(filtered);
  } catch {
    // Client-side fallback
    const filtered = teams.filter(t => {
      const ev = events.find(e => e.id == t.eventId);
      return (
        (t.name || '').toLowerCase().includes(keyword) ||
        (t.req || '').toLowerCase().includes(keyword) ||
        (ev && (ev.name || '').toLowerCase().includes(keyword))
      );
    });
    updateTeamList(filtered);
  }
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 12px 16px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
      : type === 'warning' ? 'linear-gradient(135deg, #ff9800 0%, #ff6f00 100%)'
      : 'linear-gradient(135deg, #81c784 0%, #a5d6a7 100%)'};
    color: #fff; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.15);
    z-index: 10000; font-weight: 600; animation: slideInRight .25s ease-out, fadeOut .25s ease-out 2.75s forwards;
    backdrop-filter: blur(10px); border:1px solid rgba(255,255,255,.25);
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight{from{transform:translateX(300px);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes fadeOut{to{opacity:0;transform:translateX(300px)}}
`;
document.head.appendChild(style);

// ============ INIT ============
async function init() {
  try {
    await Promise.all([loadEvents(), loadTeams()]);
  } catch {
    showNotification('⚠️ Failed to load data. Make sure the server is running!', 'warning');
  }
}
init();
