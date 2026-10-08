# LifeOS — Personal Life Tracker

A comprehensive personal life tracker with a premium dark theme to manage your habits, goals, tasks, journal, mood, sleep, and time.

![LifeOS Dashboard](#) <!-- Screenshot placeholder -->

## Features
- **Habits**: Track boolean, count, timer, and numeric habits. Section support (Morning, Work, Evening, Night).
- **Goals**: Monitor long-term goals with progress tracking and deadlines.
- **Tasks**: Todo list with priorities and due dates.
- **Journal**: Daily journaling with tags and mood integration.
- **Mood Tracking**: Track daily mood, energy levels, and stress (1-5 scale).
- **Sleep Log**: Log sleep times, wake times, and calculate duration and quality.
- **Time Tracking**: Log activities and calculate duration automatically.
- **Analytics**: Visualize your data using Recharts integration.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Recharts
- MongoDB + Mongoose
- Lucide React

## Prerequisites
- Node.js 18+
- MongoDB 6+ (local installation or Atlas)

## Getting Started

### 1. Install MongoDB
- **Windows**: Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community).
- **macOS**: `brew tap mongodb/brew` then `brew install mongodb-community@6.0`
- **Linux**: Follow instructions on MongoDB docs for your specific distro.

### 2. Start MongoDB
```bash
mongod --dbpath /path/to/data
```
*(On Windows, MongoDB typically runs as a background service.)*

### 3. Clone and Install
```bash
git clone https://github.com/yourusername/life-tracker.git
cd life-tracker
npm install
```

### 4. Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Make sure it contains:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/life-tracker
```

### 5. Seed Database (Optional)
Populate your local database with sample data:
```bash
npm run seed
```

### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts
- `npm run dev`: Starts the Next.js development server
- `npm run build`: Builds the application for production
- `npm run start`: Starts the Next.js production server
- `npm run lint`: Runs ESLint
- `npm run seed`: Seeds the MongoDB database with sample data (requires `tsx` installed globally or locally)

## Project Structure
```
/
├── src/
│   ├── app/           # Next.js App Router pages and layouts
│   ├── components/    # React components (including shadcn/ui)
│   ├── lib/           # Utility functions and DB connection
│   ├── models/        # Mongoose database models
│   └── types/         # TypeScript interfaces and definitions
├── scripts/           # Development scripts (e.g., seed.ts)
├── public/            # Static assets
└── package.json       # Project dependencies and scripts
```

## Keyboard Shortcuts
- *Coming soon*

## License
MIT
