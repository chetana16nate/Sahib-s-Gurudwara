# Sahib's Gurudwara API

Express and MongoDB API for the public website and its administrator content tools.

## Setup

1. Install [Node.js](https://nodejs.org/) (v20 or newer) and start a MongoDB instance locally, or create a MongoDB Atlas database.
2. In this `backend` directory, copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.
3. Install packages with `npm install`.
4. Create the first administrator with `npm run seed:admin`.
5. Start the API with `npm run dev`. It runs on `http://localhost:5000` by default.

## Endpoints

All responses are JSON and the API base is `/api`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | API status |
| POST | `/auth/login` | Admin login; returns a JWT |
| GET | `/auth/me` | Current admin |
| GET | `/content/:type` | Published `event`, `service`, `class`, or `gallery` items |
| POST | `/content/:type` | Create content (admin) |
| PATCH / DELETE | `/content/:id` | Update/delete content (admin) |
| GET | `/content/admin/:type` | All content, including drafts (admin) |
| POST | `/contact` | Submit a contact form |
| GET / PATCH | `/contact` and `/contact/:id` | Review/change contact-message status (admin) |
| POST | `/donations` | Record a donation intent |
| GET / PATCH | `/donations` and `/donations/:id` | Review/change donation status (admin) |

Protected endpoints require `Authorization: Bearer <token>`.

## Frontend connection

Use `http://localhost:5000/api` as the frontend API base URL. For example, the contact form should send a JSON `POST` request to `/api/contact` with `name`, `email`, and `message`.

## Important payment note

The donation endpoint records an intent only; it does **not** process payments. Connect a payment provider such as Paystack, Flutterwave, or Stripe before accepting real card or mobile-money payments. Verify provider webhooks server-side before marking donations as `received`.
