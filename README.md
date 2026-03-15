# Donate & Feedback API

A simple backend that sends **donations** and **player feedback** to your Discord server via webhooks. All messages are in **English** by default and can be customized without touching the main code.

**Stack:** Node.js, Express, TypeScript. No database.

---

## What it does

| Feature | Description |
|--------|-------------|
| **Donate** | Your game sends a POST with amount and optional message → Discord gets a nice embed. |
| **Feedback** | Your game sends a POST with rating (1–5) and optional message → Discord gets a feedback embed. |
| **Security** | Every request must include your secret API key in the `X-API-Key` header. |

---

## Setup (step by step)

### 1. Clone and install

```bash
git clone https://github.com/yourusername/namtar-2-backend.git
cd namtar-2-backend
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | What to put |
|----------|-------------|
| `PORT` | Port for the server (e.g. `3000`). |
| `SECRET_API_KEY` | A long random secret. Your game/client must send this in the `X-API-Key` header. |
| `DISCORD_WEBHOOK_DONATE` | Discord webhook URL for the **donations** channel. |
| `DISCORD_WEBHOOK_FEEDBACK` | Discord webhook URL for the **feedback** channel. |

**Getting Discord webhooks:**  
Server → Channel → Edit Channel → Integrations → Webhooks → New Webhook. Copy the “Webhook URL”.

### 3. Run the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm run build
npm start
```

Open `http://localhost:3000` in a browser. You should see: `API is running 🚀`.

---

## Customizing Discord messages

All Discord embed text (titles, labels, default text) is in one file so you can change it without editing the API logic.

**File:** `src/config/discord-messages.ts`

You can change:

- **Titles** – e.g. `"Thank you for your donation!"`
- **Descriptions** – use `{{username}}`, `{{amount}}`, or `{{rating}}` and they will be replaced.
- **Field labels** – “Player”, “Amount”, “Map”, “Message”, “Rating”, “Feedback”.
- **Default text** when the user leaves message/map empty – e.g. `"No message"`, `"Unknown"`.
- **Rating labels** for 1–5 (e.g. “1/5 – Poor” … “5/5 – Great!”).
- **Colors** – embed accent color (numeric Discord color).

Example: to show a different thank-you line for donations, edit `discordMessages.donate.description`:

```ts
description: "Thanks for your support, {{username}}!",
// change to e.g.:
description: "We received a donation from {{username}}. Thank you!",
```

After editing, run `npm run build` and restart the server (or use `npm run dev` so it restarts automatically).

---

## API reference

Base URL: your server (e.g. `https://your-app.onrender.com`).

**Required header for all requests:**

```
X-API-Key: your_secret_api_key
```

### POST `/api/donate`

Sends a donation notification to your Discord donate webhook.

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | number | Yes | e.g. Roblox user ID. |
| `username` | string | No | Display name. Default: `User_<userId>`. |
| `amount` | number | Yes | Donation amount (e.g. Robux). |
| `message` | string | No | Optional message from the player. |
| `mapName` | string | No | Current map/location. |

**Example:**

```json
{
  "userId": 123456789,
  "username": "CoolPlayer",
  "amount": 100,
  "message": "Great game!",
  "mapName": "Main Map"
}
```

### POST `/api/feedback`

Sends a feedback notification to your Discord feedback webhook.

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | number | Yes | e.g. Roblox user ID. |
| `username` | string | No | Display name. Default: `User_<userId>`. |
| `rating` | number | Yes | 1–5. |
| `message` | string | No | Feedback text (max 1000 characters). |
| `mapName` | string | No | Current map/location. |

**Example:**

```json
{
  "userId": 123456789,
  "username": "CoolPlayer",
  "rating": 5,
  "message": "Really fun!",
  "mapName": "Main Map"
}
```

---

## Using this in your own project

1. **Fork** the repo (or clone and push to your own).
2. Set **environment variables** (see above).
3. Optionally edit **`src/config/discord-messages.ts`** for your language or branding.
4. Deploy to **Render**, **Railway**, **Fly.io**, or any Node host:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
5. In your game/client, send POSTs to `/api/donate` and `/api/feedback` with the header `X-API-Key: your_secret_api_key`.

---

## Project structure

```
src/
├── config/
│   └── discord-messages.ts   ← Edit this to change Discord text
├── controllers/
│   └── general.controller.ts
├── middleware/
│   └── auth.middleware.ts
├── routes/
│   └── api.routes.ts
└── index.ts
```

---

## License

ISC
