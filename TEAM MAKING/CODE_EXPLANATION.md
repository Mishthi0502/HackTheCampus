# Complete Code Explanation - Collab Link Project

This document explains every file and code block in the Collab Link project.

---

## 📁 Project Structure

```
TEAM MAKING/
├── index.html      # Frontend HTML structure
├── style.css       # All styling and animations
├── script.js       # Frontend JavaScript logic
├── server.js       # Backend Express server
├── package.json    # Node.js dependencies
├── data.json       # Data storage (auto-generated)
└── README.md       # Project documentation
```

---

## 1. 📄 index.html - Frontend Structure

### **Block 1: HTML Head Section (Lines 1-11)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Collab Link - Team Finder</title>
```
- **Purpose**: Document type and basic HTML structure
- **Meta tags**: UTF-8 encoding, responsive viewport
- **Title**: Browser tab title

### **Block 2: Google Fonts (Lines 7-9)**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```
- **Purpose**: Loads Poppins font from Google Fonts
- **Preconnect**: Speeds up font loading
- **Weights**: Multiple font weights (300-800) for design flexibility

### **Block 3: CSS Link (Line 10)**
```html
<link rel="stylesheet" href="style.css">
```
- **Purpose**: Links external CSS file for styling

### **Block 4: Background Animation Container (Lines 13-19)**
```html
<div class="background-animation">
  <div class="floating-shape shape-1"></div>
  <div class="floating-shape shape-2"></div>
  ...
</div>
```
- **Purpose**: Creates animated floating shapes in background
- **5 shapes**: Different sizes and positions for visual depth
- **CSS controlled**: Animation handled in style.css

### **Block 5: Main Container & Header (Lines 21-25)**
```html
<div class="container">
  <div class="header">
    <h1 class="title">Collab Link</h1>
    <p class="subtitle">Connect • Collaborate • Create</p>
  </div>
```
- **Container**: Wraps all content, left-aligned
- **Header**: Main title and tagline
- **Styling**: Large title, smaller subtitle

### **Block 6: Event Section (Lines 27-41)**
```html
<section id="event-section" class="glass-card">
  <div class="section-header">
    <h2><span class="icon">📅</span> Create Event</h2>
    <div class="section-line"></div>
  </div>
  <div class="form-group">
    <input id="eventName" placeholder="Event Name" class="input-field">
    <input id="eventDate" type="date" class="input-field">
    <textarea id="eventDesc" placeholder="Event Description" class="input-field textarea-field"></textarea>
    <button onclick="addEvent()" class="btn-primary">✨ Add Event</button>
  </div>
  <ul id="eventList" class="card-list"></ul>
</section>
```
- **Purpose**: Form to create events
- **Inputs**: Event name, date picker, description textarea
- **Button**: Calls `addEvent()` JavaScript function
- **List**: Dynamically populated with created events

### **Block 7: Team Section (Lines 43-56)**
```html
<section id="team-section" class="glass-card">
  <select id="eventSelect" class="input-field"></select>
  <input id="teamName" placeholder="Team Name" class="input-field">
  <textarea id="requirements" placeholder="Requirements..." class="input-field textarea-field"></textarea>
  <button onclick="addTeam()" class="btn-primary">🚀 Add Team</button>
</section>
```
- **Purpose**: Form to create teams for events
- **Dropdown**: Selects which event the team belongs to (populated dynamically)
- **Inputs**: Team name and requirements
- **Button**: Calls `addTeam()` JavaScript function

### **Block 8: Search/Filter Section (Lines 58-67)**
```html
<section id="filter-section" class="glass-card">
  <input id="searchBar" placeholder="🔎 Search..." oninput="filterTeams()" class="input-field search-input">
  <ul id="teamList" class="card-list"></ul>
</section>
```
- **Purpose**: Search and display teams
- **Search input**: Real-time filtering via `oninput` event
- **List**: Dynamically populated with teams

### **Block 9: JavaScript Link (Line 70)**
```html
<script src="script.js"></script>
```
- **Purpose**: Links external JavaScript file
- **Location**: End of body for faster page load

---

## 2. 🎨 style.css - Styling & Animations

### **Block 1: CSS Reset (Lines 1-5)**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```
- **Purpose**: Resets default browser styles
- **box-sizing**: Makes width calculations include padding/border

