import dotenv from "dotenv";

// Imported first by server/index.ts: the api/ handlers read env at import time. `.env.local` wins over `.env`.
dotenv.config({ path: [".env.local", ".env"], quiet: true });
