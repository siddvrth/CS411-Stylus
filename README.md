# Stylus

Return-risk prediction app for clothing purchases. Built for CS 411 (Spring 2026).

## Features

- **Onboarding** — set up a style profile with your fit, brand, and material preferences
- **Capture** — snap a photo or upload an image of a clothing item
- **Item Details** — enter metadata like brand, size, and material
- **Results** — get a keep-or-return prediction with a confidence score
- **Profile** — view and update your style preferences

## Running the app

You need Node.js 18+ and npm.

```bash
git clone https://github.com/siddvrth/CS411-Stylus.git
cd CS411-Stylus
```

Install dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
```

Start everything from the project root:

```bash
npm run dev
```

This boots the frontend (port 8080) and backend (port 3001) together. Open http://localhost:8080.

You can also run them separately:

```bash
npm run dev:frontend
npm run dev:backend
```