### **Block 2: CSS Variables (Lines 7-19)**
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  --glass-bg: rgba(255, 255, 255, 0.25);
  --text-primary: #2d3748;
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.15);
  ...
}
```
- **Purpose**: Defines reusable CSS variables
- **Benefits**: Easy theme changes, consistent styling
- **Usage**: Referenced with `var(--variable-name)`

### **Block 3: Body Styling (Lines 21-30)**
```css
body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
  min-height: 100vh;
  ...
}
```
- **Font**: Poppins with fallbacks
- **Background**: Soft green vertical gradient
- **min-height**: Ensures full viewport height

### **Block 4: Background Animation Container (Lines 32-41)**
```css
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
```
- **Purpose**: Container for floating shapes
- **Fixed position**: Stays in place when scrolling
- **z-index: 0**: Behind all content
- **pointer-events: none**: Doesn't interfere with clicks

### **Block 5: Floating Shapes (Lines 43-95)**
```css
.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.08);
  animation: float 20s infinite ease-in-out;
}

.shape-1 { width: 250px; height: 250px; ... }
.shape-2 { width: 180px; height: 180px; ... }
```
- **Purpose**: Creates animated decorative circles
- **5 shapes**: Different sizes and positions
- **Animation**: Continuous floating movement
- **Colors**: Subtle green tones matching theme

### **Block 6: Float Animation (Lines 97-110)**
```css
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(50px, -50px) rotate(90deg); }
  50% { transform: translate(-30px, -100px) rotate(180deg); }
  75% { transform: translate(-50px, 30px) rotate(270deg); }
}
```
- **Purpose**: Defines floating animation
- **Keyframes**: 4 stages of movement
- **Transform**: Moves and rotates shapes smoothly
- **Infinite**: Animation loops forever

### **Block 7: Container & Header (Lines 112-153)**
```css
.container {
  max-width: 1200px;
  margin: 0;
  padding: 30px 20px 30px 40px;
  position: relative;
  z-index: 1;
}

.header {
  text-align: left;
  margin-bottom: 40px;
  animation: fadeInDown 0.8s ease-out;
}
```
- **Container**: Main content wrapper, left-aligned
- **Padding**: Extra left padding for left alignment
- **z-index: 1**: Above background animation
- **Header**: Left-aligned title section

### **Block 8: Title & Subtitle (Lines 137-153)**
```css
.title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #2e7d32;
  text-shadow: 0 2px 10px rgba(46, 125, 50, 0.1);
}

.subtitle {
  font-size: 1.1rem;
  color: #4caf50;
  text-transform: uppercase;
}
```
- **Title**: Large, bold, dark green
- **Subtitle**: Smaller, lighter green, uppercase
- **Text-shadow**: Subtle depth effect

### **Block 9: Glass Card Effect (Lines 155-197)**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  padding: 24px;
  max-width: 650px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```
- **Purpose**: Creates glassmorphism effect (frosted glass)
- **backdrop-filter**: Blurs background behind card
- **Semi-transparent**: 90% white opacity
- **Hover effect**: Lifts up on hover
- **Size**: Max 650px width (smaller boxes)

### **Block 10: Fade In Animations (Lines 182-191)**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
- **Purpose**: Cards fade in from bottom on page load
- **Staggered**: Each section has different delay (0.1s, 0.2s, 0.3s)

### **Block 11: Form Inputs (Lines 232-258)**
```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-field:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
  transform: translateY(-1px);
}
```
- **Purpose**: Styled form inputs
- **Focus state**: Green border, shadow, slight lift
- **Smooth transitions**: All changes animated

### **Block 12: Primary Button (Lines 275-326)**
```css
.btn-primary {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  padding: 14px 24px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-primary::before {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transition: width 0.6s, height 0.6s;
}

.btn-primary:hover::before {
  width: 300px;
  height: 300px;
}
```
- **Purpose**: Green gradient button
- **Ripple effect**: White circle expands on hover (::before pseudo-element)
- **Hover**: Lifts up, changes gradient
- **Active**: Pressed state

### **Block 13: Card List Items (Lines 337-371)**
```css
.card-list li {
  background: rgba(255, 255, 255, 0.95);
  padding: 18px;
  border-radius: 14px;
  border-left: 4px solid #4caf50;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-list li::before {
  content: '';
  position: absolute;
  left: -100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.card-list li:hover::before {
  left: 100%;
}
```
- **Purpose**: Styled list items for events/teams
- **Shine effect**: White gradient sweeps across on hover (::before)
- **Hover**: Slides right, lifts up, border expands
- **Green accent**: Left border in green

