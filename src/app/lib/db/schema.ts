import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const clients = sqliteTable("clients", {
  clientId: text("client_id").primaryKey(),
  togglTag: text("toggl_tag").notNull(),
  totalHoursPaid: real("total_hours_paid").notNull().default(0),
  lastPaidDate: text("last_paid_date").notNull(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export const insertClientSchema = createInsertSchema(clients);

// .post('/category', async (request: IRequest) => {
//       const jsonData = await request.json();
//       const categoryData = insertCategorySchema.safeParse({
//         id: uuidv4(),
//         ...(jsonData as object),
//       });
