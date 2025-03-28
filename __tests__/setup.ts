import { migrate } from "drizzle-orm/libsql/migrator";
import { afterAll, afterEach, beforeAll } from "vitest";
// import { reset } from "drizzle-seed";

import { db } from "@/lib/db";
import { type NewClient, clients } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

beforeAll(async () => {
  // await reset(db, schema);
  // create tables
  // await db.run(
  //   sql.raw(`
  //   CREATE TABLE IF NOT EXISTS clients (
  //     client_id TEXT PRIMARY KEY,
  //     toggl_tag TEXT NOT NULL,
  //     total_hours_paid REAL NOT NULL DEFAULT 0,
  //     last_paid_date TEXT NOT NULL
  //   )
  // `),
  // );
  await migrate(db, {
    migrationsFolder: "./src/drizzle",
  });
  await db.insert(clients).values({
    clientId: "123e4567-e89b-12d3-a456-426614174000",
    // clientId: "123e4567-e89b-12d3-a456-426614174000",
    // TODO - create shortui() - e.g. https://github.com/simplyhexagonal/short-unique-id
    togglTag: "Dennis",
    totalHoursPaid: 16,
    lastPaidDate: new Date("2024-12-31").toISOString(),
  } as NewClient);
  console.log("before all tests");

  // const rows = await db.select().from(clients);
  // console.dir(rows, { depth: null });
});

// afterAll(async () => {
//   await client.end();
// });
