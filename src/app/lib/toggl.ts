import { z } from "zod";
// import time_entries from "../../../__tests__/mocks/time_entries";

const timeEntrySchema = z.object({
  id: z.number(),
  workspace_id: z.number(),
  project_id: z.number().nullable(),
  task_id: z.number().nullable(),
  billable: z.boolean(),
  start: z.string().datetime({ offset: true }),
  stop: z.string().datetime({ offset: true }).nullable(),
  /** in seconds */
  duration: z.number(),
  description: z.string(),
  tags: z.array(z.string()),
  tag_ids: z.array(z.number()),
  duronly: z.boolean(),
  at: z.string().datetime(),
  server_deleted_at: z.string().datetime().nullable(),
  user_id: z.number(),
  uid: z.number(),
  wid: z.number(),
  pid: z.number().optional(),
});

export type TogglTimeEntry = z.infer<typeof timeEntrySchema>;

export const TOGGL_ESCUELA_WORKSPACE_ID = 8997504;

export class TogglAPI {
  private baseUrl = "https://api.track.toggl.com/api/v9";
  private auth: string;

  constructor() {
    if (!process.env.TOGGL_API_KEY && process.env.NODE_ENV !== "test") {
      throw new Error("TOGGL_API_KEY environment variable is not set");
    }

    this.auth = Buffer.from(`${process.env.TOGGL_API_KEY}:api_token`).toString(
      "base64",
    );
  }

  async getTimeEntries(
    tag: string,
    startDate: Date,
  ): Promise<TogglTimeEntry[]> {
    console.error("getTimeEntries", {
      tag,
      startDate: startDate.toISOString().split("T")[0],
    });
    try {
      // TODO cache data for 1 hour and return last cached time
      // - add endpoint to reset cache

      const response = await fetch(
        `${this.baseUrl}/me/time_entries?start_date=${startDate.toISOString().split("T")[0]}&end_date=${new Date().toISOString().split("T")[0]}`,
        {
          headers: {
            Authorization: `Basic ${this.auth}`,
          },
        },
      );

      if (!response.ok) {
        const body = await response.json();
        console.error({ body });

        throw new Error(`Toggl API error: ${response.statusText}`);
      }

      // const entries: TogglTimeEntry[] = time_entries;
      const entries: TogglTimeEntry[] = await response.json();
      // console.dir(entries[0], { depth: null });
      // console.log({ entries });

      return entries
        .filter((entry) => entry.workspace_id === TOGGL_ESCUELA_WORKSPACE_ID)
        .filter((entry) => entry.tags?.includes(tag))
        .map((entry) => timeEntrySchema.parse(entry));
    } catch (error) {
      throw new Error(`Failed to fetch time entries: ${error}`);
    }
  }

  static generateTogglLink(tag: number): string {
    return `https://track.toggl.com/reports/summary/${TOGGL_ESCUELA_WORKSPACE_ID}/period/thisMonth/tags/${encodeURIComponent(tag)}`;
  }
}
