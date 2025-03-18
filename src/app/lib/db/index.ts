import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
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

const client = createClient({
  url: "file:sqlite.db",
});

export const db = drizzle(client, { schema });
