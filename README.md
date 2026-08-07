# ♻️ RecycleHub

A full-stack web marketplace for buying and selling recyclable materials. Users can list recyclable products, browse and search listings, and **chat with sellers in-app to negotiate prices** — all in one place.

> Recycle Today For A Better Tomorrow.

---

## ✨ Features

- **User authentication** — register & login with JWT-based sessions (passwords hashed with bcrypt).
- **Product listings** — add recyclable items with name, category, price, quantity, location, description, and an image.
- **Image upload** — images are stored directly in the database as base64, so they survive redeploys on ephemeral-filesystem hosts (e.g. Render).
- **Browse & search** — public product grid with live client-side search by name, location, or category.
- **In-app chat / bargaining** — buyers contact sellers through a built-in chat thread (per product). The seller's listed price is shown in the chat header so both sides can negotiate. Messages auto-refresh via polling.
- **Inbox** — each user sees all their conversations grouped by product and counterparty.
- **Ownership guards** — you can't message yourself, and you can only delete your own listings.
- **Contact form** — general contact messages saved to the database.
- Responsive UI with a consistent green/navy theme.

---

## 🛠 Tech Stack

| Layer | Technology |
|-----------|--------------------------------------------|
| Frontend | HTML, CSS, vanilla JavaScript (no framework) |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (`pg`) |
| Auth | JSON Web Tokens (`jsonwebtoken`), `bcrypt` |
| Uploads | `multer` (memory storage → base64 in DB) |
| Config | `dotenv` |

---

## 📁 Project Structure

```
RecycleHub/
├── backend/
│   ├── config/db.js              # PostgreSQL pool (DATABASE_URL or local DB_* vars)
│   ├── controllers/              # auth, user, product, message, contact logic
│   ├── database/
│   │   ├── init.js               # auto-creates/migrates tables on startup
│   │   └── schema.sql            # reference schema (destructive rebuild)
│   ├── middleware/               # authMiddleware (JWT), upload (multer)
│   ├── routes/                   # auth, users, products, messages, contact
│   └── server.js                 # Express app entry point
└── frontend/
    ├── *.html                    # pages (index, products, product-details, messages, ...)
    ├── css/                      # per-page stylesheets
    └── js/                       # api.js helper + per-page scripts
```

The backend also serves the frontend as static files, so the whole app runs from a single Express server.

---

## 🚀 Getting Started (Local)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) running locally

### 1. Clone & install

```bash
git clone https://github.com/Sifaaat/RecycleHub.git
cd RecycleHub/backend
npm install
```

### 2. Create the database

```bash
createdb recyclehub
```

> Tables are created automatically on server startup (see `database/init.js`), so no manual SQL is required.

### 3. Configure environment variables

Create `backend/.env`:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=recyclehub

JWT_SECRET=change_me_to_a_long_random_string
```

### 4. Run

```bash
npm start        # or: npm run dev  (nodemon)
```

Open **http://localhost:5000** in your browser.

---

## 🔌 API Reference

Base URL: `/api`

### Auth
| Method | Endpoint | Auth | Description |
|--------|--------------------|------|--------------------|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Login, returns JWT |

### Users
| Method | Endpoint | Auth | Description |
|--------|-------------------|------|-------------------|
| GET | `/users/profile` | ✅ | Current user profile |

### Products
| Method | Endpoint | Auth | Description |
|--------|-------------------------|------|--------------------------------------|
| GET | `/products` | — | List products (`?search=` & `?category=`) |
| GET | `/products/:id` | — | Single product (with seller info) |
| GET | `/products/user/mine` | ✅ | My products |
| POST | `/products` | ✅ | Create product (multipart, field `image`) |
| DELETE | `/products/:id` | ✅ | Delete own product |

### Messages (in-app chat)
| Method | Endpoint | Auth | Description |
|--------|--------------------------------|------|-----------------------------------------------|
| POST | `/messages` | ✅ | Send `{ product_id, receiver_id, content }` |
| GET | `/messages/thread` | ✅ | Thread between me and a user (`?product=&with=`) |
| GET | `/messages/conversations` | ✅ | Inbox: latest message per conversation |

### Contact
| Method | Endpoint | Auth | Description |
|--------|-------------|------|------------------------|
| POST | `/contact` | — | Save a contact message |

Protected routes require an `Authorization: Bearer <token>` header.

---

## 🗄 Database Schema

- **users** — `id, full_name, email, phone, password, role, created_at`
- **products** — `id, user_id, name, category, price, quantity, location, description, image (base64), status, created_at`
- **messages** — `id, product_id, sender_id, receiver_id, content, created_at`
- **contact_messages** — `id, name, email, subject, message, created_at`

A "conversation" is defined by a `product_id` plus the pair of users talking about it.

---

## ☁️ Deployment (Render)

1. Push the repo to GitHub.
2. Create a **PostgreSQL** instance on Render and copy its **Internal Database URL**.
3. Create a **Web Service** from the repo:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** `DATABASE_URL` (the Render DB URL) and `JWT_SECRET`.
4. On startup the app auto-creates/migrates its tables — no shell access needed.

`config/db.js` automatically uses `DATABASE_URL` (with SSL) when present, and falls back to the local `DB_*` variables otherwise.

> **Note on images:** New images are stored in the database as base64, so they persist across redeploys. Any products created before this behavior (whose images lived on the ephemeral disk) will need to be re-uploaded.

---

## 📜 License

MIT © Sifat
