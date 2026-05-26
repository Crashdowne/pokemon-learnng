# Pokemon Type Flashcards

A single-page flashcard trainer for Pokemon type matchups. Answer the multiplier for each attacking type against defending types and master the full chart.

## Local Development

### Run Locally

```bash
npm run dev
```
Then open `http://localhost:8000` in your browser.

Alternatively, use any local HTTP server (Python, Node, VS Code Live Server, etc.).

## Production Build

Build the optimized static site into `dist/`:

```bash
npm run build
```

This bundles and minifies `app.js`, then copies `index.html` and `styles.css` into `dist/`.

## Deployment to Cloudflare Pages

### Prerequisites
- Cloudflare account (free tier works)
- GitHub repository

### Steps (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Framework: **None** (this is a static site)
6. Build command: `npm run build`
7. Build output directory: `dist`
8. Click "Save and Deploy"

### Wrangler / CLI Option

If you prefer the CLI, you can deploy the built `dist/` folder with Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy dist --project-name pokemon-flashcards
```

### Recommended Pages Settings

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root
- Node version: current LTS

Cloudflare Pages will automatically redeploy whenever you push to `main`.

### What Gets Deployed

- Static HTML, CSS, and JavaScript files
- All data is stored in localStorage (no backend required)
- Custom flashcards and progress persist in the browser

## Features

- Spaced repetition queue with mastery at three consecutive correct answers
- Built-in deck of mono and dual type defenders (3,078 cards)
- Custom card form with validation
- Progress tracking and reset button
- Fully responsive design
- No backend or build step required
