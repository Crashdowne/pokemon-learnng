# Pokemon Type Flashcards

A single-page flashcard trainer for Pokemon type matchups. Answer the multiplier for each attacking type against defending types and master the full chart.

## Local Development

### Run Locally

```bash
npm run dev
```
Then open `http://localhost:8000` in your browser.

Alternatively, use any local HTTP server (Python, Node, VS Code Live Server, etc.).

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
6. Build command: leave blank
7. Build output directory: leave blank
8. Click "Save and Deploy"

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
