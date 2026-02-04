# Story Spark

A magical web application that helps children (under 8) create their own illustrated storybooks through a fun, guided question flow.

## Features

- **Child-Friendly Interface**: Large touch targets, visual-first interactions, encouraging feedback
- **Guided Story Creation**: Step-by-step questions to build a complete story spec
- **AI Story Generation**: Uses Claude API to create age-appropriate stories with proper structure
- **AI Image Generation**: Uses Puter.js (free, no API key) for client-side illustration generation
- **Interactive Storybook Viewer**: Page-turning interface with read-aloud support
- **PDF Export**: Download a printable storybook

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI Story Generation**: Anthropic Claude API
- **AI Image Generation**: Puter.js (client-side, free)
- **PDF Export**: @react-pdf/renderer
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd story-spark
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables:
```bash
cd ../server
cp ../.env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Running the App

1. Start the server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```

3. Open http://localhost:3000 in your browser

## How It Works

### Story Creation Flow

1. **Character Selection**: Choose or describe a main character
2. **Character Details**: Name and personality traits
3. **Sidekick (Optional)**: Add a friend to the adventure
4. **Setting**: Pick where and when the story takes place
5. **Theme & Conflict**: What kind of adventure with what challenge
6. **Art Style**: Visual style for illustrations
7. **Story Length**: 5, 8, or 12 pages

### Generation Process

1. **Character Design Spec**: Claude creates a detailed visual description for character consistency
2. **Story Outline**: Claude generates a structured outline with scene summaries
3. **Full Text**: Claude writes the complete story with age-appropriate language
4. **Image Generation**: Puter.js generates illustrations page-by-page

### Image Generation Notes

- Puter.js runs entirely client-side with no API key required
- Uses a "User-Pays" model - users may see a one-time Puter sign-in prompt
- Model fallback chain ensures reliability: DALL-E 3 → GPT Image → Stable Diffusion → FLUX
- Images are generated sequentially to avoid overwhelming the service

## Project Structure

```
story-spark/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuestionFlow/     # All question screens
│   │   │   ├── StoryViewer/      # Storybook viewer components
│   │   │   ├── Generation/       # Loading and approval screens
│   │   │   ├── Layout/           # Progress tracker, parent panel
│   │   │   └── common/           # Reusable UI components
│   │   ├── context/              # Zustand store
│   │   ├── hooks/                # Story and image generation hooks
│   │   ├── services/             # PDF export
│   │   └── App.jsx
│   └── index.html
└── server/
    ├── routes/                   # API routes
    ├── services/                 # Claude API integration
    ├── prompts/                  # Story generation prompts
    └── validation/               # Story validation logic
```

## Environment Variables

```env
# Server only
ANTHROPIC_API_KEY=your_key_here
PORT=3001
```

Note: Image generation requires no environment variables - Puter.js handles everything client-side.

## License

MIT
