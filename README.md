# Diwali Digital Diya

A festive, responsive Diwali greeting experience built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion.

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run `npm run lint` and `npm run build` to validate the app and create a production build.

## Features

- Personalized greeting cards, shareable greeting and secret-letter links, and QR greetings.
- Interactive diya garden, click-to-burst fireworks, rangoli creator, floating wishes, and card studio.
- Playable Demon Slayer: Festival of Light arcade game at `/game`, with touch controls, power-ups, shareable scorecards, and a local leaderboard.
- Illustrated Diwali storybook at `/journey`; greeting and letter links open at `/greet` and `/letter`.
- English, Hindi, and Bengali interface options, with reduced-motion support.

## Sharing and saved data

Greeting, QR, and letter links contain their message details in the URL, so they can be opened on another device. QR codes use the current site origin; deploy the site to a public URL before sharing them outside your local network.

Floating wishes are saved only in the visitor's browser with `localStorage`. They are not shared with other visitors; a public wishes wall would require a backend.

Game scores and the leaderboard are also stored in the visitor's browser only. Challenge links carry the shared score in the URL, but a genuinely shared, multi-device leaderboard would require a backend such as Supabase with server-side score validation.
