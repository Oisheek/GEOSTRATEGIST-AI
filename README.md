# GeoStrategist AI v1.1.0

> AI-Powered Geopolitical Intelligence, Conflict Monitoring, and Strategic Risk Analysis Platform

**Live Application:** https://geo-strategist-ai-wfkw.vercel.app/

---

## Overview

GeoStrategist AI is a full-stack geopolitical intelligence platform designed to monitor global events, discover emerging conflicts, assess regional risks, and generate AI-powered strategic intelligence.

The platform aggregates geopolitical news from multiple sources, processes intelligence through AI-driven analysis pipelines, and presents actionable insights through an interactive dashboard, global map, conflict tracker, and analyst chat interface.

Built for researchers, analysts, policymakers, students, and organizations requiring real-time geopolitical awareness.

---

# What's New in v1.1.0

### Intelligence Pipeline Optimization

The platform has been redesigned to use a centralized intelligence pipeline.

### Previous Architecture

```text
Region → Fetch News → AI Analysis
Region → Fetch News → AI Analysis
Region → Fetch News → AI Analysis

Conflict → Fetch News → Analysis
Conflict → Fetch News → Analysis
```

Problems:

- Excessive API requests
- Increased OpenRouter usage
- Higher latency
- Frequent rate-limit issues
- Duplicate intelligence processing

---

### Current Architecture

```text
News Sources
      │
      ▼
 Single News Collection
      │
      ▼
 Unified Intelligence Dataset
      │
      ├── Regional Risk Engine
      ├── Conflict Discovery Engine
      ├── Conflict Assessment Engine
      ├── AI Assessment Generator
      └── Dashboard Analytics
```

Benefits:

- Single-fetch architecture
- Significantly reduced API usage
- Lower operational cost
- Faster intelligence updates
- Better scalability
- Reduced rate-limit issues
- Consistent intelligence across all modules

---

## Core Features

### Global Intelligence Dashboard

- Real-time geopolitical monitoring
- Global intelligence overview
- Threat-level visualization
- Regional intelligence metrics
- Active conflict tracking

### Regional Risk Analysis

- AI-generated regional assessments
- Dynamic geopolitical risk scoring
- Threat classification system
- Intelligence summaries
- Strategic outlook generation

### Conflict Monitoring

- Active conflict database
- Conflict discovery engine
- Escalation monitoring
- Strategic conflict assessments
- Global hotspot tracking

### News Intelligence

- Multi-source news aggregation
- Geopolitical relevance filtering
- Regional news classification
- Automated intelligence updates

### Interactive World Map

- Global conflict visualization
- Regional intelligence overlays
- Risk heat mapping
- Interactive exploration

### AI Intelligence Layer

- Strategic intelligence generation
- Regional assessments
- Risk evaluation
- Forecasting support
- Geopolitical analysis assistance

### Analyst Chat

- AI-powered geopolitical assistant
- Context-aware intelligence support
- Secure authenticated access
- Real-time analysis capabilities

### Authentication & Security

- JWT Authentication
- Google Sign-In
- Protected Routes
- Secure Session Management

---

# Technology Stack

## Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Zustand
- Framer Motion
- Axios
- Recharts
- Leaflet
- React Leaflet
- Lucide React

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Google Auth Library
- Socket.IO
- Node Cron
- Zod
- CORS
- Cookie Parser

---

## AI Layer

### OpenRouter Integration

Used for:

- Regional Assessments
- Conflict Analysis
- Strategic Intelligence Reports
- Risk Analysis
- Analyst Chat Responses

---

# Project Structure

```text
GEOSTRATEGIST-AI
│
├── backend
│   ├── src
│   │
│   ├── ai
│   │   ├── agents
│   │   └── services
│   │
│   ├── config
│   ├── controllers
│   ├── jobs
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seeds
│   ├── services
│   ├── sockets
│   ├── utils
│   ├── validators
│   │
│   ├── app.js
│   └── server.js
│
├── frontend
│   ├── src
│   │
│   ├── components
│   ├── constants
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── services
│   ├── store
│   ├── styles
│   ├── utils
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# Application Modules

## Dashboard

Provides a high-level overview of:

- Global risk landscape
- Active conflicts
- Regional intelligence
- Threat assessments
- Key geopolitical developments

---

## Regions

Tracks intelligence for major world regions:

- North America
- South America
- Europe
- Middle East
- Africa
- South Asia
- East Asia
- Southeast Asia
- Oceania

Each region includes:

- Risk Score
- Threat Level
- Intelligence Summary
- Forecasting Data
- AI Assessment

---

## Conflicts

Tracks:

- Active conflicts
- Emerging tensions
- Strategic hotspots
- Escalation indicators

---

## News

Aggregates geopolitical intelligence from multiple news sources and distributes intelligence across all analysis modules.

---

## Chat

Authenticated AI analyst assistant capable of answering geopolitical and strategic intelligence questions.

---

# Intelligence Pipeline

The backend runs automated intelligence workflows.

## News Collection

Collects and normalizes geopolitical news.

## Risk Assessment

Generates regional risk scores.

## Conflict Discovery

Identifies emerging conflicts and tensions.

## Assessment Generation

Produces AI-generated regional intelligence reports.

## Data Maintenance

Performs automated cleanup and optimization.

---

# Environment Variables

## Backend

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

OPENROUTER_API_KEY=

WORLDNEWS_API_KEY=

HEADLINEFEED_API_KEY=

GOOGLE_CLIENT_ID=
```

---

## Frontend

```env
VITE_API_URL=http://localhost:5000/api

VITE_GOOGLE_CLIENT_ID=
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<username>/GEOSTRATEGIST-AI.git

cd GEOSTRATEGIST-AI
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend will start on:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will start on:

```text
http://localhost:5173
```

---

# Available Scripts

## Backend

```bash
npm run dev
npm start
npm run seed:regions
```

## Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

# Deployment

## Frontend

Deployed on Vercel:

https://geo-strategist-ai-wfkw.vercel.app/

---

# Use Cases

- Geopolitical Research
- Strategic Analysis
- Academic Research
- International Relations Studies
- Risk Intelligence
- Conflict Monitoring
- Policy Research
- Security Analysis

---

## License

Copyright © 2026 Oisheek Chattopadhyay      Debjit Ghosh Amish      Kumar Jha

All Rights Reserved.

This project is provided for portfolio and demonstration purposes only.
No part of this software may be copied, modified, distributed, or used
without explicit permission from the author.

---

## Author

**Oisheek Chattopadhyay**      **Debjit Ghosh**      **Amish Kumar Jha**

GeoStrategist AI was developed as a modern geopolitical intelligence platform focused on real-time conflict monitoring, strategic risk assessment, and AI-powered geopolitical analysis.
