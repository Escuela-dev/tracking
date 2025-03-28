import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql/web";
// import { drizzle } from "drizzle-orm/better-sqlite3";
// import { Database } from "limbo-wasm";
import * as schema from "./schema";

// const client = new Database("sqlite.db");

// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL environment variable is not set');
// }

// const client = createClient({
//   url: process.env.DATABASE_URL,
// });

const dbURL =
  process.env.NODE_ENV === "test" ? ":memory:" : process.env.TURSO_DATABASE_URL;

const client = createClient({
  url: dbURL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