### **Block 14: Responsive Design (Lines 427-455)**
```css
@media (max-width: 768px) {
  .title { font-size: 2.5rem; }
  .glass-card { padding: 24px; margin: 20px 10px; }
  #teamList li button { width: 100%; margin: 6px 0; }
  .floating-shape { display: none; }
}
```
- **Purpose**: Mobile-friendly styles
- **Breakpoint**: 768px and below
- **Adjustments**: Smaller fonts, full-width buttons, hide shapes

---

## 3. 💻 script.js - Frontend Logic

### **Block 1: Configuration (Lines 1-4)**
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
let events = [];
let teams = [];
```
- **API_BASE_URL**: Backend server address
- **Arrays**: Store events and teams in memory
- **Purpose**: Cache data for quick access

### **Block 2: API Helper Function (Lines 8-29)**
```javascript
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    return await response.json();
  } catch (error) {
    showNotification(`❌ ${error.message}`, 'warning');
    throw error;
  }
}
```
- **Purpose**: Centralized API request handler
- **Features**: Error handling, JSON parsing, notifications
- **Reusable**: All API calls use this function

### **Block 3: Load Events (Lines 33-41)**
```javascript
async function loadEvents() {
  try {
    events = await apiRequest('/events');
    updateEventList();
    updateEventDropdown();
  } catch (error) {
    console.error('Failed to load events:', error);
  }
}
```
- **Purpose**: Fetches all events from server
- **Updates**: Event list display and dropdown menu
- **Error handling**: Logs errors without crashing

### **Block 4: Add Event (Lines 43-71)**
```javascript
async function addEvent() {
  const name = document.getElementById('eventName').value.trim();
  const date = document.getElementById('eventDate').value;
  const desc = document.getElementById('eventDesc').value.trim();
  
  if (!name) {
    showNotification('⚠️ Please enter an event name!', 'warning');
    return;
  }
  
  const newEvent = await apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify({ name, date, desc })
  });
  
  events.push(newEvent);
  // Clear form and update UI
}
```
- **Purpose**: Creates new event
- **Validation**: Checks for event name
- **API call**: POST request to server
- **UI update**: Adds to list, clears form, shows notification

### **Block 5: Update Event List (Lines 73-100)**
```javascript
function updateEventList() {
  const list = document.getElementById('eventList');
  list.innerHTML = '';
  if (events.length === 0) {
    list.innerHTML = '<li>No events created yet...</li>';
    return;
  }
  events.forEach((ev, index) => {
    const li = document.createElement('li');
    li.style.animationDelay = `${index * 0.1}s`;
    li.style.animation = 'fadeInUp 0.5s ease-out forwards';
    const dateStr = ev.date ? new Date(ev.date).toLocaleDateString(...) : 'No date set';
    li.innerHTML = `<b>📅 ${ev.name}</b>...`;
    list.appendChild(li);
  });
}
```
- **Purpose**: Renders events in the UI
- **Empty state**: Shows message if no events
- **Animation**: Staggered fade-in for each item
- **Date formatting**: Converts date to readable format

### **Block 6: Update Event Dropdown (Lines 102-111)**
```javascript
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
```
- **Purpose**: Populates event dropdown for team creation
- **Default option**: "Select Event" placeholder
- **Dynamic**: Updates when events are added/removed

### **Block 7: Load Teams (Lines 115-122)**
```javascript
async function loadTeams() {
  try {
    teams = await apiRequest('/teams');
    updateTeamList();
  } catch (error) {
    console.error('Failed to load teams:', error);
  }
}
```
- **Purpose**: Fetches all teams from server
- **Similar to**: loadEvents() function

### **Block 8: Add Team (Lines 124-151)**
```javascript
async function addTeam() {
  const eventId = document.getElementById('eventSelect').value;
  const name = document.getElementById('teamName').value.trim();
  const req = document.getElementById('requirements').value.trim();
  
  if (!eventId || !name) {
    showNotification('⚠️ Please select an event and enter a team name!', 'warning');
    return;
  }
  
  const newTeam = await apiRequest('/teams', {
    method: 'POST',
    body: JSON.stringify({ eventId, name, req })
  });
  
  teams.push(newTeam);
  // Clear form and update UI
}
```
- **Purpose**: Creates new team for an event
- **Validation**: Requires event selection and team name
- **API call**: POST request with team data

### **Block 9: Update Team List (Lines 153-191)**
```javascript
function updateTeamList(filtered = teams) {
  const list = document.getElementById('teamList');
  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<li>No teams found...</li>';
    return;
  }
  filtered.forEach((team, index) => {
    const ev = events.find(e => e.id == team.eventId);
    const memberCount = team.members.length;
    const li = document.createElement('li');
    li.innerHTML = `
      <b>👥 ${team.name}</b>
      <div>📅 ${ev ? ev.name : 'Unknown Event'}</div>
      ${team.req ? `<i>💼 ${team.req}</i>` : ''}
      <div>👤 Members (${memberCount}): ...</div>
      <button onclick="joinTeam(${team.id})">➕ Join Team</button>
      <button onclick="deleteTeam(${team.id})">🗑️ Delete</button>
    `;
    list.appendChild(li);
  });
}
```
- **Purpose**: Renders teams in the UI
- **Parameters**: Can display filtered or all teams
- **Details**: Shows event, requirements, members, actions
- **Buttons**: Join and delete functionality

### **Block 10: Join Team (Lines 193-215)**
```javascript
async function joinTeam(id) {
  const name = prompt('Enter your name to join:');
  if (!name || !name.trim()) return;
  
  const updatedTeam = await apiRequest(`/teams/${id}/join`, {
    method: 'POST',
    body: JSON.stringify({ name: trimmedName })
  });
  
  const teamIndex = teams.findIndex(t => t.id === id);
  if (teamIndex !== -1) {
    teams[teamIndex] = updatedTeam;
  }
  updateTeamList();
  showNotification(`🎊 Welcome to ${updatedTeam.name}!...`, 'success');
}
```
- **Purpose**: Adds user to team
- **Input**: Prompts for name
- **API call**: POST to join endpoint
- **Update**: Refreshes team list with new member

### **Block 11: Delete Team (Lines 217-234)**
```javascript
async function deleteTeam(id) {
  const team = teams.find(t => t.id === id);
  if (!team) return;
  
  if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
    await apiRequest(`/teams/${id}`, { method: 'DELETE' });
    teams = teams.filter(t => t.id !== id);
    updateTeamList();
    showNotification('🗑️ Team deleted successfully!', 'success');
  }
}
```
- **Purpose**: Removes team
- **Confirmation**: Asks user to confirm
- **API call**: DELETE request
- **Update**: Removes from array and UI

### **Block 12: Filter Teams (Lines 236-259)**
```javascript
async function filterTeams() {
  const keyword = document.getElementById('searchBar').value.toLowerCase();
  
  if (!keyword.trim()) {
    updateTeamList(teams);
    return;
  }
  
  try {
    const filtered = await apiRequest(`/teams/search/${encodeURIComponent(keyword)}`);
    updateTeamList(filtered);
  } catch (error) {
    // Fallback to client-side filtering
    const filtered = teams.filter(t => {
      const ev = events.find(e => e.id == t.eventId);
      return (
        t.name.toLowerCase().includes(keyword) ||
        t.req.toLowerCase().includes(keyword) ||
        (ev && ev.name.toLowerCase().includes(keyword))
      );
    });
    updateTeamList(filtered);
  }
}
```
- **Purpose**: Searches teams by keyword
- **Real-time**: Called on input change
- **Server-side**: Uses API search endpoint
- **Fallback**: Client-side filtering if API fails

### **Block 13: Notification System (Lines 262-283)**
```javascript
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? 'linear-gradient(...)' : ...};
    animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s forwards;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
