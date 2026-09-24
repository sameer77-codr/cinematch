# CineMatch

CineMatch is a personalized movie discovery website. It includes recommendations with explanations, searchable movie discovery, ratings, a watchlist, and regional Indian cinema filters for Bollywood and South Indian industries.

This repository is a pnpm workspace. Open the repository root in VS Code; do not open only `artifacts/cinematch`, because the shared packages and workspace lockfile are at the root.

## Project structure

- `artifacts/cinematch/` — CineMatch website (React + Vite)
- `artifacts/api-server/` — shared Express API service
- `artifacts/mockup-sandbox/` — component preview and design sandbox
- `lib/api-client-react/` — generated React API client
- `lib/api-spec/` — OpenAPI source contract
- `lib/api-zod/` — generated Zod schemas
- `lib/db/` — Drizzle database package
- `scripts/` — workspace scripts
- `pnpm-lock.yaml` — exact dependency versions for repeatable installs

## Requirements

- Git
- Node.js 24
- pnpm
- VS Code (recommended extensions: ESLint and Prettier)

Install pnpm if it is not already available:

```sh
npm install --global pnpm
```

## Run in VS Code

1. Clone the GitHub repository and open its root folder in VS Code.
2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Start the website.

   **macOS / Linux:**

   ```sh
   PORT=5173 BASE_PATH=/ pnpm --filter @workspace/cinematch run dev
   ```

   **Windows PowerShell:**

   ```powershell
   $env:PORT = "5173"
   $env:BASE_PATH = "/"
   pnpm --filter @workspace/cinematch run dev
   ```

4. Open `http://localhost:5173`.

Check the project types with:

```sh
pnpm run typecheck
```

The current CineMatch website uses sample movie data and saves ratings, watchlist items, and theme preference in the browser. The API and database workspace packages are included, but the current movie discovery screens do not require a running database.

## Save and push changes with Git

In VS Code, open the **Source Control** view, review the changed files, enter a commit message, and choose **Commit**. After connecting a GitHub remote, use **Sync Changes** or **Push** to send commits to GitHub.

You can also use the terminal:

```sh
git status
git add .
git commit -m "Describe your changes"
git push
```

If you are creating the GitHub repository for the first time:

1. Create an empty repository on GitHub. Do not initialize it with a README or `.gitignore`; this project already has both.
2. In the VS Code terminal, connect the local repository and push its existing `main` branch:

   ```sh
   git remote add origin https://github.com/YOUR-USERNAME/cinematch.git
   git push -u origin main
   ```

Replace `YOUR-USERNAME` with your GitHub username. GitHub may ask you to sign in through VS Code or your browser.

## Keep private files private

The root `.gitignore` excludes dependencies, build output, local Replit files, and environment files such as `.env`. Never commit passwords, API keys, access tokens, or database connection strings.