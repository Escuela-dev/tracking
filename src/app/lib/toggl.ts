import { z } from "zod";

const timeEntrySchema = z.object({
  id: z.number(),
  workspace_id: z.number(),
  project_id: z.number(),
  task_id: z.number().nullable(),
  billable: z.boolean(),
  start: z.string().datetime(),
  stop: z.string().datetime().nullable(),
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
  pid: z.number(),
});

export type TogglTimeEntry = z.infer<typeof timeEntrySchema>;

export class TogglAPI {
  private baseUrl = "https://api.track.toggl.com/api/v9";
  private auth: string;

  constructor() {
    if (!process.env.TOGGL_API_KEY) {
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
    // console.error("getTimeEntries", { tag, startDate });
    try {
      const response = await fetch(
        `${this.baseUrl}/me/time_entries?start_date=${startDate.toISOString()}&end_date=${new Date().toISOString()}`,
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

      const entries: TogglTimeEntry[] = await response.json();
      // console.dir(entries[0], { depth: null });
      // console.log({ entries });

      return entries
        .filter((entry: any) => entry.tags?.includes(tag))
        .map((entry: any) => timeEntrySchema.parse(entry));
    } catch (error) {
      throw new Error(`Failed to fetch time entries: ${error}`);
    }
  }

  static generateTogglLink(tag: string): string {
    return `https://track.toggl.com/timer?tags=${encodeURIComponent(tag)}`;
  }
}
