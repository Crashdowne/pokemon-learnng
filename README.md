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

## Deployment to Cloudflare Workers

### Prerequisites
- Cloudflare account (free tier works)
- GitHub repository
- `package-lock.json` checked in for deterministic installs

### Steps (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Create a new Worker and connect it to GitHub
4. Select your repository
5. Use these build settings:

```text
Build command: npm run build
Assets directory: dist
Main entrypoint: src/index.js
Node version: current LTS
```

6. Click "Save and Deploy"

Cloudflare Workers will install dependencies from `package-lock.json`, run `npm run build`, and publish the generated `dist/` folder through the Worker asset binding.

If you see an error mentioning `main = "src/index.ts"`, your Cloudflare config is still pointing at a different Worker entrypoint. This repo now uses `src/index.js`.

### Wrangler / CLI Option

If you prefer the CLI, you can deploy the Worker directly:

```bash
npm run build
npm run deploy
```

### Recommended Worker Settings

- Build command: `npm run build`
- Assets directory: `dist`
- Main entrypoint: `src/index.js`
- Node version: current LTS

Cloudflare Workers will automatically redeploy whenever you push to `main`.

### What Gets Deployed

- Static HTML, CSS, and JavaScript files
- All data is stored in localStorage (no backend required)
- Custom flashcards and progress persist in the browser
- The Worker serves the built files from `dist/`

## Features

- Spaced repetition queue with mastery at three consecutive correct answers
- Built-in deck of mono and dual type defenders (3,078 cards)
- Custom card form with validation
- Progress tracking and reset button
- Fully responsive design
- No backend or build step required
