# Catch A Star ⭐

A romantic mini-game built for someone special. Stars fall from the sky — catch them to unlock love reasons, and catch enough to reveal a final secret message.

## Features
- Falling catchable stars with wobble animations
- Each star reveals a personalised love reason
- Goal-based win condition with a time limit
- Difficulty ramps up as you catch more stars
- Beautiful win screen with confetti + final message
- Encouraging lose/retry screen
- Fully responsive — works on mobile and desktop

## Tech Stack
- React + Vite
- Tailwind CSS
- Framer Motion
- react-confetti
- Howler.js
- Lucide React

## Installation

```bash
npm create vite@latest catch-a-star -- --template react
cd catch-a-star
npm install
npm install framer-motion react-confetti lucide-react howler
npm install -D tailwindcss @tailwindcss/vite autoprefixer
npm run dev
```

## Customisation
- Edit `src/data/loveReasons.js` — change the love reasons and final message
- Edit `src/constants/gameConfig.js` — change goal, timer, difficulty
- Add `.mp3` files to `/public/sounds/` — `catch.mp3`, `win.mp3`, `lose.mp3`

## Deployment (Vercel)
```bash
npm run build
# push to GitHub, import repo on vercel.com
```