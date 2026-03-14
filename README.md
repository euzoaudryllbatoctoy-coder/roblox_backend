# Donate & Feedback API

A minimal backend API that sends **donate** and **feedback** notifications to Discord webhooks. Protected by a secret API key.

Built with **Node.js**, **Express**, and **TypeScript**.

---

## Features

- **Donate** – POST donations to a Discord channel with rich embeds
- **Feedback** – POST feedback/ratings to a Discord channel
- **Security** – API key authentication via `X-API-Key` header
- **Simple** – No database, no Google services. Just Discord webhooks.

---

## Quick Setup

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `SECRET_API_KEY` | Secret key for API auth. Clients send this in `X-API-Key` header |
| `DISCORD_WEBHOOK_DONATE` | Discord webhook URL for donation notifications |
| `DISCORD_WEBHOOK_FEEDBACK` | Discord webhook URL for feedback notifications |

### 3. Create Discord Webhooks

1. Open your Discord server → Channel Settings → Integrations → Webhooks
2. Create two webhooks (one for donate, one for feedback)
3. Copy each webhook URL into your `.env` file

### 4. Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## API Endpoints

All `/api` routes require the header: **`X-API-Key: your_secret_api_key`**

### POST `/api/donate`

Sends a donation notification to Discord.

**Body:**
```json
{
  "userId": 123456,
  "username": "PlayerName",
  "amount": 100,
  "message": "Thanks for the game!",
  "mapName": "Main Map"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | number | Yes | User ID (e.g. Roblox user ID) |
| username | string | No | Display name (default: `User_{userId}`) |
| amount | number | Yes | Donation amount |
| message | string | No | Optional message |
| mapName | string | No | Current map/location |

---

### POST `/api/feedback`

Sends a feedback notification to Discord.

**Body:**
```json
{
  "userId": 123456,
  "username": "PlayerName",
  "rating": 5,
  "message": "Great game!",
  "mapName": "Main Map"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | number | Yes | User ID |
| username | string | No | Display name (default: `User_{userId}`) |
| rating | number | Yes | Rating 1–5 |
| message | string | No | Feedback text (max 1000 chars) |
| mapName | string | No | Current map/location |

---

## Forking for Your Project

1. **Fork** this repository
2. **Clone** your fork
3. Copy `.env.example` → `.env` and add your keys
4. Customize Discord embed messages in `src/controllers/general.controller.ts` if needed
5. Deploy (Railway, Render, Vercel, etc.)

---

## Tech Stack

- Node.js (v18+)
- Express.js
- TypeScript
- Discord Webhooks

---

## License

ISC