```
- **Purpose**: Shows toast notifications
- **Types**: success, warning, info
- **Animation**: Slides in from right, fades out
- **Auto-remove**: Disappears after 3 seconds

### **Block 14: Animation Keyframes (Lines 286-305)**
```javascript
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOut {
    to { opacity: 0; transform: translateX(400px); }
  }
`;
document.head.appendChild(style);
```
- **Purpose**: Adds CSS animations dynamically
- **slideInRight**: Notification enters from right
- **fadeOut**: Notification exits to right

### **Block 15: Initialization (Lines 308-317)**
```javascript
async function init() {
  try {
    await Promise.all([loadEvents(), loadTeams()]);
  } catch (error) {
    showNotification('⚠️ Failed to load data. Make sure the server is running!', 'warning');
  }
}

init();
```
- **Purpose**: Loads data when page opens
- **Parallel**: Loads events and teams simultaneously
- **Error handling**: Shows warning if server unavailable

---

## 4. 🖥️ server.js - Backend API

### **Block 1: Imports & Setup (Lines 1-9)**
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
```
- **express**: Web framework for Node.js
- **cors**: Allows cross-origin requests
- **bodyParser**: Parses JSON request bodies
- **fs**: File system operations (read/write data.json)
- **PORT**: Server port (3000 or environment variable)

### **Block 2: Middleware (Lines 11-14)**
```javascript
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));
```
- **cors()**: Enables CORS for all routes
- **bodyParser.json()**: Parses JSON in request body
- **express.static()**: Serves static files (HTML, CSS, JS)

### **Block 3: Initialize Data File (Lines 16-19)**
```javascript
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ events: [], teams: [] }, null, 2));
}
```
- **Purpose**: Creates data.json if it doesn't exist
- **Structure**: Empty arrays for events and teams
- **Formatting**: Pretty-printed JSON (2 spaces)

### **Block 4: Helper Functions (Lines 21-34)**
```javascript
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { events: [], teams: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
```
- **readData()**: Reads and parses data.json
- **Error handling**: Returns empty object if file corrupted
- **writeData()**: Writes data to data.json
- **Reusable**: Used by all routes

### **Block 5: GET All Events (Lines 39-42)**
```javascript
app.get('/api/events', (req, res) => {
  const data = readData();
  res.json(data.events);
});
```
- **Route**: GET /api/events
- **Purpose**: Returns all events
- **Response**: JSON array of events

### **Block 6: POST Create Event (Lines 45-64)**
```javascript
app.post('/api/events', (req, res) => {
  const { name, date, desc } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Event name is required' });
  }
  
  const data = readData();
  const newEvent = {
    id: Date.now(),
    name: name.trim(),
    date: date || '',
    desc: desc || ''
  };
  
  data.events.push(newEvent);
  writeData(data);
  res.status(201).json(newEvent);
});
```
- **Route**: POST /api/events
- **Validation**: Requires event name
- **ID generation**: Uses timestamp
- **Saves**: Writes to data.json
- **Response**: Returns created event (201 status)

### **Block 7: GET Single Event (Lines 67-76)**
```javascript
app.get('/api/events/:id', (req, res) => {
  const data = readData();
  const event = data.events.find(e => e.id == req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  res.json(event);
});
```
- **Route**: GET /api/events/:id
- **Purpose**: Returns single event by ID
- **Error**: 404 if not found

### **Block 8: DELETE Event (Lines 79-93)**
```javascript
app.delete('/api/events/:id', (req, res) => {
  const data = readData();
  const eventIndex = data.events.findIndex(e => e.id == req.params.id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  data.teams = data.teams.filter(t => t.eventId != req.params.id);
  data.events.splice(eventIndex, 1);
  writeData(data);
  
  res.json({ message: 'Event deleted successfully' });
});
```
- **Route**: DELETE /api/events/:id
- **Cascading**: Also deletes associated teams
- **Saves**: Updates data.json

### **Block 9: GET All Teams (Lines 98-101)**
```javascript
app.get('/api/teams', (req, res) => {
  const data = readData();
  res.json(data.teams);
});
```
- **Route**: GET /api/teams
- **Purpose**: Returns all teams

### **Block 10: POST Create Team (Lines 104-131)**
```javascript
app.post('/api/teams', (req, res) => {
  const { eventId, name, req: requirements } = req.body;
  
  if (!eventId || !name || !name.trim()) {
    return res.status(400).json({ error: 'Event ID and team name are required' });
  }
  
  const data = readData();
  const event = data.events.find(e => e.id == eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const newTeam = {
    id: Date.now(),
    eventId: parseInt(eventId),
    name: name.trim(),
    req: requirements || '',
    members: []
  };
  
  data.teams.push(newTeam);
  writeData(data);
  res.status(201).json(newTeam);
});
```
- **Route**: POST /api/teams
- **Validation**: Requires eventId and name
- **Verification**: Checks if event exists
- **Initialization**: Empty members array

### **Block 11: POST Join Team (Lines 146-170)**
```javascript
app.post('/api/teams/:id/join', (req, res) => {
  const { name } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const data = readData();
  const team = data.teams.find(t => t.id == req.params.id);
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  const trimmedName = name.trim();
  if (team.members.includes(trimmedName)) {
    return res.status(400).json({ error: 'You already joined this team' });
  }
  
  team.members.push(trimmedName);
  writeData(data);
  res.json(team);
});
```
- **Route**: POST /api/teams/:id/join
- **Validation**: Requires name, checks duplicates
- **Update**: Adds member to team
- **Response**: Returns updated team

### **Block 12: DELETE Team (Lines 173-185)**
```javascript
app.delete('/api/teams/:id', (req, res) => {
  const data = readData();
  const teamIndex = data.teams.findIndex(t => t.id == req.params.id);
  
  if (teamIndex === -1) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  data.teams.splice(teamIndex, 1);
  writeData(data);
  res.json({ message: 'Team deleted successfully' });
});
```
- **Route**: DELETE /api/teams/:id
- **Purpose**: Removes team

### **Block 13: Search Teams (Lines 188-202)**
```javascript
app.get('/api/teams/search/:keyword', (req, res) => {
  const keyword = req.params.keyword.toLowerCase();
  const data = readData();
  
  const filtered = data.teams.filter(team => {
    const event = data.events.find(e => e.id == team.eventId);
    return (
      team.name.toLowerCase().includes(keyword) ||
      team.req.toLowerCase().includes(keyword) ||
      (event && event.name.toLowerCase().includes(keyword))
    );
  });
  
  res.json(filtered);
});
```
- **Route**: GET /api/teams/search/:keyword
- **Search**: Matches team name, requirements, or event name
- **Case-insensitive**: Converts to lowercase
- **Response**: Array of matching teams

### **Block 14: Start Server (Lines 205-208)**
```javascript
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📁 Data file: ${DATA_FILE}`);
});
```
- **Purpose**: Starts Express server
- **Port**: Listens on specified PORT
- **Logging**: Shows server URL and data file location

---

## 5. 📦 package.json - Dependencies

### **Block 1: Project Info (Lines 1-5)**
```json
{
  "name": "collab-link",
  "version": "1.0.0",
  "description": "Team collaboration platform backend",
  "main": "server.js"
}
```
- **name**: Project name
- **version**: Version number
- **main**: Entry point file

### **Block 2: Scripts (Lines 6-9)**
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
- **start**: Production command (`npm start`)
- **dev**: Development with auto-reload (`npm run dev`)

### **Block 3: Dependencies (Lines 17-21)**
```json
"dependencies": {
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2"
}
```
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **body-parser**: Request body parsing

### **Block 4: Dev Dependencies (Lines 22-24)**
```json
"devDependencies": {
  "nodemon": "^3.0.1"
}
```
- **nodemon**: Auto-restarts server on file changes (dev only)

---

## 6. 📊 data.json - Data Storage

### **Structure**
```json
{
  "events": [
    {
      "id": 1234567890,
      "name": "Hackathon 2024",
      "date": "2024-12-15",
      "desc": "Annual coding competition"
    }
  ],
  "teams": [
    {
      "id": 1234567891,
      "eventId": 1234567890,
      "name": "Team Alpha",
      "req": "Need 2 developers",
      "members": ["John", "Jane"]
    }
  ]
}
```
- **Purpose**: Persistent storage for events and teams
- **Format**: JSON array structure
- **Auto-created**: Generated when server starts
- **Location**: Project root directory

---

## 🔄 Data Flow

1. **User Action** → Frontend (script.js)
2. **API Call** → Backend (server.js)
3. **Data Read/Write** → data.json
4. **Response** → Backend → Frontend
5. **UI Update** → DOM manipulation

---

## 🎯 Key Concepts

### **Frontend-Backend Communication**
- Frontend makes HTTP requests to backend API
- Backend processes requests and returns JSON
- Frontend updates UI based on responses

### **State Management**
- Frontend: Arrays (events, teams) cached in memory
- Backend: data.json file as persistent storage
- Synchronization: Frontend reloads data after mutations

### **Error Handling**
- Try-catch blocks in async functions
- User-friendly error notifications
- Fallback mechanisms (client-side filtering)

### **Responsive Design**
- Mobile-first approach
- Media queries for different screen sizes
- Flexible layouts

---

## 🚀 How It All Works Together

1. **Page Load**: `init()` loads events and teams
2. **Create Event**: User fills form → `addEvent()` → API POST → Server saves → UI updates
3. **Create Team**: User selects event → `addTeam()` → API POST → Server saves → UI updates
4. **Join Team**: User clicks join → `joinTeam()` → API POST → Server updates → UI refreshes
5. **Search**: User types → `filterTeams()` → API GET → Server filters → UI shows results

---

This completes the comprehensive explanation of all code blocks in the Collab Link project! 🎉

