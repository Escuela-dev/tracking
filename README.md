# Student & Client Time Tracking API

A Next.js application for tracking student and client hours using Toggl Track integration.

## Features

- 🕒 Hours tracking integration with Toggl Track
- 📊 Client-specific time tracking with custom tags
- 💾 SQLite database for client data storage
- 🔒 Type-safe API endpoints with Zod validation

## Getting Started

### Prerequisites

- Node.js
- Toggl Track account with API access

### Environment Variables

Create a `.env` file with:

```bash
cp .env.example .env.local
```

### Installation

```bash
npm install
```

### Database Setup

Seed the database with initial data:

```bash
npm run seed
```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Create a production build:

```bash
npm run build
```

## API Endpoints

### GET `/api/client/[clientId]`

Retrieves client tracking data including remaining hours and last tracked entry.

#### Parameters

- `clientId` (UUID): The unique identifier for the client

#### Response

```json
{
  "clientId": "uuid",
  "hoursRemaining": 40,
  "lastPaidDate": "2024-01-01T00:00:00.000Z",
  "togglLink": "https://track.toggl.com/timer?tags=client-tag",
  "lastEntryTrackedDate": "2024-01-02T10:00:00.000Z"
}
```

## Testing

Run the test suite:

```bash
npm test
```

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Toggl Track API](https://developers.track.toggl.com/)
- [Vitest](https://vitest.dev/)
- [Zod](https://zod.dev/)
