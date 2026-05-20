# Pokemon Type Flashcards

A single-page flashcard trainer for Pokemon type matchups. Answer the multiplier for each attacking type against defending types and master the full chart.

## Local Development

### Run Locally

**Option 1: Python HTTP server**
```bash
python3 -m http.server
```
Then open `http://localhost:8000` in your browser.

**Option 2: VS Code Live Server**
Right-click `index.html` → "Open with Live Server".

**Option 3: Cloudflare Pages Dev**
```bash
npm install
npm run dev
```
Then open the provided local URL (usually `http://localhost:8788`).

## Deployment to Cloudflare Pages

### Prerequisites
- Cloudflare account (free tier works)
- GitHub/GitLab repository

### Steps

**Option 1: Automatic (Recommended)**
1. Push your repo to GitHub
2. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository and authorize
5. Framework: select "None" (static site)
6. Deploy

Cloudflare automatically redeploys whenever you push to main.

**Option 2: Manual CLI Deploy**
```bash
npm install
npx wrangler pages deploy
```

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
