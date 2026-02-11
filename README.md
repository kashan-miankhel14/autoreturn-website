# AutoReturn

A voice-controlled unified inbox that brings together Gmail and Slack into a single, privacy-focused desktop application. All AI processing happens 100% locally on your hardware—your data never leaves your machine.

## Features

- **Unified Inbox**: Combine Gmail and Slack messages into one streamlined interface
- **Voice Control**: Read, reply, and manage your day using only your voice
- **Privacy by Design**: All AI processing runs locally using Ollama
- **Works Offline**: Access, search, and compose messages without internet
- **Smart Task Detection**: Automatically extracts action items from messages
- **AI Draft Replies**: Context-aware suggestions that match your writing style
- **Cross-Platform**: Available for Linux, Windows, and macOS

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Radix UI components
- Framer Motion (animations)
- Wouter (routing)

### Backend
- Express.js
- Drizzle ORM
- PostgreSQL
- Passport.js (authentication)
- WebSocket support

### Development
- TypeScript
- ESLint
- Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Ollama (for local AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kashan-miankhel14/autoreturn-website.git
cd autoreturn-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/autoreturn
NODE_ENV=development
PORT=5000
```

4. Set up the database:
```bash
npm run db:push
```

## Running the Project

### Development Mode

Run the development server:
```bash
npm run dev
```

This starts the Express server on port 5000 (or the port specified in your `.env` file).

### Development with Vite

For frontend-only development:
```bash
npm run dev:client
```

### Production Build

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run dev:client` | Start Vite dev server for client only |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## Project Structure

```
autoreturn-website/
├── client/          # Frontend React application
│   └── src/
│       ├── components/ui/  # Radix UI components
│       ├── pages/          # Page components
│       ├── hooks/          # Custom React hooks
│       ├── App.tsx         # Main app component
│       └── main.tsx        # Entry point
├── server/          # Backend Express application
│   ├── index.ts     # Main server file
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Database storage
│   ├── static.ts    # Static file serving
│   └── vite.ts      # Vite integration
├── shared/          # Shared code between client and server
├── script/          # Build scripts
└── dist/            # Production build output
```

## Downloading the Desktop App

The desktop application is available for download on the [Get Started](#get-started) section of the website. Choose your platform:

- **Linux**: .AppImage, .deb, .rpm formats
- **Windows**: .exe, .zip formats  
- **macOS**: .dmg (Intel & Apple Silicon)

## License

MIT

## Author

Built by Kashan Saeed

---

*Your data stays yours. Powered by Ollama.*
