import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/schema.ts",
  dbCredentials: {
    // url: ":memory:", // inmemory database
    // or
    // url: "sqlite.db",
    // or
    url: "file:sqlite.db", // file: prefix is required by libsql
  },
});
