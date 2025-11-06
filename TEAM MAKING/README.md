# Collab Link - Team Collaboration Platform

A beautiful team collaboration platform built with Node.js, Express, and vanilla JavaScript.

## Features

- 🎯 Create and manage events
- 👥 Create team posts for events
- 🔍 Search and filter teams
- ✨ Beautiful glassmorphism UI design
- 🚀 Real-time updates via REST API

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get a single event
- `DELETE /api/events/:id` - Delete an event

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id` - Get a single team
- `POST /api/teams/:id/join` - Join a team
- `DELETE /api/teams/:id` - Delete a team
- `GET /api/teams/search/:keyword` - Search teams

## Data Storage

Data is stored in `data.json` file in the project root. This file is automatically created when the server starts.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: JSON file-based storage

## License

ISC

