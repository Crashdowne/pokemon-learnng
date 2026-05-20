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
- Git repository (push code to GitHub/GitLab)
- Node.js and npm installed

### Steps

1. **Install Wrangler CLI:**
   ```bash
   npm install
   ```

2. **Authenticate with Cloudflare:**
   ```bash
   npx wrangler login
   ```

3. **Deploy to Cloudflare Pages:**
   ```bash
   npm run deploy
   ```

Alternatively, connect your Git repository to Cloudflare Pages in the dashboard for automatic deployments on every push.

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
