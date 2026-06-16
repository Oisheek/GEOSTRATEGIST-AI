# GeoStrategist AI

An AI-powered geopolitical intelligence platform for conflict monitoring, regional risk analysis, strategic forecasting, and intelligence reporting.

---

## Features

- Global Intelligence Dashboard
- Interactive Intelligence Map
- Regional Risk Assessment
- Conflict Monitoring
- AI Strategic Assistant
- Forecast Engine
- Intelligence Reports
- Google Authentication
- JWT Authentication
- Real-Time Geopolitical Analysis

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Zustand
- React Router
- Leaflet
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT
- Mongoose

### AI Layer
- Owl Alpha
- OSS120B Assessment Engine

---

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Backend:

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

OPENAI_API_KEY=

GOOGLE_CLIENT_ID=
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
```

---

## Project Structure

```

frontend/
src/
components/
pages/
layouts/
routes/
store/
services/
styles/

backend/
src/
controllers/
routes/
models/
services/
middleware/
config/

```

---

## License

MIT License

Copyright (c) 2026 GeoStrategist AI