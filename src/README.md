# Vite React Project

## Installation

1. Install [Node.js](https://nodejs.org/)
2. Install [Bun](https://bun.sh/)
3. Install [Docker](https://www.docker.com/)
4. Setup [Google OAuth](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)

## Running the Project

1. Install dependencies:

   ```bash
   bun install
   ```

2. Add your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` in .env file

3. Start postgres db:

   ```bash
   make start-db
   ```

4. Synchronise prisma schema with db:

   ```bash
   make prisma-push
   ```

5. Start the development server:

   ```bash
   bun run dev
   ```

Visit the app at `http://localhost:3000`.
