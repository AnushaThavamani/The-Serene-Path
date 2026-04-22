# 🌿 The Serene Path

> A full-stack mental wellness web application built with the MERN Stack.

---

## Overview

**The Serene Path** is a secure, user-centered wellness platform designed to promote mental well-being through self-reflection, emotional awareness, and curated mindfulness resources. The application prioritizes user privacy with end-to-end encryption on sensitive data.

---

## Features

| Module | Description |
|---|---|
| 🔐 Authentication | Secure user registration and login using JWT-based auth |
| 📔 Journal | Private journaling with AES-256 encryption |
| 📊 Dashboard | Personalized mood and activity analytics with visual charts |
| 🧘 Emotion Regulation | Evidence-based tools and techniques for emotional management |
| 📚 Bibliotherapy | Curated reading recommendations for mental wellness |
| 🎵 Multimedia Sanctuary | Calming audio and visual content for relaxation |
| 💬 Feedback | In-app user feedback and rating system |
| 🛠️ Admin Panel | Administrative control for managing users and content |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js v19, Framer Motion, Recharts, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Security | JWT Authentication, AES-256 Encryption |


The-Serene-Path/
├── public/          # Static assets
├── src/             # React frontend source
│   ├── components/  # Reusable UI components
│   ├── pages/       # Application pages
│   └── App.js       # Root component
├── server/          # Node.js + Express backend
│   ├── routes/      # API routes
│   ├── models/      # MongoDB schemas
│   └── index.js     # Server entry point
├── package.json
└── README.md

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/AnushaThavamani/The-Serene-Path.git
cd The-Serene-Path
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Install backend dependencies**
```bash
cd server
npm install
```

**4. Configure environment variables**

Create a `.env` file inside the `server/` folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_aes_key

**5. Run the application**

Frontend:
```bash
npm start
```

Backend:
```bash
cd server
node index.js
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Security

- All journal entries are encrypted using **AES-256** before storage
- Passwords are hashed and never stored in plain text
- Authentication is handled via **JWT tokens** with expiry

---

## Developer

**Anusha Thavamani**  

> *"Your mental health is a priority. Your happiness is essential. Your self-care is a necessity."*
---

## Project Structure
