import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
// import { sq } from 'drizzle-orm/better-sqlite3';
// import { db } from "@/lib/db";
import { type NewClient, clients } from "@/lib/db/schema";

async function seed() {
  try {
    // Create the clients table if it doesn't exist
    // await db.run(`
    //   CREATE TABLE IF NOT EXISTS clients (
    //     client_id TEXT PRIMARY KEY,
    //     toggl_tag TEXT NOT NULL,
    //     total_hours_paid REAL NOT NULL DEFAULT 0,
    //     last_paid_date TEXT NOT NULL
    //   )
    // `);

    const client = createClient({
      // url: "file:sqlite.db",
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const db = drizzle(client);

    // Insert a sample client
    await db.insert(clients).values({
      clientId: "123e4567-e89b-12d3-a456-426614174000",
      // clientId: "123e4567-e89b-12d3-a456-426614174000",
      // TODO - create shortui() - e.g. https://github.com/simplyhexagonal/short-unique-id
      togglTag: "daniel",
      totalHoursPaid: 40,
      lastPaidDate: new Date("2025-01-01").toISOString(),
    } as NewClient);

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
