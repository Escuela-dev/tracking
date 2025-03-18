import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  // dialect: "turso",
  schema: "./lib/db/schema.ts",
  dbCredentials: {
    // url: ":memory:", // inmemory database
    // or
    // url: "sqlite.db",
    // or
    url: "file:sqlite.db", // file: prefix is required by libsql
    // url: process.env.TURSO_CONNECTION_URL!,
    // authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
