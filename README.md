# 🔗 URL Shortener

A full-stack URL shortener with a **Node.js/Express + SQLite** backend and a **React (Vite + Tailwind CSS)** frontend. Shorten long URLs, use custom aliases, set expiry dates, and track real-time click analytics.

## ✨ Features

- **Shorten URLs** — instantly generate compact short codes (Base62)
- **Custom aliases** — optional user-defined short codes (3–20 alphanumeric chars)
- **Link expiration** — optional expiry date per link
- **Click analytics** — total clicks, referrers, user agents, and recent click activity
- **Rate limiting** — 100 requests / 15 min per IP
- **Input validation** — strict URL validation with the `validator` library

## 🏗️ Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Backend  | Node.js, Express, SQLite (sqlite3)      |
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Testing  | Jest + Supertest                        |
| DevOps   | Docker + docker-compose, nginx          |

## 📁 Project Structure

```
URL-Shortner/
├── backend/
│   ├── server.js               # Express entry point
│   ├── config/database.js      # SQLite connection + schema
│   ├── controllers/            # Request handlers
│   ├── routes/                 # API + redirect routes
│   ├── models/                 # DB queries
│   ├── services/               # Short-code generation
│   ├── middleware/             # URL validation
│   ├── tests/                  # Jest + Supertest suite
│   └── .env                    # Backend environment config
├── frontend/
│   ├── src/
│   │   ├── pages/              # Home, Analytics, RedirectHandler
│   │   ├── components/         # Header, UrlForm, ResultCard, Analytics/*
│   │   ├── hooks/              # useUrlShortener, useCopyToClipboard
│   │   ├── services/           # API client (urlApi.js)
│   │   └── utils/              # helpers.js
│   └── .env                    # VITE_API_URL
├── database/urls.db            # SQLite database file
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js ≥ 18
- npm

### 1. Backend

```bash
cd backend
npm install
npm run dev          # starts on http://localhost:5000
```

Backend `.env`:

```
PORT=5000
DB_PATH=../database/urls.db
BASE_URL=http://localhost:5000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
NODE_ENV=development
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev          # starts on http://localhost:5173
```

Frontend `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Tests (Backend)

```bash
cd backend
npm test
```

## 🐳 Running with Docker

```bash
docker-compose up --build
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173 (served by nginx)

## 📡 API Endpoints

| Method   | Endpoint                    | Description                  |
| -------- | --------------------------- | ---------------------------- |
| `POST`   | `/api/shorten`              | Create a short URL           |
| `GET`    | `/api/url/:shortCode`       | Get URL details              |
| `GET`    | `/api/analytics/:shortCode` | Get click analytics          |
| `DELETE` | `/api/url/:shortCode`       | Deactivate a URL             |
| `GET`    | `/:shortCode`               | Redirect to the original URL |

### Example — Create a short URL

```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/some/very/long/path", "customAlias": "my-link", "expiresAt": null}'
```

Response:

```json
{
  "success": true,
  "data": {
    "shortUrl": "http://localhost:5000/my-link",
    "shortCode": "my-link",
    "originalUrl": "https://example.com/some/very/long/path"
  }
}
```

## 🗄️ Database Schema

**urls** — `id`, `original_url`, `short_code` (unique), `created_at`, `expires_at`, `click_count`, `is_active`

**url_clicks** — `id`, `url_id`, `clicked_at`, `ip_address`, `user_agent`, `referrer`

## 🧪 Development Roadmap

- [x] **Phase 1 — MVP**: Express API, SQLite models, shorten + redirect, basic React UI
- [x] **Phase 2 — Enhancements**: analytics tracking, custom aliases, expiry, dashboard UI, rate limiting
- [x] **Phase 2.5 — Design polish**: "Ink & Teal" design system (Space Grotesk display type, ink primary actions, teal accent)
- [x] **Phase 3 — DevOps**: Dockerfiles, docker-compose, nginx config
- [ ] **Phase 4 — Production**: user accounts, QR codes, Swagger docs, CI/CD

## 👤 Author

Ujwal Dahal
