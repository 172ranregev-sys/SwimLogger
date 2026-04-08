# SwimLogger Backend

Express.js REST API with local JSON file storage.

## Setup

'''bash
npm install
npm run dev   # development (nodemon)
npm start     # production
'''

Server runs on **http://localhost:3000**

---

## API Reference

### Sessions

| Method | Endpoint | Description |
|--------|--------|--------|
| GET | `/api/sessions` | List all sessions (supports filters) |
| GET | `/api/sessions/stats` | Progress overview & statistics |
| GET | `/api/sessions/:id` | Get single session |
| POST | `/api/sessions` | Create new session |
| PUT | `/api/sessions/:id` | Update session |
| DELETE | `/api/sessions/:id` | Delete session |

#### GET /api/sessions - Query Filters

| Param | Type | Description |
|-------|------|-------------|
| `dateFrom` | YYYY-MM-DD | Sessions on or after this date |
| `dateTo` | YYYY-MM-DD | Sessions on or before this date |
| `minDistance` | number | Minimum total distance (metres) |
| `minDifficulty` | 1–10 | Minimum difficulty rating |
| `maxDifficulty` | 1–10 | Maximum difficulty rating |
| `minEffort` | 1–10 | Minimum effort rating |
| `maxEffort` | 1–10 | Maximum effort rating |

Example: `GET /api/sessions?dateFrom=2025-01-01&minDistance=3000`

Results are always sorted newest first.

#### GET /api/sessions/stats - Query Params

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `dateFrom` | YYYY-MM-DD | Start of current month | Range start |
| `dateTo` | YYYY-MM-DD | Today | Range end |

Response shape:
```json
{
  "range": { "dateFrom": "...", "dateTo": "..." },
  "kpis": {
    "totalDistance": 24500,
    "sessionsThisWeek": 3,
    "avgEffortRating": 7.4,
    "avgPreparationRating": 8.1
  },
  "charts": {
    "weeklyDistance": [
      { "weekStart": "2025-01-06", "weekEnd": "2025-01-12", "totalDistance": 6000 }
    ],
    "effortTrend": [
      { "id": "...", "date": "2025-01-07", "effortRating": 7 }
    ]
  }
}
```

#### POST /api/sessions - Request Body

```json
{
  "date": "2025-06-15",
  "warmup": "400m easy freestyle",
  "mainSet": "8x100m on 1:45",
  "recovery": "200m easy",
  "totalDistance": 3200,
  "difficultyRating": 7,
  "effortRating": 8,
  "preparationRating": 9,
  "notes": "Felt strong today.",
  "userIds": ["user-uuid-1"]
}
```

Required: `date`, `totalDistance`, `difficultyRating`, `effortRating`, `preparationRating`

---

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get single user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

#### POST /api/users - Request Body

```json
{
  "name": "Jan Novák",
  "role": "Swimmer"
}
```

`role` must be `"Swimmer"` or `"Coach"`.

---

## Data Files

Stored in `./data/`:
- `sessions.json` — all training sessions
- `users.json` — all users
